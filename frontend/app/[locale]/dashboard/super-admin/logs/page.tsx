'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, ShieldAlert, UserCheck, Settings, Loader2, Info } from "lucide-react";
import { platformService } from "@/services/platform.service";
import { toast } from "react-hot-toast";

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const data = await platformService.getLogs();
            // Assuming data is { logs: [...], total: ... } based on backend
            setLogs(data.logs || []);
        } catch (error) {
            console.error('Failed to fetch audit logs:', error);
            toast.error('Failed to load audit logs');
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (module: string) => {
        switch (module.toLowerCase()) {
            case 'auth': return ShieldAlert;
            case 'users': return UserCheck;
            case 'platform': return Settings;
            default: return Info;
        }
    };

    const getColor = (module: string) => {
        switch (module.toLowerCase()) {
            case 'auth': return 'text-red-500';
            case 'users': return 'text-green-500';
            case 'platform': return 'text-blue-500';
            default: return 'text-muted-foreground';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
                <p className="text-muted-foreground">Detailed record of all critical system activities and security events.</p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    <p className="text-muted-foreground font-medium">Loading system logs...</p>
                </div>
            ) : (
                <Card className="glass border-white/10">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {logs.length > 0 ? logs.map((log) => {
                                const Icon = getIcon(log.module);
                                return (
                                    <div key={log.id} className="flex items-start space-x-4 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                                        <div className={`p-2 rounded-lg bg-primary/5 ${getColor(log.module)}`}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-bold">{log.action}</p>
                                                <span className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                <span className="font-medium text-foreground">{log.userName}</span> (ID: {log.userId}) performed action in <span className="font-medium">{log.module}</span>
                                            </p>
                                            {log.details && (
                                                <p className="text-[10px] text-muted-foreground bg-white/5 p-2 rounded-md mt-2 italic">
                                                    {JSON.stringify(log.details)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="text-center py-10">
                                    <p className="text-muted-foreground">No recent activity logs found.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

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
