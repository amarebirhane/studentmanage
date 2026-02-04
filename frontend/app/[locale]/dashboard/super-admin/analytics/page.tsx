'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, School, GraduationCap, Building2, Loader2 } from "lucide-react";
import { platformService, PlatformStats } from "@/services/platform.service";
import { toast } from "react-hot-toast";

export default function AnalyticsPage() {
    const [stats, setStats] = useState<PlatformStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const data = await platformService.getStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch analytics stats:', error);
            toast.error('Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    };

    const analyticsMetrics = [
        {
            title: "Total Schools",
            value: stats ? stats.schools.toLocaleString() : "0",
            change: "+0",
            icon: School,
            color: "text-blue-500",
        },
        {
            title: "Total Students",
            value: stats ? stats.students.toLocaleString() : "0",
            change: "+0",
            icon: GraduationCap,
            color: "text-green-500",
        },
        {
            title: "Total Teachers",
            value: stats ? stats.teachers.toLocaleString() : "0",
            change: "+0",
            icon: Users,
            color: "text-purple-500",
        },
        {
            title: "Platform Users",
            value: stats ? stats.users.toLocaleString() : "0",
            change: "+0",
            icon: Building2,
            color: "text-orange-500",
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Global Analytics</h1>
                <p className="text-muted-foreground">Comprehensive overview of platform-wide activity and growth metrics.</p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    <p className="text-muted-foreground font-medium">Loading analytics data...</p>
                </div>
            ) : (
                <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {analyticsMetrics.map((stat) => (
                            <Card key={stat.title} className="glass border-white/10">
                                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <p className="text-xs text-muted-foreground">
                                        <span className="text-green-500 font-medium">{stat.change}</span> from last quarter
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4 glass border-white/10">
                            <CardHeader>
                                <CardTitle>Recent Schools</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {stats?.recentSchools.map((school: any) => (
                                        <div key={school.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all">
                                            <div className="flex items-center space-x-3">
                                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                    <School className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold">{school.name}</p>
                                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{new Date(school.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-primary">{school.students} Students</p>
                                                <p className="text-[10px] text-muted-foreground">Active Tenant</p>
                                            </div>
                                        </div>
                                    )) || (
                                            <div className="text-center py-10">
                                                <p className="text-muted-foreground">No recent schools onboarded.</p>
                                            </div>
                                        )}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="col-span-3 glass border-white/10">
                            <CardHeader>
                                <CardTitle>Platform Distribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-white/5 rounded-xl">
                                    <span className="text-muted-foreground text-sm font-medium">Regional Insights Coming Soon</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
}
