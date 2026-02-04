'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, BookOpen, Calendar, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { assignmentService } from '@/services/assignment.service';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function AssignmentsPage() {
    const [assignments, setAssignments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [submissionContent, setSubmissionContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            setLoading(true);
            const data = await assignmentService.getAssignments();
            setAssignments(data || []);
        } catch (error) {
            toast.error('Failed to load assignments');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!selectedAssignment || !submissionContent) return;

        try {
            setSubmitting(true);
            await assignmentService.submitAssignment(selectedAssignment.id, { content: submissionContent });
            toast.success('Assignment submitted successfully');
            setIsSubmitModalOpen(false);
            setSubmissionContent('');
            fetchAssignments(); // Refresh to update status
        } catch (error) {
            toast.error('Failed to submit assignment');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusInfo = (assignment: any) => {
        const submission = assignment.submissions?.[0]; // Assuming user's submission is populated

        if (submission) {
            return { label: 'Submitted', color: 'text-green-500 bg-green-500/10 border-green-500/20', icon: CheckCircle2 };
        }

        const isOverdue = new Date(assignment.dueDate) < new Date();
        if (isOverdue) {
            return { label: 'Overdue', color: 'text-destructive bg-destructive/10 border-destructive/20', icon: AlertCircle };
        }

        return { label: 'Pending', color: 'text-orange-500 bg-orange-500/10 border-orange-500/20', icon: FileText };
    };

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
                <p className="text-muted-foreground mt-1">Manage and submit your coursework.</p>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">Loading assignments...</p>
                    </div>
                ) : assignments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {assignments.map((assignment) => {
                            const status = getStatusInfo(assignment);
                            const StatusIcon = status.icon;

                            return (
                                <Card key={assignment.id} className="glass-card border-none hover:ring-1 hover:ring-primary/20 transition-all flex flex-col">
                                    <div className="p-1">
                                        <div className={cn("px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-t-xl flex items-center justify-between gap-2 border-b border-transparent", status.color)}>
                                            <span className="flex items-center gap-1.5">
                                                <StatusIcon className="h-3.5 w-3.5" />
                                                {status.label}
                                            </span>
                                            {assignment.dueDate && (
                                                <span className="opacity-75">
                                                    Due: {format(new Date(assignment.dueDate), 'MMM d')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <CardHeader className="pb-2 pt-4">
                                        <div className="flex justify-between items-start gap-4">
                                            <CardTitle className="text-lg leading-tight">{assignment.title}</CardTitle>
                                        </div>
                                        <CardDescription>{assignment.subject?.name}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1 flex flex-col">
                                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                                            {assignment.description || 'No description provided.'}
                                        </p>

                                        {!assignment.submissions?.[0] && (
                                            <Button
                                                className="w-full mt-auto"
                                                onClick={() => {
                                                    setSelectedAssignment(assignment);
                                                    setIsSubmitModalOpen(true);
                                                }}
                                            >
                                                Submit Work
                                            </Button>
                                        )}
                                        {assignment.submissions?.[0] && (
                                            <div className="bg-secondary/30 p-3 rounded-lg text-xs">
                                                <p className="font-semibold mb-1">Submission Details</p>
                                                <p className="opacity-70 truncate">{assignment.submissions[0].content || 'File submitted'}</p>
                                                <p className="text-[10px] opacity-50 mt-1">Submitted on {format(new Date(assignment.submissions[0].submittedAt), 'PP')}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <Card className="glass-card border-none p-12 text-center text-muted-foreground">
                        <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <h3 className="text-lg font-medium">No active assignments</h3>
                        <p>You're all caught up!</p>
                    </Card>
                )}
            </div>

            <Dialog open={isSubmitModalOpen} onOpenChange={setIsSubmitModalOpen}>
                <DialogContent className="glass-card border-none sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Submit Assignment</DialogTitle>
                        <DialogDescription>
                            Submitting: <span className="font-bold text-primary">{selectedAssignment?.title}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Your Answer / Submission</Label>
                            <Textarea
                                placeholder="Type your answer here..."
                                className="glass border-white/10 min-h-[150px]"
                                value={submissionContent}
                                onChange={(e) => setSubmissionContent(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsSubmitModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={submitting}>
                            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
