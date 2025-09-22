import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Brain, 
  Plus, 
  Users, 
  BookOpen, 
  Settings, 
  LogOut, 
  Share, 
  Copy, 
  GraduationCap, 
  UserCheck,
  Search,
  Calendar,
  Trophy,
  TrendingUp
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [createdClasses, setCreatedClasses] = useState<any[]>([]);
  const [joinedClasses, setJoinedClasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [showJoinClass, setShowJoinClass] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  const [classForm, setClassForm] = useState({
    name: '',
    description: '',
    subject: ''
  });
  
  const [joinCode, setJoinCode] = useState('');

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
    
    if (!profileData) {
      navigate('/auth');
      return;
    }
    
    setProfile(profileData);
  };

  const fetchUserData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Fetch classes created by user
    const { data: createdClassesData } = await supabase
      .from('classes')
      .select('*')
      .eq('creator_id', session.user.id)
      .order('created_at', { ascending: false });
    
    setCreatedClasses(createdClassesData || []);

    // Fetch classes user has joined
    const { data: joinedClassesData } = await supabase
      .from('class_memberships')
      .select(`
        *,
        classes (*)
      `)
      .eq('user_id', session.user.id)
      .order('joined_at', { ascending: false });
    
    setJoinedClasses(joinedClassesData || []);
  };

  const generateClassCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const generateInviteLink = () => {
    return `${Math.random().toString(36).substring(2, 8)}-${Date.now().toString(36)}`;
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const classCode = generateClassCode();
      const inviteLink = generateInviteLink();

      const { error } = await supabase
        .from('classes')
        .insert({
          creator_id: user.id,
          name: classForm.name,
          description: classForm.description,
          subject: classForm.subject,
          class_code: classCode,
          invite_link: inviteLink
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Class created successfully",
      });

      setClassForm({ name: '', description: '', subject: '' });
      setShowCreateClass(false);
      await fetchUserData();

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create class",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

 // ...existing code...

const handleJoinClass = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    // 1. Find class by code or invite link
    const { data: classData, error: fetchError } = await supabase
      .from('classes')
      .select('*')
      .or(`class_code.eq.${joinCode.trim().toUpperCase()},invite_link.eq.${joinCode.trim()}`)
      .maybeSingle();

    if (fetchError || !classData) {
      toast({
        title: "Class not found",
        description: "Invalid class code or invite link",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // 2. Check if already joined
    const { data: existingMembership } = await supabase
      .from('class_memberships')
      .select('*')
      .eq('user_id', user.id)
      .eq('class_id', classData.id)
      .maybeSingle();

    if (existingMembership) {
      toast({
        title: "Already joined",
        description: "You're already a member of this class",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // 3. Join the class
    const { error } = await supabase
      .from('class_memberships')
      .insert({
        user_id: user.id,
        class_id: classData.id,
        role: 'student'
      });

    if (error) throw error;

    toast({
      title: "Success!",
      description: `Joined ${classData.name} successfully`,
    });

    setJoinCode('');
    setShowJoinClass(false);

    // 4. Redirect to the class page
    navigate(`/class/${classData.id}`);

  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message || "Failed to join class",
      variant: "destructive"
    });
  } finally {
    setIsLoading(false);
  }
};

  const copyClassCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Class code copied to clipboard",
    });
  };

  const copyInviteLink = (inviteLink: string) => {
    const fullLink = `${window.location.origin}/join/${inviteLink}`;
    navigator.clipboard.writeText(fullLink);
    toast({
      title: "Copied!",
      description: "Invite link copied to clipboard",
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const totalStats = {
    classesCreated: createdClasses.length,
    classesJoined: joinedClasses.length,
    totalAssignments: 0, // Will be calculated from assignments
    averageScore: 0 // Will be calculated from submissions
  };

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
                <span className="text-xl font-bold">EduGenius AI</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {profile.full_name}
              </span>
              
              {/* Create Class Button */}
              <Dialog open={showCreateClass} onOpenChange={setShowCreateClass}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-primary/80">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Class
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Class</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateClass} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="className">Class Name</Label>
                      <Input
                        id="className"
                        value={classForm.name}
                        onChange={(e) => setClassForm({...classForm, name: e.target.value})}
                        placeholder="e.g., Physics 101"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={classForm.subject}
                        onChange={(e) => setClassForm({...classForm, subject: e.target.value})}
                        placeholder="e.g., Physics"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={classForm.description}
                        onChange={(e) => setClassForm({...classForm, description: e.target.value})}
                        placeholder="Class description..."
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setShowCreateClass(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create Class"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Join Class Button */}
              <Dialog open={showJoinClass} onOpenChange={setShowJoinClass}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Search className="w-4 h-4 mr-2" />
                    Join Class
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Join a Class</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleJoinClass} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="joinCode">Class Code or Invite Link</Label>
                      <Input
                        id="joinCode"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        placeholder="Enter class code or paste invite link"
                        required
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setShowJoinClass(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Joining..." : "Join Class"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

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

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="teaching">Teaching</TabsTrigger>
            <TabsTrigger value="enrolled">Enrolled</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Quick Stats */}
              <div className="grid md:grid-cols-4 gap-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Classes Created</p>
                      <p className="text-3xl font-bold">{totalStats.classesCreated}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <UserCheck className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </Card>
                
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Classes Joined</p>
                      <p className="text-3xl font-bold">{totalStats.classesJoined}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Assignments</p>
                      <p className="text-3xl font-bold">{totalStats.totalAssignments}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                      <p className="text-3xl font-bold">{totalStats.averageScore}%</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No recent activity</p>
                  <p className="text-sm text-muted-foreground">Create or join a class to get started</p>
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="teaching">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Classes You Teach</h2>
                <Button onClick={() => setShowCreateClass(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Class
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {createdClasses.map((classItem) => (
                  <Card 
                    key={classItem.id} 
                    className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/class/${classItem.id}`)}
                  >
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold">{classItem.name}</h3>
                        <p className="text-sm text-muted-foreground">{classItem.subject}</p>
                        {classItem.description && (
                          <p className="text-sm text-muted-foreground mt-2">{classItem.description}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <Badge variant="secondary">{classItem.class_code}</Badge>
                        <span className="text-muted-foreground">
                          {new Date(classItem.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyClassCode(classItem.class_code);
                          }}
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Code
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyInviteLink(classItem.invite_link);
                          }}
                        >
                          <Share className="w-3 h-3 mr-1" />
                          Link
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}

                {createdClasses.length === 0 && (
                  <Card className="p-8 text-center col-span-full">
                    <UserCheck className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No classes yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first class to start teaching with AI-powered assignments
                    </p>
                    <Button onClick={() => setShowCreateClass(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Class
                    </Button>
                  </Card>
                )}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="enrolled">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Classes You're Enrolled In</h2>
                <Button onClick={() => setShowJoinClass(true)}>
                  <Search className="w-4 h-4 mr-2" />
                  Join Class
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {joinedClasses.map((membership) => (
                  <Card 
                    key={membership.id} 
                    className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/class/${membership.classes.id}`)}
                  >
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold">{membership.classes.name}</h3>
                        <p className="text-sm text-muted-foreground">{membership.classes.subject}</p>
                        {membership.classes.description && (
                          <p className="text-sm text-muted-foreground mt-2">{membership.classes.description}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <Badge variant="outline">Student</Badge>
                        <span className="text-muted-foreground">
                          Joined {new Date(membership.joined_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>Class Code: {membership.classes.class_code}</span>
                      </div>
                    </div>
                  </Card>
                ))}

                {joinedClasses.length === 0 && (
                  <Card className="p-8 text-center col-span-full">
                    <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No classes joined</h3>
                    <p className="text-muted-foreground mb-4">
                      Join a class using a class code or invite link to start learning
                    </p>
                    <Button onClick={() => setShowJoinClass(true)}>
                      <Search className="w-4 h-4 mr-2" />
                      Join First Class
                    </Button>
                  </Card>
                )}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;