'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Shield, User, Building2, Pencil, Loader2, Save, X, Camera, Upload } from 'lucide-react';
import Sidebar from '@/components/layout/sidebar';
import Navbar from '@/components/layout/navbar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'react-hot-toast';
import { authService } from '@/services/auth.service';
import api from '@/lib/api';
import { useTheme } from 'next-themes';
import { ChangePasswordDialog } from '@/components/settings/change-password-dialog';
import { Moon, Sun, Monitor, Laptop, Bell, Activity as ActivityIcon } from 'lucide-react';
import { NotificationSettingsDialog } from '@/components/settings/notification-settings-dialog';
import { ActivityLogDialog } from '@/components/settings/activity-log-dialog';
import { TwoFactorModal } from '@/components/auth/TwoFactorModal';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';

export default function ProfilePage() {
    const { user, isLoading, updateProfile } = useAuth();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { theme, setTheme } = useTheme();
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false);
    const [isActivityLogOpen, setIsActivityLogOpen] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
    });
    const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    useEffect(() => {
        if (user) {
            check2FAStatus();
        }
    }, [user]);

    const check2FAStatus = async () => {
        try {
            // We need a dedicated endpoint or update profile endpoint to return this status if not in user object
            // For now assuming we can fetch it or it's part of user profile response
            const res = await api.get('/auth/profile');
            setIs2FAEnabled(res.data.data.twoFactorEnabled);
        } catch (e) { }
    };

    const handleDisable2FA = () => {
        setDeleteDialogOpen(true);
    };

    const confirmDisable2FA = async () => {
        try {
            await api.post('/auth/2fa/ disable');
            setIs2FAEnabled(false);
            toast.success('2FA disabled successfully');
        } catch (error) {
            toast.error('Failed to disable 2FA');
        }
    };

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
            await updateProfile(formData);
            toast.success('Profile updated successfully');
            setIsEditing(false);
        } catch (error: any) {
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image must be less than 2MB');
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                setAvatarPreview(reader.result);
            }
        };
        reader.readAsDataURL(file);

        // Upload to server
        setIsUploadingAvatar(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const avatarUrl = res.data?.data?.url || res.data?.url;
            if (!avatarUrl) {
                toast.error('Upload failed: No URL returned');
                setAvatarPreview(null);
                return;
            }

            // Update profile with new avatar URL
            await updateProfile({ avatarUrl });
            toast.success('Profile picture updated successfully');
        } catch (error: any) {
            console.error('Avatar upload error:', error);
            toast.error(error.response?.data?.message || 'Failed to upload image');
            setAvatarPreview(null);
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const getAvatarUrl = () => {
        if (avatarPreview) return avatarPreview;
        if (user.avatarUrl) {
            return user.avatarUrl.startsWith('http')
                ? user.avatarUrl
                : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}${user.avatarUrl}`;
        }
        return `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`;
    };

    return (
        <div className="flex min-h-screen bg-background nebula-gradient">
            <Sidebar />
            <div className="flex-1 flex flex-col ml-72">
                <Navbar />
                <main className="p-8 flex-1 overflow-auto custom-scrollbar">
                    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* ... Header ... */}
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground/80">User Profile</h1>
                            {/* ... Edit Dialog ... */}
                            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                                <DialogTrigger asChild>
                                    <Button onClick={handleEditClick} className="gap-2">
                                        <Pencil className="h-4 w-4" /> Edit Profile
                                    </Button>
                                </DialogTrigger>
                                {/* ... Dialog Content ... */}
                                <DialogContent className="sm:max-w-[425px] glass-card border-white/10">
                                    {/* ... content ... */}
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

                        <Tabs defaultValue="general" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                                <TabsTrigger value="general">General</TabsTrigger>
                                <TabsTrigger value="security">Security</TabsTrigger>
                            </TabsList>
                            <TabsContent value="general" className="space-y-6">
                                {/* Main Profile Card */}
                                <Card className="glass-card border-none overflow-hidden relative">
                                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary/20 to-primary/5"></div>

                                    <CardContent className="pt-20 pb-8 px-8 relative">
                                        <div className="flex flex-col md:flex-row gap-8 items-start">
                                            {/* Avatar Section */}
                                            <div className="flex flex-col items-center space-y-4">
                                                <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                                                    <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                                                        <AvatarImage src={getAvatarUrl()} />
                                                        <AvatarFallback className="text-4xl font-bold bg-primary/10 text-primary">
                                                            {user.firstName?.[0]}{user.lastName?.[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    {isUploadingAvatar && (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full">
                                                            <Loader2 className="h-8 w-8 text-white animate-spin" />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Camera className="h-8 w-8 text-white" />
                                                    </div>
                                                </div>
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleAvatarChange}
                                                />
                                                <p className="text-xs text-muted-foreground text-center">Click to upload photo</p>
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
                            </TabsContent>

                            <TabsContent value="security" className="space-y-6">
                                <Card className="glass-card border-none">
                                    <CardHeader>
                                        <CardTitle>Two-Factor Authentication</CardTitle>
                                        <CardDescription>Add an extra layer of security to your account.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg bg-black/20">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-full ${is2FAEnabled ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                                    <ShieldCheck className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold">{is2FAEnabled ? '2FA is Enabled' : '2FA is Disabled'}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {is2FAEnabled
                                                            ? 'Your account is protected with 2FA.'
                                                            : 'Secure your account by enabling two-factor authentication.'}
                                                    </p>
                                                </div>
                                            </div>
                                            {is2FAEnabled && <Badge variant="default" className="bg-green-600">Active</Badge>}
                                        </div>

                                        {!is2FAEnabled ? (
                                            <div className="flex flex-col gap-2">
                                                <p className="text-sm text-muted-foreground">
                                                    Two-factor authentication adds an additional layer of security to your account by requiring more than just a password to sign in.
                                                </p>
                                                <Button onClick={() => setIs2FAModalOpen(true)} className="w-fit mt-2">
                                                    Enable 2FA
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-2">
                                                <p className="text-sm text-muted-foreground">
                                                    You can disable 2FA at any time, but it is not recommended.
                                                </p>
                                                <Button variant="destructive" onClick={handleDisable2FA} className="w-fit mt-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/50 border">
                                                    Disable 2FA
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card className="glass-card border-none cursor-pointer hover:bg-white/5 transition-colors" onClick={() => setIsPasswordDialogOpen(true)}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Shield className="h-5 w-5 text-primary" />
                                            Change Password
                                        </CardTitle>
                                        <CardDescription>Update your password regularly to keep your account secure.</CardDescription>
                                    </CardHeader>
                                </Card>
                            </TabsContent>
                        </Tabs>

                        {/* Additional Settings / Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Card className="glass-card border-none hover:bg-white/5 transition-colors cursor-pointer group">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-lg">
                                                <User className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                                                Appearance
                                            </CardTitle>
                                            <CardDescription>Theme: <span className="capitalize font-bold text-primary">{theme}</span></CardDescription>
                                        </CardHeader>
                                    </Card>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md glass-card border-white/10">
                                    <DialogHeader>
                                        <DialogTitle>Switch Theme</DialogTitle>
                                        <DialogDescription>
                                            Choose how the interface looks on your device.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid grid-cols-3 gap-4 py-4">
                                        <Button
                                            variant={theme === 'light' ? 'default' : 'outline'}
                                            className={`flex-col h-24 gap-2 ${theme === 'light' ? 'bg-primary' : 'bg-secondary/50'}`}
                                            onClick={() => setTheme('light')}
                                        >
                                            <Sun className="h-6 w-6" />
                                            <span>Light</span>
                                        </Button>
                                        <Button
                                            variant={theme === 'dark' ? 'default' : 'outline'}
                                            className={`flex-col h-24 gap-2 ${theme === 'dark' ? 'bg-primary' : 'bg-secondary/50'}`}
                                            onClick={() => setTheme('dark')}
                                        >
                                            <Moon className="h-6 w-6" />
                                            <span>Dark</span>
                                        </Button>
                                        <Button
                                            variant={theme === 'system' ? 'default' : 'outline'}
                                            className={`flex-col h-24 gap-2 ${theme === 'system' ? 'bg-primary' : 'bg-secondary/50'}`}
                                            onClick={() => setTheme('system')}
                                        >
                                            <Monitor className="h-6 w-6" />
                                            <span>System</span>
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>

                            <Card
                                onClick={() => setIsNotificationDialogOpen(true)}
                                className="glass-card border-none hover:bg-white/5 transition-colors cursor-pointer group"
                            >
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Bell className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                                        Notifications
                                    </CardTitle>
                                    <CardDescription>Configure alerts</CardDescription>
                                </CardHeader>
                            </Card>

                            <Card
                                onClick={() => setIsActivityLogOpen(true)}
                                className="glass-card border-none hover:bg-white/5 transition-colors cursor-pointer group"
                            >
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <ActivityIcon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                                        Activity
                                    </CardTitle>
                                    <CardDescription>View login history</CardDescription>
                                </CardHeader>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
            <ChangePasswordDialog
                open={isPasswordDialogOpen}
                onOpenChange={setIsPasswordDialogOpen}
            />
            <NotificationSettingsDialog
                open={isNotificationDialogOpen}
                onOpenChange={setIsNotificationDialogOpen}
            />
            <ActivityLogDialog
                open={isActivityLogOpen}
                onOpenChange={setIsActivityLogOpen}
            />
            <TwoFactorModal
                isOpen={is2FAModalOpen}
                onClose={() => setIs2FAModalOpen(false)}
                onEnabled={() => {
                    setIs2FAEnabled(true);
                    check2FAStatus();
                }}
            />
            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={confirmDisable2FA}
                title="Disable Two-Factor Authentication"
                description="Are you sure you want to disable 2FA? Your account will be less secure without this extra layer of protection."
                confirmText="Disable 2FA"
            />
        </div>
    );
}

// Helper icons
import { Activity } from 'lucide-react';
