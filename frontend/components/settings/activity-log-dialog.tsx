'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Activity, Shield, LogIn, Laptop, MapPin, Clock } from 'lucide-react';

interface ActivityLogDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ActivityLogDialog({ open, onOpenChange }: ActivityLogDialogProps) {
    // Mock activity data
    const activities = [
        {
            id: 1,
            type: 'login',
            title: 'Successful Login',
            time: '2 hours ago',
            device: 'Chrome on Windows 11',
            location: 'Addis Ababa, ET',
            icon: LogIn,
            color: 'text-green-500',
        },
        {
            id: 2,
            type: 'security',
            title: 'Password Updated',
            time: '3 days ago',
            device: 'Safari on iPhone 15',
            location: 'Dire Dawa, ET',
            icon: Shield,
            color: 'text-primary',
        },
        {
            id: 3,
            type: 'login',
            title: 'New Login Session',
            time: '5 days ago',
            device: 'Edge on Windows 10',
            location: 'Addis Ababa, ET',
            icon: LogIn,
            color: 'text-green-500',
        }
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] glass-card border-white/10">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" /> Activity History
                    </DialogTitle>
                    <DialogDescription>
                        Review your recent account activity and login sessions.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                    {activities.map((activity) => (
                        <div key={activity.id} className="p-4 rounded-xl bg-secondary/30 border border-white/5 space-y-3 hover:bg-secondary/40 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`h-8 w-8 rounded-lg bg-background/50 flex items-center justify-center ${activity.color}`}>
                                        <activity.icon className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">{activity.title}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium opacity-60">{activity.time}</p>
                                    </div>
                                </div>
                                <div className="px-2 py-0.5 rounded text-[10px] bg-green-500/10 text-green-500 border border-green-500/20 font-bold uppercase">Successful</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Laptop className="h-3 w-3" />
                                    <span>{activity.device}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <MapPin className="h-3 w-3" />
                                    <span>{activity.location}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
