'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Users, BookOpen, ArrowRight } from 'lucide-react';
import { teacherService } from '@/services/teacher.service';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function MyClassesPage() {
    const [sections, setSections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const data = await teacherService.getTeacherClasses();
                setSections(data || []);
            } catch (error) {
                toast.error('Failed to fetch your classes');
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Classes</h1>
                <p className="text-muted-foreground mt-1">View and manage the sections assigned to you.</p>
            </div>

            {sections.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sections.map((section) => (
                        <Card key={section.id} className="glass-card border-none hover:translate-y-[-4px] transition-all duration-300">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg font-bold">
                                    {section.class?.name} - {section.name}
                                </CardTitle>
                                <div className="bg-primary/10 p-2 rounded-xl">
                                    <GraduationCap className="h-5 w-5 text-primary" />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Users className="h-4 w-4" />
                                        <span>{section._count?.students || 0} Students</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <BookOpen className="h-4 w-4" />
                                        <span>Full Detail</span>
                                    </div>
                                </div>
                                <div className="pt-4 flex gap-2">
                                    <Link href={`/dashboard/teacher/attendance?sectionId=${section.id}`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full">
                                            Attendance
                                        </Button>
                                    </Link>
                                    <Link href={`/dashboard/teacher/classes/${section.id}`} className="flex-1">
                                        <Button size="sm" className="w-full group">
                                            View <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 glass-card rounded-2xl border-none">
                    <GraduationCap className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-muted-foreground">No Classes Assigned</h3>
                    <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
                        You haven't been assigned to any class sections yet. Please contact the administrator.
                    </p>
                </div>
            )}
        </div>
    );
}
