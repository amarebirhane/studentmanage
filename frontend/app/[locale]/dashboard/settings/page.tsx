'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings, User, Bell, Lock, ChevronRight, ShieldCheck, Fingerprint, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChangePasswordDialog } from '@/components/settings/change-password-dialog';
import { NotificationSettingsDialog } from '@/components/settings/notification-settings-dialog';

export default function SettingsPage() {
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false);

    const settingsGroups = [
        {
            title: "Profile Settings",
            icon: User,
            description: "Update your personal information, profile picture and contact details.",
            action: "Manage Profile",
            href: "/profile",
            onClick: null
        },
        {
            title: "Security",
            icon: Lock,
            description: "Manage your account password and security preferences.",
            action: "Security Settings",
            href: null,
            onClick: () => setIsPasswordDialogOpen(true)
        },
        {
            title: "Notifications",
            icon: Bell,
            description: "Configure how you receive alerts, emails and system notifications.",
            action: "Configure Notifications",
            href: null,
            onClick: () => setIsNotificationDialogOpen(true)
        }
    ];

    return (
        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black tracking-tight text-foreground/90">System Settings</h1>
                <p className="text-muted-foreground">Manage your account preferences and security configuration.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {settingsGroups.map((group, index) => (
                    <Card key={index} className="glass-card border-none overflow-hidden group hover:bg-white/5 transition-all duration-300">
                        <CardHeader className="pb-4">
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                                <group.icon className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle className="text-xl font-bold">{group.title}</CardTitle>
                            <CardDescription className="line-clamp-2 min-h-[40px]">{group.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {group.href ? (
                                <Link href={group.href} className="w-full">
                                    <Button variant="outline" className="w-full justify-between items-center group-hover:bg-primary group-hover:text-white transition-colors border-white/10">
                                        {group.action}
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            ) : (
                                <Button
                                    variant="outline"
                                    onClick={group.onClick!}
                                    className="w-full justify-between items-center group-hover:bg-primary group-hover:text-white transition-colors border-white/10"
                                >
                                    {group.action}
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Account Status / Extra Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <Card className="glass-card border-none bg-primary/[0.02]">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-primary" /> Privacy & Privacy
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                            <div className="flex items-center gap-3">
                                <Fingerprint className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Two-Factor Authentication</p>
                                    <p className="text-xs text-muted-foreground">Extra layer of security for your account</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-xs font-bold text-primary">Enable</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card border-none bg-primary/[0.02]">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <History className="h-5 w-5 text-primary" /> Activity Log
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5" />
                                <div>
                                    <p className="text-sm font-medium">Successful Login</p>
                                    <p className="text-xs text-muted-foreground">Today at 10:45 AM from Windows Device</p>
                                </div>
                            </div>
                            <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:text-primary">View Full Activity History</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <ChangePasswordDialog
                open={isPasswordDialogOpen}
                onOpenChange={setIsPasswordDialogOpen}
            />
            <NotificationSettingsDialog
                open={isNotificationDialogOpen}
                onOpenChange={setIsNotificationDialogOpen}
            />
        </div>
    );
}
