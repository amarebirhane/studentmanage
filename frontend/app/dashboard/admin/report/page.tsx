'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    FileText,
    Download,
    Calendar as CalendarIcon,
    Users,
    GraduationCap,
    PieChart,
    BarChart,
    Loader2,
    FileSpreadsheet
} from 'lucide-react';
import { classService } from '@/services/class.service';
import { examService } from '@/services/exam.service';
import { reportService } from '@/services/report.service';
import { toast } from 'react-hot-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ReportsPage() {
    const [classes, setClasses] = useState<any[]>([]);
    const [exams, setExams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState<string | null>(null);

    // Filters
    const [attendanceFilter, setAttendanceFilter] = useState({
        classId: 'all',
        sectionId: 'all',
        dateFrom: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        dateTo: new Date().toISOString().split('T')[0],
    });

    const [examId, setExamId] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [classesData, examsData] = await Promise.all([
                    classService.getClasses(),
                    examService.getExams()
                ]);
                setClasses(classesData || []);
                setExams(examsData || []);
            } catch (error) {
                toast.error('Failed to load filter data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDownloadAttendance = async () => {
        if (!attendanceFilter.dateFrom || !attendanceFilter.dateTo) {
            toast.error('Please select both date from and date to');
            return;
        }

        try {
            setGenerating('attendance');
            await reportService.downloadAttendanceReport({
                classId: attendanceFilter.classId === 'all' ? undefined : attendanceFilter.classId,
                dateFrom: attendanceFilter.dateFrom,
                dateTo: attendanceFilter.dateTo,
            });
            toast.success('Attendance report generated');
        } catch (error) {
            toast.error('Failed to generate report');
        } finally {
            setGenerating(null);
        }
    };

    const handleDownloadExamResults = async () => {
        if (!examId) {
            toast.error('Please select an exam');
            return;
        }

        try {
            setGenerating('exam');
            await reportService.downloadExamReport(examId);
            toast.success('Exam results exported to Excel');
        } catch (error) {
            toast.error('Failed to export exam results');
        } finally {
            setGenerating(null);
        }
    };

    const selectedClass = classes.find(c => c.id === attendanceFilter.classId);

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
                    <p className="text-muted-foreground mt-1">Generate academic and administrative reports for your school.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Attendance Report Card */}
                <Card className="glass-card border-none overflow-hidden group hover:ring-1 hover:ring-primary/20 transition-all">
                    <CardHeader className="pb-4">
                        <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4 border border-blue-500/20">
                            <CalendarIcon className="h-6 w-6 text-blue-500" />
                        </div>
                        <CardTitle>Attendance Report</CardTitle>
                        <CardDescription>Generate a PDF report of student attendance across classes.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Class</Label>
                                <Select
                                    value={attendanceFilter.classId}
                                    onValueChange={(val) => setAttendanceFilter(prev => ({ ...prev, classId: val, sectionId: 'all' }))}
                                >
                                    <SelectTrigger className="glass border-white/10">
                                        <SelectValue placeholder="Select Class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Classes</SelectItem>
                                        {classes.map(c => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {attendanceFilter.classId !== 'all' && (
                                <div className="space-y-2">
                                    <Label>Section</Label>
                                    <Select
                                        value={attendanceFilter.sectionId}
                                        onValueChange={(val) => setAttendanceFilter(prev => ({ ...prev, sectionId: val }))}
                                    >
                                        <SelectTrigger className="glass border-white/10">
                                            <SelectValue placeholder="Select Section" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Sections</SelectItem>
                                            {selectedClass?.sections?.map((s: any) => (
                                                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>From Date</Label>
                                <Input
                                    type="date"
                                    className="glass border-white/10"
                                    value={attendanceFilter.dateFrom}
                                    onChange={(e) => setAttendanceFilter(prev => ({ ...prev, dateFrom: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>To Date</Label>
                                <Input
                                    type="date"
                                    className="glass border-white/10"
                                    value={attendanceFilter.dateTo}
                                    onChange={(e) => setAttendanceFilter(prev => ({ ...prev, dateTo: e.target.value }))}
                                />
                            </div>
                        </div>

                        <Button
                            className="w-full gap-2 h-11"
                            onClick={handleDownloadAttendance}
                            disabled={generating === 'attendance'}
                        >
                            {generating === 'attendance' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                            Generate Attendance PDF
                        </Button>
                    </CardContent>
                </Card>

                {/* Exam Results Card */}
                <Card className="glass-card border-none overflow-hidden group hover:ring-1 hover:ring-primary/20 transition-all">
                    <CardHeader className="pb-4">
                        <div className="h-12 w-12 rounded-2xl bg-green-500/10 flex items-center justify-center mb-4 border border-green-500/20">
                            <FileSpreadsheet className="h-6 w-6 text-green-500" />
                        </div>
                        <CardTitle>Exam Results Export</CardTitle>
                        <CardDescription>Export detailed exam results to Excel for further analysis.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Select Exam</Label>
                            <Select value={examId} onValueChange={setExamId}>
                                <SelectTrigger className="glass border-white/10">
                                    <SelectValue placeholder="Choose an exam" />
                                </SelectTrigger>
                                <SelectContent>
                                    {exams.length > 0 ? exams.map(e => (
                                        <SelectItem key={e.id} value={e.id}>{e.name} ({e.class?.name || 'All'})</SelectItem>
                                    )) : (
                                        <div className="p-2 text-sm text-muted-foreground">No exams found</div>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                            <div className="flex gap-3">
                                <PieChart className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold">Ready for Analysis</p>
                                    <p className="text-xs text-muted-foreground">This export includes student names, marks, grades, and teacher remarks.</p>
                                </div>
                            </div>
                        </div>

                        <Button
                            className="w-full gap-2 h-11 bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20"
                            variant="outline"
                            onClick={handleDownloadExamResults}
                            disabled={generating === 'exam'}
                        >
                            {generating === 'exam' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                            Export to Excel (.xlsx)
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-card border-none p-6 flex flex-col items-center text-center space-y-3">
                    <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                        <BarChart className="h-5 w-5 text-orange-500" />
                    </div>
                    <h4 className="font-bold">Student Progress</h4>
                    <p className="text-xs text-muted-foreground">Generate comprehensive student progress reports.</p>
                    <Button variant="ghost" size="sm" className="text-xs text-primary">In Development</Button>
                </Card>

                <Card className="glass-card border-none p-6 flex flex-col items-center text-center space-y-3">
                    <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-purple-500" />
                    </div>
                    <h4 className="font-bold">Staff Directory</h4>
                    <p className="text-xs text-muted-foreground">Export complete staff directory with roles.</p>
                    <Button variant="ghost" size="sm" className="text-xs text-primary">In Development</Button>
                </Card>

                <Card className="glass-card border-none p-6 flex flex-col items-center text-center space-y-3">
                    <div className="h-10 w-10 rounded-full bg-pink-500/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-pink-500" />
                    </div>
                    <h4 className="font-bold">Fee Statements</h4>
                    <p className="text-xs text-muted-foreground">Bulk export fee statements for classes.</p>
                    <Button variant="ghost" size="sm" className="text-xs text-primary">In Development</Button>
                </Card>
            </div>
        </div>
    );
}
