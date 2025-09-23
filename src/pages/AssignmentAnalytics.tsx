import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';

const AssignmentAnalytics = () => {
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    fetchAssignmentData();
  }, [assignmentId]);

  const fetchAssignmentData = async () => {
    if (!assignmentId) return;

    // Fetch assignment details
    const { data: assignmentData } = await supabase
      .from('assignments')
      .select('*')
      .eq('id', assignmentId)
      .single();
    setAssignment(assignmentData);

    // Fetch submissions
    const { data: submissionsData } = await supabase
      .from('assessment_submissions')
      .select('*')
      .eq('assignment_id', assignmentId)
      .order('total_score', { ascending: false });
    console.log('Submissions data:', submissionsData);
    setSubmissions(submissionsData || []);

    // Set leaderboard data
    setLeaderboard(submissionsData || []);
  };

  if (!assignment) {
    return <div>Loading...</div>;
  }

  if (submissions.length === 0) {
    return (
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-4">{assignment.title} - Analytics</h1>
        <p>No submissions for this assignment yet.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-4">{assignment.title} - Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Submitted At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell>{submission.learner_name}</TableCell>
                      <TableCell>{submission.total_score}/{submission.max_score}</TableCell>
                      <TableCell>{new Date(submission.created_at).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
                Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                {leaderboard.map((entry, index) => (
                  <li key={entry.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-lg font-bold w-8">{index + 1}</span>
                      <span>{entry.learner_name}</span>
                    </div>
                    <Badge variant="secondary">{entry.total_score} pts</Badge>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AssignmentAnalytics;
