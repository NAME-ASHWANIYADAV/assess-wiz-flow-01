import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Trophy, 
  Target, 
  Clock, 
  Users, 
  BarChart3, 
  Play,
  Star,
  TrendingUp,
  Award,
  BookOpen,
  Settings,
  User,
  LogOut
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalAssessments: 12,
    completedAssessments: 8,
    averageScore: 87,
    streak: 5,
    rank: 23,
    points: 2450
  });
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      setUser(user);
    };

    getUser();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Error logging out');
    } else {
      toast.success('Logged out successfully');
      navigate('/');
    }
  };

  const quickStats = [
    {
      title: 'Total Assessments',
      value: stats.totalAssessments,
      icon: BookOpen,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Average Score',
      value: `${stats.averageScore}%`,
      icon: Target,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'Current Streak',
      value: `${stats.streak} days`,
      icon: TrendingUp,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      title: 'Global Rank',
      value: `#${stats.rank}`,
      icon: Trophy,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ];

  const recentAssessments = [
    { name: 'JavaScript Fundamentals', score: 92, date: '2 hours ago', status: 'completed' },
    { name: 'React Components', score: 88, date: '1 day ago', status: 'completed' },
    { name: 'CSS Grid & Flexbox', score: 0, date: 'Started', status: 'in-progress' },
    { name: 'Node.js Basics', score: 0, date: 'Not started', status: 'upcoming' }
  ];

  const achievements = [
    { name: 'First Assessment', description: 'Complete your first assessment', earned: true },
    { name: 'Perfect Score', description: 'Score 100% on any assessment', earned: true },
    { name: 'Streak Master', description: '5-day learning streak', earned: true },
    { name: 'Top Performer', description: 'Rank in top 50', earned: false }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Assess AI Wizard</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}!</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-secondary/20 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">{stats.points} pts</span>
              </div>
              
              <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
                <User className="w-5 h-5" />
              </Button>
              
              <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
                <Settings className="w-5 h-5" />
              </Button>
              
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="bg-gradient-primary rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Ready for your next challenge?</h2>
                <p className="opacity-90">Continue learning and boost your skills with AI-powered assessments.</p>
              </div>
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => navigate('/assessment')}
                className="bg-white text-primary hover:bg-white/90"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Assessment
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                        <IconComponent className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Learning Progress
                  </CardTitle>
                  <CardDescription>
                    Track your assessment completion and performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Overall Completion</span>
                      <span>{Math.round((stats.completedAssessments / stats.totalAssessments) * 100)}%</span>
                    </div>
                    <Progress value={(stats.completedAssessments / stats.totalAssessments) * 100} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Average Performance</span>
                      <span>{stats.averageScore}%</span>
                    </div>
                    <Progress value={stats.averageScore} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Assessments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recent Assessments</CardTitle>
                      <CardDescription>Your latest assessment activities</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => navigate('/assessments')}>
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentAssessments.map((assessment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            assessment.status === 'completed' ? 'bg-green-100 dark:bg-green-900/20' :
                            assessment.status === 'in-progress' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                            'bg-gray-100 dark:bg-gray-800'
                          }`}>
                            <BookOpen className={`w-5 h-5 ${
                              assessment.status === 'completed' ? 'text-green-600' :
                              assessment.status === 'in-progress' ? 'text-yellow-600' :
                              'text-gray-500'
                            }`} />
                          </div>
                          <div>
                            <h4 className="font-medium">{assessment.name}</h4>
                            <p className="text-sm text-muted-foreground">{assessment.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {assessment.status === 'completed' && (
                            <div className="text-lg font-bold text-green-600">{assessment.score}%</div>
                          )}
                          {assessment.status === 'in-progress' && (
                            <Button size="sm" onClick={() => navigate('/assessment')}>
                              Continue
                            </Button>
                          )}
                          {assessment.status === 'upcoming' && (
                            <Button size="sm" variant="outline" onClick={() => navigate('/assessment')}>
                              Start
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          achievement.earned ? 'bg-yellow-100 dark:bg-yellow-900/20' : 'bg-gray-100 dark:bg-gray-800'
                        }`}>
                          <Trophy className={`w-4 h-4 ${
                            achievement.earned ? 'text-yellow-600' : 'text-gray-400'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{achievement.name}</h4>
                          <p className="text-xs text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Leaderboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Leaderboard
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/leaderboard')}>
                      View Full
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                      <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Alex Johnson</p>
                        <p className="text-xs text-muted-foreground">3,250 pts</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 rounded-lg">
                      <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Sarah Chen</p>
                        <p className="text-xs text-muted-foreground">3,100 pts</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-primary/10">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">{stats.rank}</div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">You</p>
                        <p className="text-xs text-muted-foreground">{stats.points} pts</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;