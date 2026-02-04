'use client';

import React, { useEffect, useState } from 'react';
import { Building2, Users, CreditCard, Activity, ArrowUpRight, Plus, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { dashboardService, SuperAdminData } from '@/services/dashboard.service';
import Link from 'next/link';

export default function SuperAdminDashboard() {
    const [stats, setStats] = useState({
        schools: 0,
        users: 0,
        revenue: 0,
        activeSubscriptions: 0
    });
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await dashboardService.getDashboardStats<SuperAdminData>();
                if (data && data.stats) {
                    setStats({
                        schools: data.stats.totalSchools || 0,
                        users: data.stats.totalUsers || 0,
                        revenue: data.stats.totalRevenue || 0,
                        activeSubscriptions: data.stats.activeSchools || 0
                    });
                    setRecentActivity(data.recentActivity || []);
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
        { title: 'Registered Schools', value: stats.schools, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-100', href: '/dashboard/super-admin/schools' },
        { title: 'Total Users', value: stats.users, icon: Users, color: 'text-green-600', bg: 'bg-green-100', href: '/dashboard/super-admin/users' },
        { title: 'Total Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-100', href: '/dashboard/super-admin/finance' },
        { title: 'Active Subscriptions', value: stats.activeSubscriptions, icon: Activity, color: 'text-orange-600', bg: 'bg-orange-100', href: '/dashboard/super-admin/schools' },
    ];

    return (
        <div className="p-6 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Platform Overview</h1>
                    <p className="text-muted-foreground mt-1">Super Admin control panel for EduSmart SaaS.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11">System Health</Button>
                    <Link href="/dashboard/super-admin/schools/new">
                        <Button className="h-11 shadow-lg shadow-primary/20">
                            <Plus className="h-4 w-4 mr-2" /> Onboard School
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
                        <CardTitle>Recent Platform Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivity.length > 0 ? (
                                recentActivity.map((activity: any) => (
                                    <div key={activity.id} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/20 border border-white/5">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <ShieldCheck className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold">{activity.action}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {activity.user?.firstName} {activity.user?.lastName} • {new Date(activity.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-muted-foreground italic">
                                    No recent activity found.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card border-none">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-3">
                        <Button variant="secondary" className="w-full justify-start h-12 rounded-xl">View Revenue Reports</Button>
                        <Button variant="secondary" className="w-full justify-start h-12 rounded-xl">Manage Global Settings</Button>
                        <Button variant="secondary" className="w-full justify-start h-12 rounded-xl">Broadcast Announcement</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
