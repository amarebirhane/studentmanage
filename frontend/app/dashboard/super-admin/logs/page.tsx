'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, ShieldAlert, UserCheck, Settings } from "lucide-react";

export default function AuditLogsPage() {
    const recentLogs = [
        {
            id: "1",
            action: "School Created",
            user: "super-admin@edusmart.com",
            target: "Oakwood International Academy",
            time: "2 hours ago",
            icon: ShieldAlert,
            color: "text-blue-500",
        },
        {
            id: "2",
            action: "Subscription Updated",
            user: "super-admin@edusmart.com",
            target: "Westside High School",
            time: "5 hours ago",
            icon: Settings,
            color: "text-purple-500",
        },
        {
            id: "3",
            action: "Login Failure Pattern",
            user: "system-monitor",
            target: "Multiple Accounts",
            time: "8 hours ago",
            icon: ShieldAlert,
            color: "text-red-500",
        },
        {
            id: "4",
            action: "User Promoted to Admin",
            user: "super-admin@edusmart.com",
            target: "John Smith (Riverside Primary)",
            time: "1 day ago",
            icon: UserCheck,
            color: "text-green-500",
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
                <p className="text-muted-foreground">Detailed record of all critical system activities and security events.</p>
            </div>

            <Card className="glass border-white/10">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {recentLogs.map((log) => (
                            <div key={log.id} className="flex items-start space-x-4 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                                <div className={`p-2 rounded-lg bg-primary/5 ${log.color}`}>
                                    <log.icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-bold">{log.action}</p>
                                        <span className="text-xs text-muted-foreground">{log.time}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        <span className="font-medium text-foreground">{log.user}</span> on {log.target}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="glass border-white/10 opacity-50">
                <CardContent className="py-12 flex flex-col items-center justify-center text-center">
                    <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-sm font-medium">Advanced search and filtering are currently disabled.</p>
                    <p className="text-xs text-muted-foreground mt-1">These features will be available in a future update.</p>
                </CardContent>
            </Card>
        </div>
    );
}
