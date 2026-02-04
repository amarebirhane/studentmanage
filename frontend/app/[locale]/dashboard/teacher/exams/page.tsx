'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    GraduationCap,
    Plus,
    Calendar as CalendarIcon,
    Users,
    BookOpen,
    CheckCircle2,
    Trophy,
    Trash2,
    Search,
    Edit3
} from 'lucide-react';
import { examService } from '@/services/exam.service';
import { teacherService } from '@/services/teacher.service';
import { subjectService } from '@/services/subject.service';
import { studentService } from '@/services/student.service';
import { toast } from 'react-hot-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function ExamsPage() {
    const [exams, setExams] = useState<any[]>([]);
    const [sections, setSections] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('list');

    // Marks entry state
    const [selectedExam, setSelectedExam] = useState<any>(null);
    const [examStudents, setExamStudents] = useState<any[]>([]);
    const [marksData, setMarksData] = useState<{ [key: string]: number }>({});

    const [formData, setFormData] = useState({
        name: '',
        subjectId: '',
        examDate: '',
        maxMarks: 100,
        classId: '',
        sectionId: '',
        term: 'First Term'
    });

    useEffect(() => {
        const loadInitData = async () => {
            try {
                setLoading(true);
                const [examsData, teachersData, subjectsData] = await Promise.all([
                    examService.getExams(),
                    teacherService.getTeacherClasses(),
                    subjectService.getSubjects()
                ]);

                setExams(examsData || []);
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
        try {
            setSubmitting(true);
            const newExam = await examService.createExam({
                ...formData,
                examDate: new Date(formData.examDate)
            });
            setExams([newExam, ...exams]);
            setFormData({ name: '', subjectId: '', examDate: '', maxMarks: 100, classId: '', sectionId: '', term: 'First Term' });
            setActiveTab('list');
            toast.success('Exam scheduled successfully');
        } catch (error) {
            toast.error('Failed to schedule exam');
        } finally {
            setSubmitting(false);
        }
    };

    const handleMarksEntry = async (exam: any) => {
        setSelectedExam(exam);
        try {
            setLoading(true);
            // Fetch students for the exam's section
            const response = await studentService.getStudents(); // Ideally filter by sectionId
            setExamStudents(response.data || []);

            // Initialize marks data if exists
            const existingMarks: any = {};
            exam.grades?.forEach((g: any) => {
                existingMarks[g.studentId] = g.scoredMarks;
            });
            setMarksData(existingMarks);
            setActiveTab('marks');
        } catch (error) {
            toast.error('Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    const saveMarks = async () => {
        try {
            setSubmitting(true);
            const marksList = Object.entries(marksData).map(([studentId, scoredMarks]) => ({
                studentId,
                scoredMarks
            }));
            await examService.enterMarks(selectedExam.id, marksList);
            toast.success('Marks updated successfully');
            setActiveTab('list');
        } catch (error) {
            toast.error('Failed to save marks');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading && activeTab !== 'marks') {
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
                    <h1 className="text-3xl font-bold tracking-tight">Exams & Assessments</h1>
                    <p className="text-muted-foreground mt-1">Schedule exams and enter student performance marks.</p>
                </div>
                {activeTab !== 'marks' && (
                    <Button onClick={() => setActiveTab(activeTab === 'list' ? 'create' : 'list')} variant={activeTab === 'create' ? 'outline' : 'default'} className="gap-2">
                        {activeTab === 'list' ? <Plus className="h-4 w-4" /> : null}
                        {activeTab === 'list' ? 'Schedule Exam' : 'Back to List'}
                    </Button>
                )}
                {activeTab === 'marks' && (
                    <Button onClick={() => setActiveTab('list')} variant="outline">Back to Exams</Button>
                )}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsContent value="list" className="mt-0 space-y-6">
                    {exams.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {exams.map((exam) => (
                                <Card key={exam.id} className="glass-card border-none hover:translate-y-[-4px] transition-all duration-300 overflow-hidden group">
                                    <div className="h-2 bg-primary/20 w-full" />
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest border-primary/20 text-primary mb-2">
                                                {exam.term}
                                            </Badge>
                                            <div className="flex items-center gap-2">
                                                {exam.published ? (
                                                    <Badge className="bg-green-500/10 text-green-500 border-none text-[10px]">Published</Badge>
                                                ) : (
                                                    <Badge className="bg-orange-500/10 text-orange-500 border-none text-[10px]">Draft</Badge>
                                                )}
                                            </div>
                                        </div>
                                        <CardTitle className="text-xl font-bold line-clamp-1">{exam.name}</CardTitle>
                                        <CardDescription>{exam.subject?.name}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4 pt-2">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <CalendarIcon className="h-4 w-4 text-primary" />
                                                <span>{new Date(exam.examDate).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Users className="h-4 w-4 text-primary" />
                                                <span>{exam.class?.name} - {exam.section?.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Trophy className="h-4 w-4 text-primary" />
                                                <span>Max Marks: {exam.maxMarks}</span>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-white/5 flex gap-2">
                                            <Button className="flex-1 glass gap-2 border-primary/20 text-primary hover:bg-primary/10" variant="outline" size="sm" onClick={() => handleMarksEntry(exam)}>
                                                <Edit3 className="h-4 w-4" /> Enter Marks
                                            </Button>
                                            <Button className="flex-1" size="sm">
                                                View Results
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 glass-card rounded-2xl border-none">
                            <Trophy className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-muted-foreground">No Exams Scheduled</h3>
                            <p className="text-muted-foreground mt-2 max-w-xs mx-auto text-sm">
                                You haven't scheduled any exams yet. Use the button above to create your first assessment.
                            </p>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="create" className="mt-0">
                    <Card className="glass-card border-none max-w-2xl mx-auto">
                        <CardHeader>
                            <CardTitle>Schedule New Exam</CardTitle>
                            <CardDescription>Enter the details for the upcoming assessment.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreate} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Exam Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. Mid-Term Mathematics Exam"
                                        className="glass"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Subject</Label>
                                        <Select value={formData.subjectId} onValueChange={(val) => {
                                            const sub = subjects.find(s => s.id === val);
                                            setFormData({ ...formData, subjectId: val, classId: sub?.classId || '' });
                                        }}>
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
                                        <Label>Section</Label>
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

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="examDate">Exam Date</Label>
                                        <Input
                                            id="examDate"
                                            type="date"
                                            className="glass"
                                            value={formData.examDate}
                                            onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="maxMarks">Maximum Marks</Label>
                                        <Input
                                            id="maxMarks"
                                            type="number"
                                            className="glass"
                                            value={formData.maxMarks}
                                            onChange={(e) => setFormData({ ...formData, maxMarks: parseInt(e.target.value) })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Term</Label>
                                    <Select value={formData.term} onValueChange={(val) => setFormData({ ...formData, term: val })}>
                                        <SelectTrigger className="glass">
                                            <SelectValue placeholder="Select Term" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="First Term">First Term</SelectItem>
                                            <SelectItem value="Mid Term">Mid Term</SelectItem>
                                            <SelectItem value="Final Term">Final Term</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <Button type="button" variant="outline" onClick={() => setActiveTab('list')}>Cancel</Button>
                                    <Button type="submit" disabled={submitting}>
                                        {submitting ? 'Scheduling...' : 'Schedule Exam'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="marks" className="mt-0">
                    <Card className="glass-card border-none">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Marks Entry: {selectedExam?.name}</CardTitle>
                                <CardDescription>Enter scores for each student. Max marks: {selectedExam?.maxMarks}</CardDescription>
                            </div>
                            <Button onClick={saveMarks} disabled={submitting}>
                                {submitting ? 'Saving...' : 'Save All Marks'}
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-white/5 text-xs uppercase font-bold text-muted-foreground tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4 text-left">Student Name</th>
                                            <th className="px-6 py-4 text-left">Enrollment No</th>
                                            <th className="px-6 py-4 text-center">Marks Scored</th>
                                            <th className="px-6 py-4 text-center">Percentage</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {examStudents.map((student) => {
                                            const score = marksData[student.id] || 0;
                                            const percentage = ((score / (selectedExam?.maxMarks || 100)) * 100).toFixed(1);

                                            return (
                                                <tr key={student.id} className="hover:bg-white/5 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs border border-primary/20">
                                                                {student.user?.firstName[0]}
                                                            </div>
                                                            <span className="font-medium text-sm">{student.user?.firstName} {student.user?.lastName}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-muted-foreground font-mono">
                                                        {student.enrollmentNo}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <Input
                                                            type="number"
                                                            className="w-24 mx-auto text-center glass h-8 text-sm"
                                                            max={selectedExam?.maxMarks}
                                                            min={0}
                                                            value={marksData[student.id] || ''}
                                                            onChange={(e) => setMarksData({ ...marksData, [student.id]: parseInt(e.target.value) || 0 })}
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <Badge variant="secondary" className={
                                                            parseFloat(percentage) >= 50 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                                        }>
                                                            {percentage}%
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
