'use client';

import React, { useEffect, useState } from 'react';
import { Users, GraduationCap, School, Activity, ArrowUpRight, ClipboardCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboardService, SchoolAdminData } from '@/services/dashboard.service';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function StaffDashboard() {
    const [data, setData] = useState<SchoolAdminData | null>(null);
    const [loading, setLoading] = useState(true);

    const getFullAvatarUrl = (url: string | null | undefined) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const baseUrl = apiUrl.replace('/api/v1', '');
        return `${baseUrl}${url}`;
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const result = await dashboardService.getDashboardStats<SchoolAdminData>();
                setData(result);
            } catch (error) {
                console.error('Failed to fetch dashboard stats', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        { title: 'Total Students', value: data?.stats?.totalStudents || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100', href: '#' },
        { title: 'Total Teachers', value: data?.stats?.totalTeachers || 0, icon: GraduationCap, color: 'text-green-600', bg: 'bg-green-100', href: '#' },
        { title: 'Today\'s Attendance', value: data?.stats?.todayAttendance || 0, icon: Activity, color: 'text-orange-600', bg: 'bg-orange-100', href: '/dashboard/attendance' },
    ];

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Staff Overview</h1>
                    <p className="text-muted-foreground mt-1">Daily school activities and student records.</p>
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
                                    View <ArrowUpRight className="h-3 w-3 ml-1" />
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 glass-card border-none overflow-hidden rounded-2xl">
                    <CardHeader className="bg-primary/5 border-b border-white/5">
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" /> Recent Student Enrollments
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {data?.recentActivity?.enrollments?.length ? data.recentActivity.enrollments.map((enrollment: any) => (
                                <div key={enrollment.id} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/20 border border-white/5 group hover:bg-secondary/30 transition-all">
                                    <Avatar className="h-10 w-10 border border-primary/20">
                                        <AvatarImage src={getFullAvatarUrl(enrollment.avatar) || undefined} className="object-cover" />
                                        <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                                            {enrollment.name?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold truncate">{enrollment.name}</p>
                                        <p className="text-xs text-muted-foreground">Enrolled in {enrollment.class} • {new Date(enrollment.date).toLocaleDateString()}</p>
                                    </div>
                                    <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            )) : (
                                <div className="text-center py-10">
                                    <p className="text-sm text-muted-foreground">No recent enrollments to show</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card border-none overflow-hidden rounded-2xl">
                    <CardHeader className="bg-primary/5 border-b border-white/5">
                        <CardTitle className="flex items-center gap-2">
                            Quick Tasks
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 gap-4">
                            <Link href="/dashboard/attendance">
                                <Button className="w-full justify-start h-12 rounded-xl" variant="outline">
                                    <ClipboardCheck className="h-4 w-4 mr-2 text-primary" /> Mark Daily Attendance
                                </Button>
                            </Link>
                            <Link href="/dashboard/announcements">
                                <Button className="w-full justify-start h-12 rounded-xl" variant="outline">
                                    <Activity className="h-4 w-4 mr-2 text-primary" /> Post School Announcement
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
