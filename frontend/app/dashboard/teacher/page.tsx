'use client';

import React, { useEffect, useState } from 'react';
import { BookOpen, Users, ClipboardCheck, Plus, ArrowUpRight, GraduationCap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { dashboardService, TeacherData } from '@/services/dashboard.service';
import Link from 'next/link';

export default function TeacherDashboard() {
    const [stats, setStats] = useState({
        classes: 0,
        subjects: 0,
        assignments: 0
    });
    const [upcomingExams, setUpcomingExams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await dashboardService.getDashboardStats<TeacherData>();
                if (data && data.stats) {
                    setStats({
                        classes: data.stats.managedClasses || 0,
                        subjects: data.stats.taughtSubjects || 0,
                        assignments: data.stats.activeAssignments || 0
                    });
                    setUpcomingExams(data.upcomingExams || []);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard stats', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        { title: 'My Classes', value: stats.classes, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-100', href: '/dashboard/teacher/classes' },
        { title: 'Taught Subjects', value: stats.subjects, icon: GraduationCap, color: 'text-green-600', bg: 'bg-green-100', href: '/dashboard/teacher/subjects' },
        { title: 'Active Assignments', value: stats.assignments, icon: ClipboardCheck, color: 'text-purple-600', bg: 'bg-purple-100', href: '/dashboard/teacher/assignments' },
    ];

    return (
        <div className="p-6 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Teacher Portal</h1>
                    <p className="text-muted-foreground mt-1">Manage your classes, students and academic performance.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/teacher/attendance">
                        <Button className="h-11 shadow-lg shadow-primary/20">
                            <Plus className="h-4 w-4 mr-2" /> Take Attendance
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((stat, idx) => (
                    <Card key={idx} className="glass-card border-none hover:translate-y-[-4px] transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className={`${stat.bg} p-2 rounded-xl`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline justify-between">
                                <div className="text-3xl font-bold">
                                    {loading ? '...' : stat.value}
                                </div>
                                <Link href={stat.href} className="text-xs text-primary font-semibold flex items-center hover:underline">
                                    View all <ArrowUpRight className="h-3 w-3 ml-1" />
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="glass-card border-none">
                    <CardHeader>
                        <CardTitle>Upcoming Exams</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {upcomingExams.length > 0 ? (
                            <div className="space-y-4">
                                {upcomingExams.map((exam: any) => (
                                    <div key={exam.id} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/20 border border-white/5">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <BookOpen className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold">{exam.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(exam.examDate).toLocaleDateString()} • {exam.class?.name}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground italic">
                                No upcoming exams found.
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="glass-card border-none">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-3">
                        <Button variant="secondary" className="w-full justify-start h-12 rounded-xl">View Assignment Submissions</Button>
                        <Button variant="secondary" className="w-full justify-start h-12 rounded-xl">Submit Grades</Button>
                        <Button variant="secondary" className="w-full justify-start h-12 rounded-xl">Post Announcement</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
