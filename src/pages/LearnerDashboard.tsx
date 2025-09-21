import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Search, Trophy, Calendar, Star, TrendingUp, BookOpen, LogOut, Settings, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const LearnerDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [searchLink, setSearchLink] = useState('');
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchUserData();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate('/auth');
      return;
    }

    setUser(session.user);
    
    // Fetch profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .maybeSingle();
    
    if (!profileData || profileData.role !== 'learner') {
      navigate('/auth');
      return;
    }
    
    setProfile(profileData);
  };

  const fetchUserData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Fetch submissions
    const { data: submissionData } = await supabase
      .from('assessment_submissions')
      .select(`
        *,
        assignments (
          title,
          creator_id
        )
      `)
      .eq('learner_id', session.user.id)
      .order('submitted_at', { ascending: false });
    
    setSubmissions(submissionData || []);

    // Fetch achievements
    const { data: achievementData } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', session.user.id)
      .order('earned_at', { ascending: false });
    
    setAchievements(achievementData || []);

    // Fetch leaderboard (top performers)
    const { data: leaderboardData } = await supabase
      .from('assessment_submissions')
      .select(`
        learner_name,
        total_score,
        max_score,
        submitted_at
      `)
      .order('total_score', { ascending: false })
      .limit(10);
    
    setLeaderboard(leaderboardData || []);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleTakeAssignment = () => {
    if (!searchLink.trim()) {
      toast({
        title: "Invalid Link",
        description: "Please enter a valid assignment link",
        variant: "destructive"
      });
      return;
    }

    // Extract share link from full URL or use as-is
    const linkParts = searchLink.split('/');
    const shareId = linkParts[linkParts.length - 1];
    
    navigate(`/assignment/${shareId}`);
  };

  const stats = [
    {
      title: "Assessments Taken",
      value: submissions.length,
      icon: BookOpen,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Average Score",
      value: submissions.length > 0 
        ? Math.round(submissions.reduce((acc, sub) => acc + (sub.total_score / sub.max_score * 100), 0) / submissions.length) + "%"
        : "0%",
      icon: TrendingUp,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      title: "Achievements",
      value: achievements.length,
      icon: Trophy,
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      title: "Rank",
      value: "#--",
      icon: Star,
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  const recentSubmissions = submissions.slice(0, 5);

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/70 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">Learner Dashboard</span>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                Learner
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {profile.full_name}
              </span>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Take Assignment Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold mb-2">Take an Assessment</h2>
              <p className="text-primary-foreground/90 mb-6">
                Enter an assignment link shared by your instructor to start learning
              </p>
              
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Input
                    value={searchLink}
                    onChange={(e) => setSearchLink(e.target.value)}
                    placeholder="Paste assignment link or enter share code..."
                    className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
                  />
                </div>
                <Button 
                  onClick={handleTakeAssignment}
                  variant="secondary"
                  className="px-8"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Start
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.gradient} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Assessments */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Recent Assessments</h3>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>

              <div className="space-y-4">
                {recentSubmissions.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No assessments taken yet</p>
                    <p className="text-sm text-muted-foreground">Start by taking your first assessment above</p>
                  </div>
                ) : (
                  recentSubmissions.map((submission) => {
                    const percentage = Math.round((submission.total_score / submission.max_score) * 100);
                    return (
                      <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                        <div className="flex-1">
                          <h4 className="font-medium">{submission.assignments?.title || 'Untitled Assignment'}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(submission.submitted_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-semibold">{percentage}%</p>
                            <p className="text-sm text-muted-foreground">
                              {submission.total_score}/{submission.max_score}
                            </p>
                          </div>
                          <Progress value={percentage} className="w-16" />
                          <Badge variant={percentage >= 80 ? "default" : percentage >= 60 ? "secondary" : "destructive"}>
                            {percentage >= 80 ? "Excellent" : percentage >= 60 ? "Good" : "Needs Work"}
                          </Badge>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Achievements */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Achievements</h3>
              
              <div className="space-y-3">
                {achievements.length === 0 ? (
                  <div className="text-center py-4">
                    <Trophy className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No achievements yet</p>
                  </div>
                ) : (
                  achievements.slice(0, 3).map((achievement) => (
                    <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                      <Trophy className="w-8 h-8 text-yellow-500" />
                      <div>
                        <p className="font-medium text-sm">{achievement.achievement_name}</p>
                        <p className="text-xs text-muted-foreground">{achievement.achievement_description}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Leaderboard Preview */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Leaderboard</h3>
              
              <div className="space-y-3">
                {leaderboard.slice(0, 5).map((entry, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-orange-500 text-white' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium">{entry.learner_name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {Math.round((entry.total_score / entry.max_score) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
              
              <Button variant="ghost" className="w-full mt-4" size="sm">
                View Full Leaderboard
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LearnerDashboard;