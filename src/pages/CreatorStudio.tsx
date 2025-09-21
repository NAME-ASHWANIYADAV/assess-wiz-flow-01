import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Brain, Plus, FileText, Link2, Upload, Share, BarChart3, Users, LogOut, Settings, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const CreatorStudio = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('create');
  
  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    contentType: 'text',
    textContent: '',
    fileContent: null as File | null,
    urlContent: ''
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchAssignments();
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
    
    if (!profileData || profileData.role !== 'creator') {
      navigate('/auth');
      return;
    }
    
    setProfile(profileData);
  };

  const fetchAssignments = async () => {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching assignments:', error);
      return;
    }
    
    setAssignments(data || []);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleFormChange = (field: string, value: any) => {
    setAssignmentForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateShareLink = () => {
    return `${Math.random().toString(36).substring(2, 8)}-${Date.now().toString(36)}`;
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let contentData: any = {};
      
      if (assignmentForm.contentType === 'text') {
        contentData = { text: assignmentForm.textContent };
      } else if (assignmentForm.contentType === 'url') {
        contentData = { url: assignmentForm.urlContent };
      } else if (assignmentForm.contentType === 'file' && assignmentForm.fileContent) {
        // For now, we'll store file info - you can extend this to upload to Supabase Storage
        contentData = { 
          fileName: assignmentForm.fileContent.name,
          fileSize: assignmentForm.fileContent.size,
          fileType: assignmentForm.fileContent.type
        };
      }

      const shareLink = generateShareLink();

      const { error } = await supabase
        .from('assignments')
        .insert({
          creator_id: user.id,
          title: assignmentForm.title,
          description: assignmentForm.description,
          content_type: assignmentForm.contentType,
          content_data: contentData,
          share_link: shareLink,
          questions: [] // Will be populated by AI later
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Success!",
        description: "Assignment created successfully. Ready for AI generation!",
      });

      // Reset form
      setAssignmentForm({
        title: '',
        description: '',
        contentType: 'text',
        textContent: '',
        fileContent: null,
        urlContent: ''
      });

      // Refresh assignments
      await fetchAssignments();
      setActiveTab('manage');

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create assignment",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyShareLink = (shareLink: string) => {
    const fullLink = `${window.location.origin}/assignment/${shareLink}`;
    navigator.clipboard.writeText(fullLink);
    toast({
      title: "Link Copied!",
      description: "Share link copied to clipboard",
    });
  };

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
                <span className="text-xl font-bold">Creator Studio</span>
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                Creator
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

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="create">Create</TabsTrigger>
            <TabsTrigger value="manage">Manage</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="max-w-4xl mx-auto p-8">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold mb-2">Create New Assignment</h2>
                  <p className="text-muted-foreground">
                    Provide content and let AI generate comprehensive questions for your learners
                  </p>
                </div>

                <form onSubmit={handleCreateAssignment} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Assignment Title</Label>
                      <Input
                        id="title"
                        value={assignmentForm.title}
                        onChange={(e) => handleFormChange('title', e.target.value)}
                        placeholder="e.g., The Water Cycle"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contentType">Content Type</Label>
                      <Select
                        value={assignmentForm.contentType}
                        onValueChange={(value) => handleFormChange('contentType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4" />
                              <span>Text Topic</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="file">
                            <div className="flex items-center space-x-2">
                              <Upload className="w-4 h-4" />
                              <span>Upload File</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="url">
                            <div className="flex items-center space-x-2">
                              <Link2 className="w-4 h-4" />
                              <span>Article URL</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      value={assignmentForm.description}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      placeholder="Add any additional context or instructions..."
                      rows={3}
                    />
                  </div>

                  {/* Content Input Based on Type */}
                  {assignmentForm.contentType === 'text' && (
                    <div className="space-y-2">
                      <Label htmlFor="textContent">Topic or Content</Label>
                      <Textarea
                        id="textContent"
                        value={assignmentForm.textContent}
                        onChange={(e) => handleFormChange('textContent', e.target.value)}
                        placeholder="Describe the topic or paste your content here..."
                        rows={6}
                        required
                      />
                    </div>
                  )}

                  {assignmentForm.contentType === 'file' && (
                    <div className="space-y-2">
                      <Label htmlFor="fileContent">Upload File</Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                        <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                        <Input
                          id="fileContent"
                          type="file"
                          onChange={(e) => handleFormChange('fileContent', e.target.files?.[0] || null)}
                          accept=".pdf,.doc,.docx,.txt"
                          className="max-w-xs mx-auto"
                        />
                        <p className="text-sm text-muted-foreground mt-2">
                          Supports PDF, DOC, DOCX, TXT files
                        </p>
                      </div>
                    </div>
                  )}

                  {assignmentForm.contentType === 'url' && (
                    <div className="space-y-2">
                      <Label htmlFor="urlContent">Article URL</Label>
                      <Input
                        id="urlContent"
                        type="url"
                        value={assignmentForm.urlContent}
                        onChange={(e) => handleFormChange('urlContent', e.target.value)}
                        placeholder="https://example.com/article"
                        required
                      />
                    </div>
                  )}

                  <div className="flex justify-end space-x-4 pt-6">
                    <Button type="button" variant="outline" onClick={() => navigate('/')}>
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full"></div>
                          <span>Creating...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Plus className="w-4 h-4" />
                          <span>Create Assignment</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="manage">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">Your Assignments</h2>
                <Button onClick={() => setActiveTab('create')}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Assignment
                </Button>
              </div>

              <div className="grid gap-6">
                {assignments.length === 0 ? (
                  <Card className="p-12 text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No assignments yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first assignment to get started with AI-powered learning
                    </p>
                    <Button onClick={() => setActiveTab('create')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Assignment
                    </Button>
                  </Card>
                ) : (
                  assignments.map((assignment) => (
                    <Card key={assignment.id} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-1">{assignment.title}</h3>
                          {assignment.description && (
                            <p className="text-muted-foreground">{assignment.description}</p>
                          )}
                        </div>
                        <Badge variant={assignment.is_active ? "default" : "secondary"}>
                          {assignment.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Created: {new Date(assignment.created_at).toLocaleDateString()}</span>
                          <span>Type: {assignment.content_type}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyShareLink(assignment.share_link)}
                          >
                            <Share className="w-4 h-4 mr-1" />
                            Share
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            Preview
                          </Button>
                          <Button variant="outline" size="sm">
                            <BarChart3 className="w-4 h-4 mr-1" />
                            Analytics
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="analytics">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Assignments</p>
                      <p className="text-3xl font-bold">{assignments.length}</p>
                    </div>
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                </Card>
                
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Submissions</p>
                      <p className="text-3xl font-bold">0</p>
                    </div>
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                </Card>
                
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                      <p className="text-3xl font-bold">--</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-orange-600" />
                  </div>
                </Card>
              </div>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <p className="text-muted-foreground text-center py-8">
                    No recent activity to display
                  </p>
                </div>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CreatorStudio;