'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, Clock, MapPin, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { timetableService } from '@/services/timetable.service';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

export default function TimetablePage() {
    const [timetable, setTimetable] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeDay, setActiveDay] = useState(new Date().getDay() || 1); // Default to Monday if Sunday (0)

    const days = [
        { id: 1, name: 'Monday' },
        { id: 2, name: 'Tuesday' },
        { id: 3, name: 'Wednesday' },
        { id: 4, name: 'Thursday' },
        { id: 5, name: 'Friday' },
        { id: 6, name: 'Saturday' },
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

    const todaysSchedule = timetable
        .filter(t => t.dayOfWeek === activeDay)
        .sort((a, b) => a.periodNumber - b.periodNumber);

    return (
        <div className="p-6 space-y-8 max-w-5xl mx-auto animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Class Timetable</h1>
                <p className="text-muted-foreground mt-1">View your weekly class schedule.</p>
            </div>

            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {days.map(day => (
                    <button
                        key={day.id}
                        onClick={() => setActiveDay(day.id)}
                        className={cn(
                            "px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                            activeDay === day.id
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                : "bg-white/5 hover:bg-white/10 text-muted-foreground"
                        )}
                    >
                        {day.name}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">Loading schedule...</p>
                    </div>
                ) : todaysSchedule.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {todaysSchedule.map((entry) => (
                            <Card key={entry.id} className="glass-card border-none hover:ring-1 hover:ring-primary/20 transition-all group overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <div className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-bold uppercase tracking-wide">
                                            Period {entry.periodNumber}
                                        </div>
                                    </div>
                                    <CardTitle className="text-xl mt-2">{entry.subject?.name}</CardTitle>
                                    <CardDescription>{entry.subject?.code}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <User className="h-4 w-4" />
                                        <span>{entry.teacher?.user?.firstName} {entry.teacher?.user?.lastName}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4" />
                                        <span>{entry.room || "Room TBD"}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="glass-card border-none p-12 text-center text-muted-foreground">
                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <h3 className="text-lg font-medium">No classes scheduled</h3>
                        <p>Enjoy your free day!</p>
                    </Card>
                )}
            </div>
        </div>
    );
}
