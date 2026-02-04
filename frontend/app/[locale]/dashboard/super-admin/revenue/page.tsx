'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Users, School, Loader2 } from "lucide-react";
import { platformService, PlatformStats } from "@/services/platform.service";
import { toast } from "react-hot-toast";

export default function RevenuePage() {
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
            console.error('Failed to fetch revenue stats:', error);
            toast.error('Failed to load revenue data');
        } finally {
            setLoading(false);
        }
    };

    const revenueMetrics = [
        {
            title: "Total Revenue",
            value: stats ? `$${stats.totalRevenue.toLocaleString()}` : "$0.00",
            change: "+0.0%",
            icon: DollarSign,
            color: "text-green-500",
        },
        {
            title: "Total Schools",
            value: stats ? stats.schools.toString() : "0",
            change: "+0",
            icon: School,
            color: "text-blue-500",
        },
        {
            title: "Active Users",
            value: stats ? stats.users.toLocaleString() : "0",
            change: "+0",
            icon: Users,
            color: "text-purple-500",
        },
        {
            title: "Platform Growth",
            value: stats ? `${((stats.schools / 10).toFixed(1))}%` : "0%",
            change: "+0.0%",
            icon: TrendingUp,
            color: "text-orange-500",
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Revenue Tracking</h1>
                <p className="text-muted-foreground">Monitor platform financial performance and subscription growth.</p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    <p className="text-muted-foreground font-medium">Loading revenue data...</p>
                </div>
            ) : (
                <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {revenueMetrics.map((stat) => (
                            <Card key={stat.title} className="glass border-white/10">
                                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <p className="text-xs text-muted-foreground">
                                        <span className="text-green-500 font-medium">{stat.change}</span> from last month
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card className="glass border-white/10">
                        <CardHeader>
                            <CardTitle>Recent Transactions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                    <DollarSign className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold">No recent transactions</h3>
                                <p className="text-sm text-muted-foreground max-w-[300px]">
                                    Detailed transaction history will appear here once schools start their subscriptions.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
