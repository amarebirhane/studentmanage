'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, BookOpen, User, GraduationCap, Clock } from 'lucide-react';
import { subjectService } from '@/services/subject.service';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function StudentSubjectsPage() {
    const [subjects, setSubjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            setLoading(true);
            const data = await subjectService.getSubjects();
            setSubjects(data || []);
        } catch (error) {
            toast.error('Failed to load subjects');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Subjects</h1>
                <p className="text-muted-foreground mt-1">Subjects you are currently enrolled in.</p>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">Loading subjects...</p>
                    </div>
                ) : subjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {subjects.map((subject) => (
                            <Card key={subject.id} className="glass-card border-none hover:ring-1 hover:ring-primary/20 transition-all group overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div className="bg-primary/10 p-3 rounded-xl mb-3 group-hover:bg-primary/20 transition-colors">
                                            <BookOpen className="h-6 w-6 text-primary" />
                                        </div>
                                        {subject.isOptional && <Badge variant="outline">Optional</Badge>}
                                    </div>
                                    <CardTitle className="text-xl">{subject.name}</CardTitle>
                                    <CardDescription>Code: {subject.code || 'N/A'}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 bg-secondary/30 p-3 rounded-lg">
                                            <Avatar className="h-10 w-10 border border-white/10">
                                                <AvatarFallback className="bg-primary/20 text-primary font-bold">
                                                    {subject.teacher?.firstName?.[0] || 'T'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Teacher</p>
                                                <p className="font-medium text-sm">
                                                    {subject.teacher ? `${subject.teacher.firstName} ${subject.teacher.lastName}` : 'Not Assigned'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                                <span>Credits: {subject.credits || 3}</span>
                                            </div>
                                            {/* Add more subject details if available */}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="glass-card border-none p-12 text-center text-muted-foreground">
                        <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <h3 className="text-lg font-medium">No subjects found</h3>
                        <p>You haven't been enrolled in any subjects yet.</p>
                    </Card>
                )}
            </div>
        </div>
    );
}
