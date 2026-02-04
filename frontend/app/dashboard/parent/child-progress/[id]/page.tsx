'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { studentService } from '@/services/student.service';
import { attendanceService } from '@/services/attendance.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, GraduationCap, ClipboardCheck, BookOpen, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function ChildDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [student, setStudent] = useState<any>(null);
    const [attendance, setAttendance] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentRes, attendanceRes] = await Promise.all([
                    studentService.getStudentById(id),
                    attendanceService.getAttendanceStats(id)
                ]);
                setStudent(studentRes);
                setAttendance(attendanceRes);
            } catch (error) {
                console.error('Failed to fetch child details', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="h-[calc(100vh-200px)] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="text-muted-foreground animate-pulse font-medium">Loading child profile...</p>
            </div>
        );
    }

    if (!student) {
        return <div className="p-6 text-center">Child not found.</div>;
    }

    const attendanceRate = attendance ? (attendance.present / attendance.total) * 100 : 0;

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold border border-primary/20">
                        {student.user?.firstName?.[0]}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{student.user?.firstName} {student.user?.lastName}</h1>
                        <p className="text-muted-foreground mt-1">
                            {student.class?.name} • Section {student.section?.name} • Enrollment: {student.enrollmentNo}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-card border-none">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <ClipboardCheck className="h-4 w-4 text-green-500" /> Attendance Rate
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold mb-2">{attendanceRate.toFixed(1)}%</div>
                        <Progress value={attendanceRate} className="h-2 bg-secondary" indicatorClassName="bg-green-500" />
                    </CardContent>
                </Card>

                <Card className="glass-card border-none">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-blue-500" /> Subjects
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{student.class?._count?.subjects || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Enrolled in current semester</p>
                    </CardContent>
                </Card>

                <Card className="glass-card border-none">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Clock className="h-4 w-4 text-orange-500" /> Recent Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20 px-3 py-1">Active</Badge>
                        <p className="text-xs text-muted-foreground mt-2 uppercase tracking-tight">Last active: Recently</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="glass-card border-none">
                    <CardHeader>
                        <CardTitle>Academic Records</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {student.gradeRecords?.length > 0 ? (
                                student.gradeRecords.map((record: any) => (
                                    <div key={record.id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                                        <div>
                                            <p className="font-bold">{record.exam?.name}</p>
                                            <p className="text-xs text-muted-foreground">{record.exam?.subject?.name}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-primary">{record.marks} / {record.exam?.maxMarks}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase">{new Date(record.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-muted-foreground italic">
                                    No academic records available yet.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card border-none">
                    <CardHeader>
                        <CardTitle>Recent Attendance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {attendance?.recent?.length > 0 ? (
                                attendance.recent.map((record: any) => (
                                    <div key={record.id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-2 w-2 rounded-full ${record.status === 'PRESENT' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} />
                                            <p className="text-sm font-medium">{new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                                        </div>
                                        <Badge variant="outline" className={record.status === 'PRESENT' ? 'text-green-500 border-green-500/20 bg-green-500/5' : 'text-red-500 border-red-500/20 bg-red-500/5'}>
                                            {record.status}
                                        </Badge>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-muted-foreground italic">
                                    No attendance records found.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
