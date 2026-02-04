'use client';

import React, { useEffect, useState } from 'react';
import { Users, CreditCard, MessageCircle, ArrowUpRight, GraduationCap, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { dashboardService, ParentData } from '@/services/dashboard.service';

export default function ParentDashboard() {
    const { user } = useAuth();
    const [data, setData] = useState<ParentData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const result = await dashboardService.getDashboardStats<ParentData>();
                setData(result);
            } catch (error) {
                console.error('Failed to fetch parent dashboard stats', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="h-[calc(100vh-200px)] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="text-muted-foreground animate-pulse font-medium">Loading your parent portal...</p>
            </div>
        );
    }

    const statCards = [
        { title: 'Children Enrolled', value: data?.children?.length || 0, icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-100', href: '#' },
        { title: 'Academic Alerts', value: data?.children?.reduce((acc, c) => acc + c.absentCount, 0) || 0, icon: Users, color: 'text-orange-600', bg: 'bg-orange-100', href: '/dashboard/attendance' },
        { title: 'New Messages', value: '0', icon: MessageCircle, color: 'text-purple-600', bg: 'bg-purple-100', href: '/dashboard/messages' },
    ];

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Parent Portal</h1>
                    <p className="text-muted-foreground mt-1">Monitor your children's academic progress and school activities.</p>
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
                                    View <ArrowUpRight className="h-3 w-3 ml-1" />
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
                            <Users className="h-5 w-5 text-primary" /> My Children
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {data?.children && data.children.length > 0 ? (
                                data.children.map((child) => (
                                    <div key={child.id} className="p-4 rounded-xl bg-secondary/20 border border-white/5 flex items-center justify-between group hover:bg-secondary/30 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                                                {child.name[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">{child.name}</p>
                                                <p className="text-[10px] text-muted-foreground uppercase">{child.class} • {child.section}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Link href={`/dashboard/parent/child-progress/${child.id}`}>
                                                <Button size="sm" variant="ghost" className="text-xs font-semibold hover:bg-primary/10 hover:text-primary rounded-lg">
                                                    Progress <ArrowUpRight className="h-3 w-3 ml-1" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10">
                                    <p className="text-sm text-muted-foreground italic">No children registered under this account.</p>
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
                            <Link href="/dashboard/student/fees">
                                <Button className="w-full justify-start h-16 rounded-xl border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-foreground" variant="outline">
                                    <div className="bg-emerald-500/10 p-2 rounded-lg mr-3">
                                        <CreditCard className="h-5 w-5 text-emerald-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-bold">Outstanding Fees</p>
                                        <p className="text-[10px] text-muted-foreground">Review and pay child dues</p>
                                    </div>
                                </Button>
                            </Link>
                            <Link href="/dashboard/messages">
                                <Button className="w-full justify-start h-16 rounded-xl border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 text-foreground" variant="outline">
                                    <div className="bg-blue-500/10 p-2 rounded-lg mr-3">
                                        <MessageCircle className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-bold">Contact Teacher</p>
                                        <p className="text-[10px] text-muted-foreground">Send direct messages</p>
                                    </div>
                                </Button>
                            </Link>
                            <Link href="/dashboard/announcements">
                                <Button className="w-full justify-start h-16 rounded-xl border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 text-foreground" variant="outline">
                                    <div className="bg-purple-500/10 p-2 rounded-lg mr-3">
                                        <MessageCircle className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-bold">School Notices</p>
                                        <p className="text-[10px] text-muted-foreground">View latest updates</p>
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
