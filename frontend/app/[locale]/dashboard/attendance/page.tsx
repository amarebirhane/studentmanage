'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Calendar as CalendarIcon,
    Users,
    CheckCircle2,
    XCircle,
    Clock,
    AlertCircle,
    Loader2,
    ChevronLeft,
    ChevronRight,
    Save,
    Search
} from 'lucide-react';
import { classService } from '@/services/class.service';
import { attendanceService } from '@/services/attendance.service';
import { toast } from 'react-hot-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function AttendancePage() {
    const [classes, setClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Filters
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [selectedSection, setSelectedSection] = useState<string>('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    // Data
    const [attendanceData, setAttendanceData] = useState<any>(null);
    const [students, setStudents] = useState<any[]>([]);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                setLoading(true);
                const data = await classService.getClasses();
                setClasses(data || []);
            } catch (error) {
                toast.error('Failed to load classes');
            } finally {
                setLoading(false);
            }
        };
        fetchClasses();
    }, []);

    const fetchReport = async () => {
        if (!selectedSection && !selectedClass) return;

        try {
            setLoading(true);
            const report = await attendanceService.getDailyReport({
                date,
                sectionId: selectedSection || undefined,
                classId: selectedClass || undefined,
            });
            setAttendanceData(report);
            setStudents(report.students || []);
        } catch (error) {
            toast.error('Failed to fetch attendance report');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, [selectedSection, selectedClass, date]);

    const handleStatusChange = (studentId: string, status: string) => {
        setStudents(prev => prev.map(s =>
            s.studentId === studentId ? { ...s, status } : s
        ));
    };

    const markAll = (status: string) => {
        setStudents(prev => prev.map(s => ({ ...s, status })));
    };

    const handleSave = async () => {
        if (!selectedSection) {
            toast.error('Please select a section to save attendance');
            return;
        }

        try {
            setSaving(true);
            await attendanceService.bulkMarkAttendance({
                date,
                sectionId: selectedSection,
                records: students.map(s => ({
                    studentId: s.studentId,
                    status: s.status === 'NOT_MARKED' ? 'PRESENT' : s.status,
                    remarks: s.remarks
                }))
            });
            toast.success('Attendance saved successfully');
            fetchReport();
        } catch (error) {
            toast.error('Failed to save attendance');
        } finally {
            setSaving(false);
        }
    };

    const currentClassObj = classes.find(c => c.id === selectedClass);
    const stats = attendanceData?.summary || { totalStudents: 0, present: 0, absent: 0, notMarked: 0 };

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Attendance Tracking</h1>
                    <p className="text-muted-foreground mt-1">Mark and monitor daily student presence.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Input
                        type="date"
                        className="w-44 glass border-white/10"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <Button
                        className="shadow-lg shadow-primary/20 gap-2"
                        onClick={handleSave}
                        disabled={saving || students.length === 0}
                    >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Attendance
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="glass-card border-none bg-blue-500/5">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                            <Users className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Students</p>
                            <p className="text-2xl font-bold">{stats.totalStudents}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass-card border-none bg-green-500/5">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Present</p>
                            <p className="text-2xl font-bold">{stats.present}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass-card border-none bg-red-500/5">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                            <XCircle className="h-5 w-5 text-red-500" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Absent</p>
                            <p className="text-2xl font-bold">{stats.absent}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass-card border-none bg-orange-500/5">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                            <Clock className="h-5 w-5 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Not Marked</p>
                            <p className="text-2xl font-bold">{stats.notMarked}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <Card className="glass-card border-none">
                        <CardHeader>
                            <CardTitle className="text-lg">Filters</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Class</Label>
                                <Select value={selectedClass} onValueChange={(val) => { setSelectedClass(val); setSelectedSection(''); }}>
                                    <SelectTrigger className="glass border-white/10">
                                        <SelectValue placeholder="Select Class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classes.map(c => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Section</Label>
                                <Select value={selectedSection} onValueChange={setSelectedSection} disabled={!selectedClass}>
                                    <SelectTrigger className="glass border-white/10">
                                        <SelectValue placeholder="Select Section" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {currentClassObj?.sections?.map((s: any) => (
                                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="pt-4 space-y-2">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Quick Actions</p>
                                <div className="flex flex-col gap-2">
                                    <Button variant="outline" size="sm" className="glass justify-start text-xs h-9" onClick={() => markAll('PRESENT')}>
                                        <CheckCircle2 className="h-3.5 w-3.5 mr-2 text-green-500" /> Mark All Present
                                    </Button>
                                    <Button variant="outline" size="sm" className="glass justify-start text-xs h-9" onClick={() => markAll('ABSENT')}>
                                        <XCircle className="h-3.5 w-3.5 mr-2 text-red-500" /> Mark All Absent
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-3">
                    <Card className="glass-card border-none h-full min-h-[500px]">
                        <CardContent className="p-0">
                            {loading ? (
                                <div className="h-[500px] flex flex-col items-center justify-center space-y-4">
                                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                                    <p className="text-muted-foreground animate-pulse">Fetching class registry...</p>
                                </div>
                            ) : students.length > 0 ? (
                                <div className="divide-y divide-white/5">
                                    <div className="p-4 bg-white/5 grid grid-cols-12 gap-4 items-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                        <div className="col-span-6 pl-4">Student Name</div>
                                        <div className="col-span-6 text-center">Status</div>
                                    </div>
                                    {students.map((record) => (
                                        <div key={record.studentId} className="p-4 grid grid-cols-12 gap-4 items-center hover:bg-white/5 transition-colors group">
                                            <div className="col-span-6 flex items-center gap-3 pl-4">
                                                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                                                    {record.studentName[0]}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm">{record.studentName}</p>
                                                    <p className="text-[10px] text-muted-foreground">ID: {record.enrollmentNo || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="col-span-6 flex justify-center gap-2">
                                                {[
                                                    { id: 'PRESENT', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
                                                    { id: 'ABSENT', icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
                                                    { id: 'LATE', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                                                    { id: 'EXCUSED', icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' }
                                                ].map((s) => (
                                                    <button
                                                        key={s.id}
                                                        onClick={() => handleStatusChange(record.studentId, s.id)}
                                                        className={cn(
                                                            "h-10 px-3 rounded-xl border border-transparent transition-all flex flex-col items-center justify-center gap-0.5 min-w-[64px]",
                                                            record.status === s.id
                                                                ? `${s.bg} border-${s.color.split('-')[1]}-500/50 scale-105 shadow-sm`
                                                                : "hover:bg-white/5 hover:border-white/10"
                                                        )}
                                                        title={s.id}
                                                    >
                                                        <s.icon className={cn("h-4 w-4", record.status === s.id ? s.color : "text-muted-foreground/50")} />
                                                        <span className={cn("text-[9px] font-bold", record.status === s.id ? s.color : "text-muted-foreground/50")}>
                                                            {s.id.charAt(0) + s.id.slice(1).toLowerCase()}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-[500px] flex flex-col items-center justify-center text-center p-8 space-y-4">
                                    <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center border border-dashed border-primary/20">
                                        <Search className="h-8 w-8 text-primary/40" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Registry Empty</h3>
                                        <p className="text-muted-foreground max-w-xs mx-auto mt-2 text-sm">
                                            Please select a class and section to view the student registry for this date.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
