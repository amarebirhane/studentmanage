'use client';

import React, { useEffect, useState } from 'react';
import { Users, GraduationCap, School, Activity, ArrowUpRight, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { studentService } from '@/services/student.service';
import { teacherService } from '@/services/teacher.service';
import { classService } from '@/services/class.service';
import Link from 'next/link';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        students: 0,
        teachers: 0,
        classes: 0,
        activeSessions: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [students, teachers, classes] = await Promise.all([
                    studentService.getStudents({ limit: 1 }),
                    teacherService.getTeachers({ limit: 1 }),
                    classService.getClasses()
                ]);

                setStats({
                    students: students.pagination.total || 0,
                    teachers: teachers.pagination.total || 0,
                    classes: classes.length || 0,
                    activeSessions: Math.floor(Math.random() * 10) + 5 // Placeholder for active sessions
                });
            } catch (error) {
                console.error('Failed to fetch dashboard stats');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        { title: 'Total Students', value: stats.students, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100', href: '/dashboard/admin/students' },
        { title: 'Total Teachers', value: stats.teachers, icon: GraduationCap, color: 'text-green-600', bg: 'bg-green-100', href: '/dashboard/admin/teachers' },
        { title: 'Total Classes', value: stats.classes, icon: School, color: 'text-purple-600', bg: 'bg-purple-100', href: '/dashboard/admin/classes' },
        { title: 'Active Sessions', value: stats.activeSessions, icon: Activity, color: 'text-orange-600', bg: 'bg-orange-100', href: '#' },
    ];

    return (
        <div className="p-6 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                    <p className="text-muted-foreground mt-1">Welcome to EduSmart management portal.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11">Download Report</Button>
                    <Link href="/dashboard/admin/students/new">
                        <Button className="h-11 shadow-lg shadow-primary/20">
                            <Plus className="h-4 w-4 mr-2" /> Enroll Student
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 glass-card border-none">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/20 border border-white/5">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <Users className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold">New student enrolled</p>
                                        <p className="text-xs text-muted-foreground">Class 10A • 2 hours ago</p>
                                    </div>
                                    <Button variant="ghost" size="sm">Details</Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card border-none">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-3">
                        <Button variant="secondary" className="w-full justify-start h-12 rounded-xl">Generate Attendance Report</Button>
                        <Button variant="secondary" className="w-full justify-start h-12 rounded-xl">Schedule New Exam</Button>
                        <Button variant="secondary" className="w-full justify-start h-12 rounded-xl">Publish Announcement</Button>
                        <Button variant="secondary" className="w-full justify-start h-12 rounded-xl">Manage Permissions</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
