'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, CheckCircle2, XCircle, Clock, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { attendanceService } from '@/services/attendance.service';
import { toast } from 'react-hot-toast';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function StudentAttendancePage() {
    const [attendance, setAttendance] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    useEffect(() => {
        fetchAttendance();
    }, [currentMonth]);

    const fetchAttendance = async () => {
        try {
            setLoading(true);
            const data = await attendanceService.getAttendance({
                dateFrom: startOfMonth(currentMonth).toISOString(),
                dateTo: endOfMonth(currentMonth).toISOString()
            });
            setAttendance(data || []);
        } catch (error) {
            toast.error('Failed to load attendance records');
        } finally {
            setLoading(false);
        }
    };

    const getStatusForDay = (day: Date) => {
        // Find record matching the day
        const record = attendance.find(a => isSameDay(new Date(a.date), day));

        if (!record) return null; // No record (weekend or holiday or future)

        switch (record.status) {
            case 'PRESENT': return { label: 'Present', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' };
            case 'ABSENT': return { label: 'Absent', icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' };
            case 'LATE': return { label: 'Late', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10' };
            case 'EXCUSED': return { label: 'Excused', icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' };
            default: return null;
        }
    };

    const calendarDays = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth)
    });

    const stats = {
        present: attendance.filter(a => a.status === 'PRESENT').length,
        absent: attendance.filter(a => a.status === 'ABSENT').length,
        late: attendance.filter(a => a.status === 'LATE').length,
        total: attendance.length
    };

    const attendanceRate = stats.total > 0
        ? Math.round(((stats.present + stats.late) / stats.total) * 100)
        : 0;

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Attendance</h1>
                    <p className="text-muted-foreground mt-1">Track your daily attendance record.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Card className="glass-card border-none bg-primary/5 px-4 py-2 flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Attendance Rate</p>
                            <p className="text-2xl font-bold text-primary">{attendanceRate}%</p>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 glass-card border-none">
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-primary" />
                            {format(currentMonth, 'MMMM yyyy')}
                        </CardTitle>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(prev => subMonths(prev, 1))}>
                                <span className="sr-only">Previous month</span>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(new Date())}>
                                <span className="text-xs font-bold">Today</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}>
                                <span className="sr-only">Next month</span>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-7 gap-2 text-center mb-4">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="text-xs font-bold text-muted-foreground uppercase py-2">
                                    {day}
                                </div>
                            ))}
                            {/* Empty cells for start of month offset if needed (simplified here, date-fns grid usually handles by full week range, but for simplicity sticking to basic interval) */}
                            {/* Better Calendar Grid Logic */}
                            {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
                                <div key={`empty-${i}`} className="h-24 rounded-xl bg-white/5 opacity-20" />
                            ))}

                            {calendarDays.map((day) => {
                                const status = getStatusForDay(day);
                                const StatusIcon = status?.icon;
                                const isFuture = day > new Date();

                                return (
                                    <div
                                        key={day.toISOString()}
                                        className={cn(
                                            "h-24 rounded-xl border border-white/5 p-2 flex flex-col justify-between transition-all hover:bg-white/5 relative overflow-hidden group",
                                            status?.bg || (isFuture ? "opacity-50" : "bg-secondary/20")
                                        )}
                                    >
                                        <span className={cn(
                                            "text-sm font-bold block",
                                            isSameDay(day, new Date()) ? "text-primary" : "text-muted-foreground"
                                        )}>
                                            {format(day, 'd')}
                                        </span>

                                        {status ? (
                                            <div className="flex flex-col items-center gap-1">
                                                <status.icon className={cn("h-6 w-6", status.color)} />
                                                <span className={cn("text-[10px] font-bold uppercase", status.color)}>
                                                    {status.label}
                                                </span>
                                            </div>
                                        ) : !isFuture && day.getDay() !== 0 && day.getDay() !== 6 ? (
                                            <div className="flex items-center justify-center h-full pb-4 opacity-30">
                                                <span className="text-[10px]">-</span>
                                            </div>
                                        ) : null}
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="glass-card border-none">
                        <CardHeader>
                            <CardTitle>Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-green-500/5 border border-green-500/10">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                        <CheckCircle2 className="h-4 w-4" />
                                    </div>
                                    <span className="font-medium">Present</span>
                                </div>
                                <span className="font-bold text-xl">{stats.present}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                                        <XCircle className="h-4 w-4" />
                                    </div>
                                    <span className="font-medium">Absent</span>
                                </div>
                                <span className="font-bold text-xl">{stats.absent}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-orange-500/5 border border-orange-500/10">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
                                        <Clock className="h-4 w-4" />
                                    </div>
                                    <span className="font-medium">Late</span>
                                </div>
                                <span className="font-bold text-xl">{stats.late}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}


