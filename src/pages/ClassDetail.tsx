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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  Users, 
  BookOpen, 
  Plus, 
  Upload,
  Brain,
  FileText,
  Trophy,
  Clock,
  CheckCircle,
  Target,
  Award,
  BarChart3
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ClassDetail = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [user, setUser] = useState<any>(null);
  const [classData, setClassData] = useState<any>(null);
  const [isCreator, setIsCreator] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [generatingAssignment, setGeneratingAssignment] = useState(false);
  
  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    topic: '',
    questionType: 'multiple-choice',
    numQuestions: 10,
    difficulty: 'medium',
    contentType: 'ai-generated',
    timeLimit: 60,
    uploadedFile: null as File | null
  });

  useEffect(() => {
    fetchClassData();
  }, [classId]);

  const fetchClassData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      
      setUser(session.user);

      // Fetch class data
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('*')
        .eq('id', classId)
        .single();

      if (classError) throw classError;
      
      setClassData(classData);
      setIsCreator(classData.creator_id === session.user.id);

      // Fetch class members
      const { data: membersData, error: membersError } = await supabase
        .from('class_memberships')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .eq('class_id', classId);

      if (membersError) throw membersError;
      setMembers(membersData || []);

      // Fetch assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('assignments')
        .select('*')
        .eq('class_id', classId)
        .order('created_at', { ascending: false });

      if (assignmentsError) throw assignmentsError;
      setAssignments(assignmentsData || []);

      // If creator, fetch submissions
      if (classData.creator_id === session.user.id) {
        const { data: submissionsData, error: submissionsError } = await supabase
          .from('assessment_submissions')
          .select(`
            *,
            assignments:assignment_id (
              title
            )
          `)
          .in('assignment_id', assignmentsData?.map(a => a.id) || []);

        if (submissionsError) throw submissionsError;
        setSubmissions(submissionsData || []);
      }

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load class data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateAssignmentWithAI = async () => {
    setGeneratingAssignment(true);
    
    try {
      const response = await supabase.functions.invoke('generate-assignment', {
        body: {
          topic: assignmentForm.topic,
          description: assignmentForm.description,
          questionType: assignmentForm.questionType,
          numQuestions: assignmentForm.numQuestions,
          difficulty: assignmentForm.difficulty
        }
      });

      if (response.error) throw response.error;

      const generatedQuestions = response.data.questions;
      
      // Create assignment with generated questions
      const shareLink = `${Math.random().toString(36).substring(2, 8)}-${Date.now().toString(36)}`;
      
      const { error } = await supabase
        .from('assignments')
        .insert({
          creator_id: user.id,
          class_id: classId,
          title: assignmentForm.title,
          description: assignmentForm.description,
          content_type: 'ai-generated',
          content_data: { 
            topic: assignmentForm.topic,
            uploadedDocument: assignmentForm.uploadedFile?.name || null
          },
          questions: generatedQuestions,
          share_link: shareLink,
          time_limit: assignmentForm.timeLimit
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Assignment generated and created successfully",
      });

      setShowCreateAssignment(false);
      setAssignmentForm({
        title: '',
        description: '',
        topic: '',
        questionType: 'multiple-choice',
        numQuestions: 10,
        difficulty: 'medium',
        contentType: 'ai-generated',
        timeLimit: 60,
        uploadedFile: null
      });
      
      await fetchClassData();

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate assignment",
        variant: "destructive"
      });
    } finally {
      setGeneratingAssignment(false);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (assignmentForm.contentType === 'ai-generated') {
      await generateAssignmentWithAI();
    } else {
      // Handle manual/upload assignment creation
      toast({
        title: "Feature coming soon",
        description: "Manual assignment creation will be available soon",
      });
    }
  };

  const navigateToAssignment = (assignment: any) => {
    if (isCreator) {
      // Navigate to assignment results view
      navigate(`/assignment/${assignment.share_link}/results`);
    } else {
      // Navigate to take assignment
      navigate(`/assignment/${assignment.share_link}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Class not found</h2>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
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
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{classData.name}</h1>
                <p className="text-muted-foreground">{classData.subject}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {isCreator && (
                <>
                  <Badge variant="default">Creator</Badge>
                  <Dialog open={showCreateAssignment} onOpenChange={setShowCreateAssignment}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Assignment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Assignment</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateAssignment} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Assignment Title</Label>
                        <Input
                          id="title"
                          value={assignmentForm.title}
                          onChange={(e) => setAssignmentForm({...assignmentForm, title: e.target.value})}
                          placeholder="e.g., Physics Quiz - Chapter 1"
                          required
                        />
                      </div>
                      
                       <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={assignmentForm.description}
                          onChange={(e) => setAssignmentForm({...assignmentForm, description: e.target.value})}
                          placeholder="Assignment description or upload PDF/DOCX document for AI analysis..."
                          rows={3}
                        />
                      </div>

                      {/* Document Upload */}
                      <div className="space-y-2">
                        <Label htmlFor="document">Upload Document (PDF/DOCX)</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="file"
                            accept=".pdf,.docx,.doc"
                            onChange={(e) => setAssignmentForm({...assignmentForm, uploadedFile: e.target.files?.[0] || null})}
                            className="flex-1"
                          />
                          <Button type="button" variant="outline" size="sm">
                            <Upload className="w-4 h-4" />
                          </Button>
                        </div>
                        {assignmentForm.uploadedFile && (
                          <p className="text-sm text-muted-foreground">
                            Selected: {assignmentForm.uploadedFile.name}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contentType">Assignment Type</Label>
                        <Select 
                          value={assignmentForm.contentType} 
                          onValueChange={(value) => setAssignmentForm({...assignmentForm, contentType: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ai-generated">AI Generated</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Time Limit */}
                      <div className="space-y-2">
                        <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                        <Select 
                          value={assignmentForm.timeLimit.toString()} 
                          onValueChange={(value) => setAssignmentForm({...assignmentForm, timeLimit: parseInt(value)})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="45">45 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="90">1.5 hours</SelectItem>
                            <SelectItem value="120">2 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {assignmentForm.contentType === 'ai-generated' && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="topic">Topic</Label>
                            <Input
                              id="topic"
                              value={assignmentForm.topic}
                              onChange={(e) => setAssignmentForm({...assignmentForm, topic: e.target.value})}
                              placeholder="e.g., Newton's Laws of Motion"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="questionType">Question Type</Label>
                              <Select 
                                value={assignmentForm.questionType} 
                                onValueChange={(value) => setAssignmentForm({...assignmentForm, questionType: value})}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                                  <SelectItem value="true-false">True/False</SelectItem>
                                  <SelectItem value="short-answer">Short Answer</SelectItem>
                                  <SelectItem value="mixed">Mixed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="numQuestions">Number of Questions</Label>
                              <Select 
                                value={assignmentForm.numQuestions.toString()} 
                                onValueChange={(value) => setAssignmentForm({...assignmentForm, numQuestions: parseInt(value)})}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="5">5 Questions</SelectItem>
                                  <SelectItem value="10">10 Questions</SelectItem>
                                  <SelectItem value="15">15 Questions</SelectItem>
                                  <SelectItem value="20">20 Questions</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="difficulty">Difficulty Level</Label>
                            <Select 
                              value={assignmentForm.difficulty} 
                              onValueChange={(value) => setAssignmentForm({...assignmentForm, difficulty: value})}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="easy">Easy</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="hard">Hard</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}

                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setShowCreateAssignment(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={generatingAssignment}>
                          {generatingAssignment ? (
                            <>
                              <Brain className="w-4 h-4 mr-2 animate-pulse" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-2" />
                              Create Assignment
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue={isCreator ? "overview" : "assignments"} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Class Info */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Class Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Subject</p>
                    <p className="font-medium">{classData.subject}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Class Code</p>
                    <p className="font-medium">{classData.class_code}</p>
                  </div>
                  {classData.description && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground mb-1">Description</p>
                      <p className="font-medium">{classData.description}</p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Members */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Class Members ({members.length})
                  </h3>
                </div>
                <div className="grid gap-4">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/70 rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground font-semibold">
                          {member.profiles?.full_name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{member.profiles?.full_name || 'Unknown User'}</p>
                        <p className="text-sm text-muted-foreground">
                          Joined {new Date(member.joined_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={member.role === 'creator' ? 'default' : 'secondary'}>
                        {member.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="assignments">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Assignments</h2>
                {isCreator && (
                  <Button onClick={() => setShowCreateAssignment(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Assignment
                  </Button>
                )}
              </div>

              <div className="grid gap-6">
                {assignments.map((assignment) => (
                  <Card key={assignment.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigateToAssignment(assignment)}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{assignment.title}</h3>
                        {assignment.description && (
                          <p className="text-muted-foreground mb-4">{assignment.description}</p>
                        )}
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 mr-1" />
                            {assignment.questions?.length || 0} Questions
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            Created {new Date(assignment.created_at).toLocaleDateString()}
                          </div>
                          {isCreator && (
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {submissions.filter(s => s.assignment_id === assignment.id).length} Submissions
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={assignment.is_active ? "default" : "secondary"}>
                          {assignment.is_active ? "Active" : "Inactive"}
                        </Badge>
                        {isCreator ? (
                          <Button variant="outline" size="sm">
                            View Results
                          </Button>
                        ) : (
                          <Button size="sm">
                            Take Assignment
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
                
                {assignments.length === 0 && (
                  <Card className="p-12 text-center">
                    <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No assignments yet</h3>
                    <p className="text-muted-foreground mb-4">
                      {isCreator ? "Create your first assignment to get started" : "No assignments have been posted yet"}
                    </p>
                    {isCreator && (
                      <Button onClick={() => setShowCreateAssignment(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Assignment
                      </Button>
                    )}
                  </Card>
                )}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="leaderboard">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold flex items-center">
                    <Trophy className="w-5 h-5 mr-2" />
                    Class Leaderboard
                  </h3>
                </div>
                
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No submissions yet</p>
                  <p className="text-sm text-muted-foreground">
                    {isCreator ? "Students will appear here after completing assignments" : "Complete assignments to see your ranking"}
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

export default ClassDetail;