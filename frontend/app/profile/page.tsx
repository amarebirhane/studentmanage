'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Shield, User, Building2, Pencil, Loader2, Save, X } from 'lucide-react';
import Sidebar from '@/components/layout/sidebar';
import Navbar from '@/components/layout/navbar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import { authService } from '@/services/auth.service';

export default function ProfilePage() {
    const { user, isLoading, login } = useAuth(); // Assuming login or a similar method updates the local user state
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background nebula-gradient">
                <Loader2 className="animate-spin h-12 w-12 text-primary" />
            </div>
        );
    }

    if (!user) {
        router.push('/login');
        return null;
    }

    const handleEditClick = () => {
        setFormData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            phone: user.phone || '',
        });
        setIsEditing(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const updatedUser = await authService.updateProfile(formData);
            // We need to update the local user state. 
            // Ideally, useAuth should expose a way to mutate the user, or we can just reload the page/re-fetch.
            // For now, let's assume valid data and reload is a simple fallback if useAuth doesn't support direct mutation.
            toast.success('Profile updated successfully');
            setIsEditing(false);
            window.location.reload();
        } catch (error: any) {
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-background nebula-gradient">
            <Sidebar />
            <div className="flex-1 flex flex-col ml-72">
                <Navbar />
                <main className="p-8 flex-1 overflow-auto custom-scrollbar">
                    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground/80">User Profile</h1>
                            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                                <DialogTrigger asChild>
                                    <Button onClick={handleEditClick} className="gap-2">
                                        <Pencil className="h-4 w-4" /> Edit Profile
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px] glass-card border-white/10">
                                    <DialogHeader>
                                        <DialogTitle>Edit Profile</DialogTitle>
                                        <DialogDescription>
                                            Make changes to your profile here. Click save when you're done.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="firstName" className="text-right">
                                                First Name
                                            </Label>
                                            <Input
                                                id="firstName"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                className="col-span-3 bg-secondary/50 border-white/10"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="lastName" className="text-right">
                                                Last Name
                                            </Label>
                                            <Input
                                                id="lastName"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                className="col-span-3 bg-secondary/50 border-white/10"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="phone" className="text-right">
                                                Phone
                                            </Label>
                                            <Input
                                                id="phone"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="col-span-3 bg-secondary/50 border-white/10"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                                        <Button onClick={handleSave} disabled={isSaving}>
                                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Save Changes
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
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
                                            {user.phone && (
                                                <p className="text-muted-foreground flex items-center gap-2 mt-1">
                                                    <span className="text-xs uppercase tracking-wider font-bold text-muted-foreground/70">Phone:</span> {user.phone}
                                                </p>
                                            )}
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
                </main>
            </div>
        </div>
    );
}

// Helper icon component
import { Activity } from 'lucide-react';
