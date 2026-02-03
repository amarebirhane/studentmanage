'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Users, School } from "lucide-react";

export default function RevenuePage() {
    const stats = [
        {
            title: "Total Revenue",
            value: "$128,430.00",
            change: "+12.5%",
            icon: DollarSign,
            color: "text-green-500",
        },
        {
            title: "Active Subscriptions",
            value: "42",
            change: "+3",
            icon: Users,
            color: "text-blue-500",
        },
        {
            title: "Average School Lifetime Value",
            value: "$3,057.85",
            change: "+5.2%",
            icon: School,
            color: "text-purple-500",
        },
        {
            title: "Monthly Recurring Revenue",
            value: "$15,200.00",
            change: "+8.1%",
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
        </div>
    );
}
