'use client';

import React, { useEffect, useState } from 'react';
import { Users, GraduationCap, School, Activity, ArrowUpRight, Plus, Banknote } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { dashboardService, SchoolAdminData } from '@/services/dashboard.service';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AdminDashboard() {
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
        { title: 'Total Students', value: data?.stats?.totalStudents || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100', href: '/dashboard/admin/students' },
        { title: 'Total Teachers', value: data?.stats?.totalTeachers || 0, icon: GraduationCap, color: 'text-green-600', bg: 'bg-green-100', href: '/dashboard/admin/teachers' },
        { title: 'Total Classes', value: data?.stats?.totalClasses || 0, icon: School, color: 'text-purple-600', bg: 'bg-purple-100', href: '/dashboard/admin/classes' },
        { title: 'Today\'s Attendance', value: data?.stats?.todayAttendance || 0, icon: Activity, color: 'text-orange-600', bg: 'bg-orange-100', href: '/dashboard/admin/attendance' },
    ];

    return (
        <div className="p-6 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
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
                            {data?.recentActivity?.enrollments?.length ? data.recentActivity.enrollments.map((enrollment: any) => (
                                <div key={enrollment.id} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/20 border border-white/5 group hover:bg-secondary/30 transition-all">
                                    <Avatar className="h-10 w-10 border border-primary/20">
                                        <AvatarImage src={getFullAvatarUrl(enrollment.avatar) || undefined} className="object-cover" />
                                        <AvatarFallback className="bg-primary/5 text-primary text-xs">
                                            {enrollment.name?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold truncate">{enrollment.name}</p>
                                        <p className="text-xs text-muted-foreground">Enrolled in {enrollment.class} • {new Date(enrollment.date).toLocaleDateString()}</p>
                                    </div>
                                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">Details</Button>
                                </div>
                            )) : (
                                <div className="text-center py-10">
                                    <p className="text-sm text-muted-foreground">No recent enrollments</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card border-none">
                    <CardHeader>
                        <CardTitle>Recent Payments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data?.recentActivity?.payments?.length ? data.recentActivity.payments.map((payment: any) => (
                                <div key={payment.id} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/20 border border-white/5">
                                    <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 border border-green-500/20">
                                        <Banknote className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold truncate">{payment.studentName}</p>
                                        <p className="text-xs text-muted-foreground">${payment.amount} • {payment.method}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-muted-foreground">{new Date(payment.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-10">
                                    <p className="text-sm text-muted-foreground">No recent payments tracked</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
