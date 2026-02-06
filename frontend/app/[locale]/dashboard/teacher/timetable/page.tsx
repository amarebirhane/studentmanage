'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Calendar as CalendarIcon,
    Clock,
    Printer,
    RefreshCcw,
    Loader2,
    BookOpen,
    MapPin,
    Users
} from 'lucide-react';
import { timetableService } from '@/services/timetable.service';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

export default function TimetablePage() {
    const [timetable, setTimetable] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const days = [
        { name: 'Monday', value: 1 },
        { name: 'Tuesday', value: 2 },
        { name: 'Wednesday', value: 3 },
        { name: 'Thursday', value: 4 },
        { name: 'Friday', value: 5 },
    ];

    const periods = [
        { id: 1, time: '08:00 AM' },
        { id: 2, time: '09:00 AM' },
        { id: 3, time: '10:00 AM' },
        { id: 4, time: '11:00 AM' },
        { id: 5, time: '12:00 PM' },
        { id: 6, time: '01:00 PM' },
        { id: 7, time: '02:00 PM' },
        { id: 8, time: '03:00 PM' },
    ];

    useEffect(() => {
        fetchTimetable();
    }, []);

    const fetchTimetable = async () => {
        try {
            setLoading(true);
            const data = await timetableService.getMyTimetable();
            setTimetable(data || []);
        } catch (error) {
            toast.error('Failed to load timetable');
        } finally {
            setLoading(false);
        }
    };

    const getEntry = (dayValue: number, periodId: number) => {
        return timetable.find(e => e.dayOfWeek === dayValue && e.periodNumber === periodId);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500 print:p-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">My Schedule</h1>
                    <p className="text-muted-foreground mt-1 text-white/70">View your weekly class timetable and subjects.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchTimetable}
                        disabled={loading}
                        className="glass border-white/10 text-white hover:bg-white/5"
                    >
                        <RefreshCcw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                        Refresh
                    </Button>
                    <Button
                        size="sm"
                        onClick={handlePrint}
                        className="shadow-lg shadow-primary/20"
                    >
                        <Printer className="h-4 w-4 mr-2" />
                        Print Timetable
                    </Button>
                </div>
            </div>

            <Card className="glass-card border-none overflow-hidden shadow-2xl">
                <CardHeader className="bg-primary/10 border-b border-white/5 py-4">
                    <CardTitle className="flex items-center gap-2 text-white text-lg">
                        <CalendarIcon className="h-5 w-5 text-primary" /> Weekly Timetable
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto custom-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-20 gap-4">
                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                            <p className="text-white/50 animate-pulse">Loading your schedule...</p>
                        </div>
                    ) : (
                        <table className="w-full border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-white/5">
                                    <th className="p-4 text-left border-r border-white/5 text-xs font-bold uppercase tracking-wider text-white w-32">Time</th>
                                    {days.map(day => (
                                        <th key={day.value} className="p-4 text-center text-xs font-bold uppercase tracking-wider text-white border-r border-white/5 last:border-0">{day.name}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {periods.map(period => (
                                    <tr key={period.id} className="border-t border-white/5 hover:bg-white/5 transition-colors group">
                                        <td className="p-4 border-r border-white/5 font-medium text-sm text-white bg-white/5 group-hover:bg-primary/5 transition-colors">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-primary" />
                                                <span>{period.time}</span>
                                            </div>
                                            <span className="text-[10px] text-white/30 block ml-6">Period {period.id}</span>
                                        </td>
                                        {days.map(day => {
                                            const entry = getEntry(day.value, period.id);
                                            return (
                                                <td key={`${day.value}-${period.id}`} className="p-3 text-center border-r border-white/5 last:border-0 align-top">
                                                    {entry ? (
                                                        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 shadow-inner group/cell hover:bg-primary/15 transition-all duration-300">
                                                            <div className="flex flex-col gap-2 items-start text-left">
                                                                <div className="flex items-center gap-1.5 w-full">
                                                                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                                                    <span className="text-xs font-bold text-white truncate">{entry.subject?.name || 'Subject'}</span>
                                                                </div>
                                                                <div className="space-y-1 w-full opacity-80">
                                                                    <div className="flex items-center gap-1.5 text-[10px] text-white/70">
                                                                        <Users className="h-3 w-3 text-primary/70" />
                                                                        <span className="truncate">{entry.class?.name} - {entry.section?.name}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1.5 text-[10px] text-white/70">
                                                                        <MapPin className="h-3 w-3 text-primary/70" />
                                                                        <span className="truncate">{entry.room || 'TBD'}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="min-h-[80px] flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                                                            <div className="h-1 w-8 bg-white/20 rounded-full" />
                                                        </div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </CardContent>
            </Card>

            <style jsx global>{`
                @media print {
                    body {
                        background: white !important;
                        color: black !important;
                    }
                    .glass-card {
                        background: white !important;
                        border: 1px solid #eee !important;
                        box-shadow: none !important;
                    }
                    .text-white, .text-white/70, .text-white/50 {
                        color: black !important;
                    }
                    .bg-primary/10, .bg-white/5, .bg-primary/5 {
                        background: #f9f9f9 !important;
                    }
                    .border-white/5, .border-primary/10, .border-primary/20 {
                        border-color: #eee !important;
                    }
                    .shadow-lg, .shadow-2xl, .shadow-inner {
                        box-shadow: none !important;
                    }
                    .custom-scrollbar {
                        overflow: visible !important;
                    }
                }
            `}</style>
        </div>
    );
}
