'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, School, GraduationCap, Building2 } from "lucide-react";

export default function AnalyticsPage() {
    const stats = [
        {
            title: "Total Schools",
            value: "156",
            change: "+12",
            icon: School,
            color: "text-blue-500",
        },
        {
            title: "Total Students",
            value: "24,850",
            change: "+1,200",
            icon: GraduationCap,
            color: "text-green-500",
        },
        {
            title: "Total Teachers",
            value: "1,420",
            change: "+85",
            icon: Users,
            color: "text-purple-500",
        },
        {
            title: "Active Regions",
            value: "18",
            change: "+2",
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

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
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
                        <CardTitle>Usage Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] flex items-center justify-center border-2 border-dashed border-white/5 rounded-xl">
                            <span className="text-muted-foreground text-sm font-medium">Growth Chart Placeholder</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3 glass border-white/10">
                    <CardHeader>
                        <CardTitle>Regional Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] flex items-center justify-center border-2 border-dashed border-white/5 rounded-xl">
                            <span className="text-muted-foreground text-sm font-medium">Distribution Map Placeholder</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
