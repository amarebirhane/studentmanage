'use client';

import React, { useEffect, useState } from 'react';
import { Users, GraduationCap, School, Activity, ArrowUpRight, ClipboardCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboardService, SchoolAdminData } from '@/services/dashboard.service';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
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
                    <CardHeader className="bg-primary/5 border-b border-white/5 flex flex-row items-center justify-between p-6">
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" /> Today's Attendance Overview
                        </CardTitle>
                        <Link href="/dashboard/attendance" className="text-xs font-bold text-primary hover:underline">Full Report</Link>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Present Students</p>
                                    <p className="text-2xl font-bold">{data?.stats?.todayAttendance || 0}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
                                    <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1">Recent Enrollments</p>
                                    <div className="space-y-2 mt-2">
                                        {data?.recentActivity?.enrollments?.slice(0, 3).map((s: any) => (
                                            <div key={s.id} className="flex items-center justify-between">
                                                <span className="text-sm font-medium truncate mr-2">{s.name}</span>
                                                <span className="text-[10px] text-muted-foreground whitespace-nowrap">{s.class}</span>
                                            </div>
                                        )) || <p className="text-xs text-muted-foreground">No recent enrollments</p>}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <Card className="bg-secondary/20 border-white/5 rounded-xl">
                                    <CardContent className="p-4">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Quick Student Search</p>
                                        <div className="relative">
                                            <Link href="/dashboard/admin/students">
                                                <Button size="sm" variant="outline" className="w-full text-xs h-9 rounded-lg">Go to Student Directory</Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card border-none overflow-hidden rounded-2xl">
                    <CardHeader className="bg-primary/5 border-b border-white/5">
                        <CardTitle className="flex items-center gap-2">
                            Administrative Ops
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 gap-4">
                            <Link href="/dashboard/admin/students">
                                <Button className="w-full justify-start h-16 rounded-xl border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 text-foreground" variant="outline">
                                    <div className="bg-blue-500/10 p-2 rounded-lg mr-3">
                                        <Users className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-bold">Manage Students</p>
                                        <p className="text-[10px] text-muted-foreground">Enroll & update profiles</p>
                                    </div>
                                </Button>
                            </Link>
                            <Link href="/dashboard/attendance">
                                <Button className="w-full justify-start h-16 rounded-xl border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-foreground" variant="outline">
                                    <div className="bg-emerald-500/10 p-2 rounded-lg mr-3">
                                        <ClipboardCheck className="h-5 w-5 text-emerald-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-bold">Mark Attendance</p>
                                        <p className="text-[10px] text-muted-foreground">Review daily records</p>
                                    </div>
                                </Button>
                            </Link>
                            <Link href="/dashboard/admin/classes">
                                <Button className="w-full justify-start h-16 rounded-xl border-orange-500/20 bg-orange-500/5 hover:bg-orange-500/10 text-foreground" variant="outline">
                                    <div className="bg-orange-500/10 p-2 rounded-lg mr-3">
                                        <School className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-bold">Classes & Sections</p>
                                        <p className="text-[10px] text-muted-foreground">Manage classrooms</p>
                                    </div>
                                </Button>
                            </Link>
                            <Link href="/dashboard/announcements">
                                <Button className="w-full justify-start h-16 rounded-xl border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 text-foreground" variant="outline">
                                    <div className="bg-purple-500/10 p-2 rounded-lg mr-3">
                                        <Activity className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-bold">Post Notice</p>
                                        <p className="text-[10px] text-muted-foreground">Broadcast updates</p>
                                    </div>
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
