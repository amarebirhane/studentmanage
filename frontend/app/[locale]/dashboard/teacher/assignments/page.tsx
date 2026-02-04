'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    ClipboardList,
    Plus,
    Calendar as CalendarIcon,
    Users,
    BookOpen,
    CheckCircle2,
    Clock,
    MoreVertical,
    Trash2,
    FileText
} from 'lucide-react';
import { assignmentService } from '@/services/assignment.service';
import { teacherService } from '@/services/teacher.service';
import { subjectService } from '@/services/subject.service';
import { toast } from 'react-hot-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';

export default function AssignmentsPage() {
    const [assignments, setAssignments] = useState<any[]>([]);
    const [sections, setSections] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('list');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [assignmentToDelete, setAssignmentToDelete] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        subjectId: '',
        sectionId: '',
        dueDate: '',
    });

    useEffect(() => {
        const loadInitData = async () => {
            try {
                setLoading(true);
                const [assignmentsData, teachersData, subjectsData] = await Promise.all([
                    assignmentService.getAssignments(),
                    teacherService.getTeacherClasses(),
                    subjectService.getSubjects()
                ]);

                setAssignments(assignmentsData || []);
                setSections(teachersData || []);
                setSubjects(subjectsData || []);
            } catch (error) {
                toast.error('Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        loadInitData();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.subjectId || !formData.sectionId) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setSubmitting(true);
            const newAssignment = await assignmentService.createAssignment({
                ...formData,
                dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined
            });
            setAssignments([newAssignment, ...assignments]);
            setFormData({ title: '', description: '', subjectId: '', sectionId: '', dueDate: '' });
            setActiveTab('list');
            toast.success('Assignment created successfully');
        } catch (error) {
            toast.error('Failed to create assignment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        setAssignmentToDelete(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!assignmentToDelete) return;
        try {
            await assignmentService.deleteAssignment(assignmentToDelete);
            setAssignments(assignments.filter(a => a.id !== assignmentToDelete));
            toast.success('Assignment deleted');
        } catch (error) {
            toast.error('Failed to delete assignment');
        } finally {
            setAssignmentToDelete(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
                    <p className="text-muted-foreground mt-1">Manage class assignments and student submissions.</p>
                </div>
                <Button onClick={() => setActiveTab(activeTab === 'list' ? 'create' : 'list')} variant={activeTab === 'create' ? 'outline' : 'default'} className="gap-2">
                    {activeTab === 'list' ? <Plus className="h-4 w-4" /> : null}
                    {activeTab === 'list' ? 'Create Assignment' : 'Back to List'}
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsContent value="list" className="mt-0">
                    {assignments.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {assignments.map((assignment) => (
                                <Card key={assignment.id} className="glass-card border-none hover:translate-y-[-4px] transition-all duration-300 overflow-hidden group">
                                    <div className="h-2 bg-primary/20 w-full" />
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <Badge variant="secondary" className="bg-primary/10 text-primary border-none mb-2">
                                                {assignment.subject?.name || 'Subject'}
                                            </Badge>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500" onClick={() => handleDelete(assignment.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <CardTitle className="text-xl font-bold line-clamp-1">{assignment.title}</CardTitle>
                                        <CardDescription className="line-clamp-2 min-h-[40px]">{assignment.description || 'No description provided.'}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4 pt-2">
                                        <div className="grid grid-cols-2 gap-4 py-2 border-t border-b border-white/5">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Class</span>
                                                <div className="flex items-center gap-1.5 text-xs font-medium">
                                                    <Users className="h-3.5 w-3.5 text-primary" />
                                                    {assignment.class?.name} - {assignment.section?.name}
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1 text-right">
                                                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Due Date</span>
                                                <div className="flex items-center gap-1.5 text-xs font-medium justify-end">
                                                    <CalendarIcon className="h-3.5 w-3.5 text-primary" />
                                                    {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="flex -space-x-2">
                                                    {[1, 2, 3].map(i => (
                                                        <div key={i} className="h-6 w-6 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-[10px] font-bold">
                                                            S{i}
                                                        </div>
                                                    ))}
                                                </div>
                                                <span className="text-[10px] text-muted-foreground font-medium">+15 submissions</span>
                                            </div>
                                            <Button size="sm" variant="outline" className="h-8 glass">
                                                Grade
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 glass-card rounded-2xl border-none">
                            <ClipboardList className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-muted-foreground">No Assignments Yet</h3>
                            <p className="text-muted-foreground mt-2 max-w-xs mx-auto text-sm">
                                You haven't created any assignments for your classes. Click the "Create Assignment" button to get started.
                            </p>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="create" className="mt-0">
                    <Card className="glass-card border-none max-w-2xl mx-auto">
                        <CardHeader>
                            <CardTitle>Create New Assignment</CardTitle>
                            <CardDescription>Fill in the details below to publish a new assignment to your students.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreate} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Assignment Title</Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g. Mathematics Chapter 5 Exercise"
                                        className="glass"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Subject</Label>
                                        <Select value={formData.subjectId} onValueChange={(val) => setFormData({ ...formData, subjectId: val })}>
                                            <SelectTrigger className="glass">
                                                <SelectValue placeholder="Select Subject" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {subjects.map(s => (
                                                    <SelectItem key={s.id} value={s.id}>{s.name} ({s.class?.name})</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Class Section</Label>
                                        <Select value={formData.sectionId} onValueChange={(val) => setFormData({ ...formData, sectionId: val })}>
                                            <SelectTrigger className="glass">
                                                <SelectValue placeholder="Select Section" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {sections.map(s => (
                                                    <SelectItem key={s.id} value={s.id}>{s.class?.name} - {s.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="dueDate">Due Date</Label>
                                    <Input
                                        id="dueDate"
                                        type="date"
                                        className="glass w-full"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description & Instructions</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Provide detailed instructions for the assignment..."
                                        className="glass min-h-[120px]"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <Button type="button" variant="outline" onClick={() => setActiveTab('list')}>Cancel</Button>
                                    <Button type="submit" disabled={submitting}>
                                        {submitting ? 'Creating...' : 'Publish Assignment'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={confirmDelete}
                title="Delete Assignment"
                description="Are you sure you want to delete this assignment? This action cannot be undone and will affect all students."
            />
        </div>
    );
}
