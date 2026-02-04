'use client';

import React from 'react';
import { LayoutDashboard, BookOpen, ScrollText, Calendar, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function StudentDashboard() {
    const { user } = useAuth();

    const statCards = [
        { title: 'Attendance Rate', value: '0%', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100', href: '/dashboard/student/attendance' },
        { title: 'Subjects', value: '0', icon: BookOpen, color: 'text-green-600', bg: 'bg-green-100', href: '/dashboard/student/subjects' },
        { title: 'Average Grade', value: '-', icon: ScrollText, color: 'text-purple-600', bg: 'bg-purple-100', href: '/dashboard/student/results' },
    ];

    return (
        <div className="p-6 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.firstName}!</h1>
                    <p className="text-muted-foreground mt-1">Here is your academic overview for this semester.</p>
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
                                    Details <ArrowUpRight className="h-3 w-3 ml-1" />
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 glass-card border-none">
                    <CardHeader>
                        <CardTitle>Upcoming Homework & Exams</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-12 text-muted-foreground italic">
                            No upcoming deadlines for now. Enjoy your day!
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card border-none">
                    <CardHeader>
                        <CardTitle>Recent Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground text-center py-4">No recent test results published.</p>
                        <Button variant="outline" className="w-full mt-4">View Full Marksheet</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
