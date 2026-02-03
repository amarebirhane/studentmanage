'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

export default function TimetablePage() {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM'];

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">My Schedule</h1>
                <p className="text-muted-foreground mt-1 text-white/70">View your weekly class timetable and subjects.</p>
            </div>

            <Card className="glass-card border-none overflow-hidden">
                <CardHeader className="bg-primary/10 border-b border-white/5">
                    <CardTitle className="flex items-center gap-2 text-white">
                        <CalendarIcon className="h-5 w-5 text-primary" /> Weekly Timetable
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-secondary/20">
                                <th className="p-4 text-left border-r border-white/5 text-xs font-bold uppercase tracking-wider text-white">Time</th>
                                {days.map(day => (
                                    <th key={day} className="p-4 text-center text-xs font-bold uppercase tracking-wider text-white">{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {timeSlots.map(slot => (
                                <tr key={slot} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4 border-r border-white/5 font-medium text-sm flex items-center gap-2 text-white">
                                        <Clock className="h-4 w-4 text-primary" /> {slot}
                                    </td>
                                    {days.map(day => (
                                        <td key={`${day}-${slot}`} className="p-4 text-center">
                                            <div className="p-2 rounded-lg bg-primary/5 border border-primary/10 min-h-[60px] flex items-center justify-center flex-col gap-1">
                                                <span className="text-xs font-bold text-white">Class Sample</span>
                                                <span className="text-[10px] text-white/50 italic text-white/70">Building A, Room 302</span>
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
