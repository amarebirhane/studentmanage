'use client';

import React from 'react';
import { BookOpen, Users, ClipboardCheck, Plus, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TeacherDashboard() {
    const statCards = [
        { title: 'My Classes', value: '0', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-100', href: '/dashboard/teacher/classes' },
        { title: 'Total Students', value: '0', icon: Users, color: 'text-green-600', bg: 'bg-green-100', href: '/dashboard/teacher/students' },
        { title: 'Attendance Today', value: '0%', icon: ClipboardCheck, color: 'text-purple-600', bg: 'bg-purple-100', href: '/dashboard/teacher/attendance' },
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
                                <div className="text-3xl font-bold">{stat.value}</div>
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
                        <CardTitle>Upcoming Classes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-12 text-muted-foreground italic">
                            No classes scheduled for today.
                        </div>
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
