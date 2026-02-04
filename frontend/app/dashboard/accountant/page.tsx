'use client';

import React, { useEffect, useState } from 'react';
import { DollarSign, Banknote, ClipboardList, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboardService, SchoolAdminData } from '@/services/dashboard.service';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export default function AccountantDashboard() {
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
        { title: 'Total Revenue', value: `$${data?.stats?.totalRevenue || 0}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100', href: '/dashboard/admin/fees' },
        { title: 'Pending Fees', value: data?.stats?.pendingFeesCount || 0, icon: DollarSign, color: 'text-orange-600', bg: 'bg-orange-100', href: '/dashboard/admin/fees' },
        { title: 'Total Students', value: data?.stats?.totalStudents || 0, icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-100', href: '#' },
    ];

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Accountant Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Financial overview and fee management.</p>
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
                                    Manage <ArrowUpRight className="h-3 w-3 ml-1" />
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="glass-card border-none overflow-hidden rounded-2xl">
                    <CardHeader className="bg-primary/5 border-b border-white/5">
                        <CardTitle className="flex items-center gap-2">
                            <Banknote className="h-5 w-5 text-primary" /> Recent Payments
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {data?.recentActivity?.payments?.length ? data.recentActivity.payments.map((payment: any) => (
                                <div key={payment.id} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/20 border border-white/5 group hover:bg-secondary/30 transition-all">
                                    <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                                        <Banknote className="h-5 w-5 text-emerald-600" />
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
                                    <p className="text-sm text-muted-foreground">No recent payments recorded</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card border-none overflow-hidden rounded-2xl">
                    <CardHeader className="bg-primary/5 border-b border-white/5">
                        <CardTitle className="flex items-center gap-2">
                            Quick Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 gap-4">
                            <Link href="/dashboard/admin/fees">
                                <Button className="w-full justify-start h-12 rounded-xl" variant="outline">
                                    <DollarSign className="h-4 w-4 mr-2 text-primary" /> Process New Fee Payment
                                </Button>
                            </Link>
                            <Link href="/dashboard/admin/reports">
                                <Button className="w-full justify-start h-12 rounded-xl" variant="outline">
                                    <ClipboardList className="h-4 w-4 mr-2 text-primary" /> Generate Financial Report
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
