'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, Clock, MapPin, User, Edit2, Save, X, Plus } from 'lucide-react';
import { timetableService } from '@/services/timetable.service';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { DndContext, DragOverlay, useDraggable, useDroppable, DragEndEvent } from '@dnd-kit/core';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export default function TimetablePage() {
    const { user } = useAuth();
    const [timetable, setTimetable] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeDay, setActiveDay] = useState(new Date().getDay() || 1); // Default to Monday
    const [isEditing, setIsEditing] = useState(false);

    // Mock subjects for drag and drop (In real app, fetch from API)
    const [availableSubjects, setAvailableSubjects] = useState([
        { id: 'sub1', name: 'Mathematics', code: 'MATH101' },
        { id: 'sub2', name: 'Physics', code: 'PHY101' },
        { id: 'sub3', name: 'Chemistry', code: 'CHEM101' },
        { id: 'sub4', name: 'English', code: 'ENG101' },
        { id: 'sub5', name: 'History', code: 'HIST101' },
    ]);

    const days = [
        { id: 1, name: 'Monday' },
        { id: 2, name: 'Tuesday' },
        { id: 3, name: 'Wednesday' },
        { id: 4, name: 'Thursday' },
        { id: 5, name: 'Friday' },
    ];

    const periods = [1, 2, 3, 4, 5, 6, 7, 8];

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

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.data.current) {
            const subject = active.data.current;
            const [period, day] = (over.id as string).split('-').map(Number);

            // Optimistic update
            const newEntry = {
                id: Math.random().toString(), // Temp ID
                dayOfWeek: day,
                periodNumber: period,
                subject: { name: subject.name, code: subject.code },
                room: 'Room 101'
            };

            setTimetable(prev => [...prev.filter(t => !(t.dayOfWeek === day && t.periodNumber === period)), newEntry]);

            try {
                // In a real implementation:
                // await timetableService.createEntry({ ... });
                toast.success(`Assigned ${subject.name} to Period ${period}`);
            } catch (err) {
                toast.error('Failed to update timetable');
            }
        }
    };

    // Draggable Subject Component
    const DraggableSubject = ({ subject }: { subject: any }) => {
        const { attributes, listeners, setNodeRef, transform } = useDraggable({
            id: `subject-${subject.id}`,
            data: subject,
        });

        const style = transform ? {
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        } : undefined;

        return (
            <div
                ref={setNodeRef}
                style={style}
                {...listeners}
                {...attributes}
                className="p-3 mb-2 bg-secondary/50 rounded-lg cursor-move hover:bg-secondary border border-white/5 text-sm font-medium"
            >
                {subject.name}
            </div>
        );
    };

    // Droppable Slot Component
    const DroppableSlot = ({ period, day, entry }: { period: number, day: number, entry: any }) => {
        const { setNodeRef, isOver } = useDroppable({
            id: `${period}-${day}`,
        });

        return (
            <div
                ref={setNodeRef}
                className={cn(
                    "min-h-[120px] rounded-xl border border-white/5 p-3 transition-colors relative group",
                    isOver ? "bg-primary/20 border-primary" : "bg-card glass-card",
                    entry ? "bg-secondary/20" : "bg-white/5 dashed-border"
                )}
            >
                <div className="text-xs text-muted-foreground font-bold mb-2">Period {period}</div>
                {entry ? (
                    <div>
                        <div className="font-bold text-primary">{entry.subject?.name}</div>
                        <div className="text-xs text-muted-foreground">{entry.subject?.code}</div>
                        <div className="mt-2 text-xs flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-3 w-3" /> {entry.room}
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground/20 text-xs">
                        {isEditing ? 'Drop Here' : 'Free Period'}
                    </div>
                )}
            </div>
        );
    };

    const canEdit = user?.role === 'ADMIN' || user?.role === 'TEACHER';

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
                        Class Timetable
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage weekly schedules.</p>
                </div>
                {canEdit && (
                    <Button
                        onClick={() => setIsEditing(!isEditing)}
                        variant={isEditing ? "destructive" : "default"}
                        className="gap-2"
                    >
                        {isEditing ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                        {isEditing ? 'Cancel Editing' : 'Edit Timetable'}
                    </Button>
                )}
            </div>

            <DndContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Sidebar for Draggables (Only in Edit Mode) */}
                    {isEditing && (
                        <div className="lg:col-span-3 space-y-4 animate-in slide-in-from-left duration-300">
                            <Card className="glass-card border-white/10">
                                <CardHeader>
                                    <CardTitle className="text-sm">Subjects</CardTitle>
                                    <CardDescription>Drag to assign</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {availableSubjects.map(sub => (
                                        <DraggableSubject key={sub.id} subject={sub} />
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Main Timetable Grid */}
                    <div className={cn("space-y-6 transition-all duration-300", isEditing ? "lg:col-span-9" : "lg:col-span-12")}>
                        {/* Day Selector */}
                        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
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

                        {loading ? (
                            <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {periods.map(period => {
                                    const entry = timetable.find(t => t.dayOfWeek === activeDay && t.periodNumber === period);
                                    return (
                                        <DroppableSlot
                                            key={`${period}-${activeDay}`}
                                            period={period}
                                            day={activeDay}
                                            entry={entry}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </DndContext>
        </div>
    );
}
