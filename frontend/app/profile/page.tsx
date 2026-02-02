'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Mail, Shield, User, GraduationCap, Building2 } from 'lucide-react';
import { getDashboardRoute } from '@/lib/utils/routes';

export default function ProfilePage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background nebula-gradient">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        router.push('/login');
        return null;
    }

    const dashboardRoute = getDashboardRoute(user.role);

    return (
        <div className="min-h-screen bg-background nebula-gradient p-6 md:p-12">
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header / Back Button */}
                <div className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        onClick={() => router.push(dashboardRoute)}
                        className="gap-2 hover:bg-white/10 text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground/80">User Profile</h1>
                </div>

                {/* Main Profile Card */}
                <Card className="glass-card border-none overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary/20 to-primary/5"></div>

                    <CardContent className="pt-20 pb-8 px-8 relative">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            {/* Avatar Section */}
                            <div className="flex flex-col items-center space-y-4">
                                <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} />
                                    <AvatarFallback className="text-4xl font-bold bg-primary/10 text-primary">
                                        {user.firstName?.[0]}{user.lastName?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="text-center">
                                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
                                        {user.role}
                                    </div>
                                </div>
                            </div>

                            {/* Details Section */}
                            <div className="flex-1 space-y-6 w-full">
                                <div>
                                    <h2 className="text-3xl font-black tracking-tight">{user.firstName} {user.lastName}</h2>
                                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                                        <Mail className="h-4 w-4" /> {user.email}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-secondary/30 border border-white/5 space-y-1">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">User ID</p>
                                        <p className="font-mono text-sm opacity-80 truncate" title={user.id}>{user.id}</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-secondary/30 border border-white/5 space-y-1">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Account Status</p>
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                            <p className="font-semibold text-sm">Active</p>
                                        </div>
                                    </div>
                                    {(user.role === 'STUDENT' || user.role === 'TEACHER') && (
                                        <div className="p-4 rounded-xl bg-secondary/30 border border-white/5 space-y-1 md:col-span-2">
                                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                                <Building2 className="h-3.5 w-3.5" />
                                                <p className="text-xs font-medium uppercase tracking-wider">Institution</p>
                                            </div>
                                            <p className="font-semibold">EduSmart Academy</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Additional Settings / Info (Placeholder) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="glass-card border-none hover:bg-white/5 transition-colors cursor-pointer group">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Shield className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                                Security
                            </CardTitle>
                            <CardDescription>Manage password & 2FA</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="glass-card border-none hover:bg-white/5 transition-colors cursor-pointer group">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <User className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                                Preferences
                            </CardTitle>
                            <CardDescription>Theme & Notification settings</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="glass-card border-none hover:bg-white/5 transition-colors cursor-pointer group">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Activity className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                                Activity
                            </CardTitle>
                            <CardDescription>View login history</CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </div>
        </div>
    );
}

// Helper icon component since Activity isn't imported from lucide-react above yet
import { Activity } from 'lucide-react';
