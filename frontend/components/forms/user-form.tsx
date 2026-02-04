'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { registerSchema, userManagementSchema } from '@/lib/validation';
import toast from 'react-hot-toast';
import { User, Phone, Mail, Shield, UserPlus, Sparkles, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { userService } from '@/services/user.service';
import { useAuth } from '@/hooks/useAuth';

interface UserFormProps {
    userId?: string;
    initialData?: any;
}

const UserForm = ({ userId, initialData }: UserFormProps) => {
    const router = useRouter();
    const { user: currentUser } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        role: 'STAFF' as any,
        avatarUrl: '',
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                firstName: initialData.firstName || '',
                lastName: initialData.lastName || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                password: '',
                role: initialData.role || 'STAFF',
                avatarUrl: initialData.avatarUrl || '',
            });

            if (initialData.avatarUrl) {
                const fullUrl = initialData.avatarUrl.startsWith('http')
                    ? initialData.avatarUrl
                    : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}${initialData.avatarUrl}`;
                setAvatarPreview(fullUrl);
            }
        }
    }, [initialData]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Image size should be less than 2MB');
                return;
            }
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadAvatar = async () => {
        if (!avatarFile) return null;
        const formData = new FormData();
        formData.append('file', avatarFile);
        try {
            const response = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data.url;
        } catch (error) {
            toast.error('Avatar upload failed');
            return null;
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleRoleChange = (value: string) => {
        setFormData(prev => ({ ...prev, role: value }));
        if (errors['role']) setErrors(prev => ({ ...prev, role: '' }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        let avatarUrl = formData.avatarUrl;
        if (avatarFile) {
            const uploaded = await uploadAvatar();
            if (!uploaded) {
                setLoading(false);
                return;
            }
            avatarUrl = uploaded;
        }

        const submitData = {
            ...formData,
            avatarUrl,
            schoolId: currentUser?.schoolId
        };

        // Remove password if updating
        if (userId) {
            delete (submitData as any).password;
        }

        const schema = userId ? userManagementSchema : registerSchema;
        const result = schema.safeParse(submitData);

        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.errors.forEach(err => {
                const field = err.path[0] as string;
                fieldErrors[field] = err.message;
            });
            setErrors(fieldErrors);
            setLoading(false);
            toast.error('Please fix the errors in the form');
            return;
        }

        try {
            if (userId) {
                await userService.updateUser(userId, submitData as any);
                toast.success('User updated successfully');
            } else {
                await userService.registerUser(submitData);
                toast.success('New staff member registered successfully');
            }
            router.push('/dashboard/admin/users');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card className="glass-card border-none overflow-hidden shadow-xl shadow-black/5">
                        <CardHeader className="bg-primary/5 border-b border-white/5 p-6">
                            <CardTitle className="text-xl flex items-center gap-2 text-primary">
                                <UserPlus className="h-5 w-5" /> Account Details
                            </CardTitle>
                            <CardDescription>Enter the basic information for the new staff member</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider opacity-70">First Name <span className="text-destructive">*</span></Label>
                                <Input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First name" className="bg-white/5 border-white/10 h-11 rounded-xl" />
                                {errors['firstName'] && <p className="text-[10px] text-destructive font-medium">{errors['firstName']}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider opacity-70">Last Name <span className="text-destructive">*</span></Label>
                                <Input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last name" className="bg-white/5 border-white/10 h-11 rounded-xl" />
                                {errors['lastName'] && <p className="text-[10px] text-destructive font-medium">{errors['lastName']}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider opacity-70">Email Address <span className="text-destructive">*</span></Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input name="email" type="email" value={formData.email} onChange={handleChange} className="pl-9 bg-white/5 border-white/10 h-11 rounded-xl" placeholder="email@example.com" />
                                </div>
                                {errors['email'] && <p className="text-[10px] text-destructive font-medium">{errors['email']}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider opacity-70">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input name="phone" value={formData.phone} onChange={handleChange} className="pl-9 bg-white/5 border-white/10 h-11 rounded-xl" placeholder="+1..." />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider opacity-70">System Role <span className="text-destructive">*</span></Label>
                                <Select onValueChange={handleRoleChange} value={formData.role}>
                                    <SelectTrigger className="bg-white/5 border-white/10 h-11 rounded-xl">
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent className="glass border-white/10 rounded-xl">
                                        <SelectItem value="TEACHER">Teacher</SelectItem>
                                        <SelectItem value="ACCOUNTANT">Accountant</SelectItem>
                                        <SelectItem value="STAFF">General Staff</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors['role'] && <p className="text-[10px] text-destructive font-medium">{errors['role']}</p>}
                            </div>
                            {!userId && (
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider opacity-70">Account Password <span className="text-destructive">*</span></Label>
                                    <div className="relative">
                                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Min. 6 characters" className="pl-9 bg-white/5 border-white/10 h-11 rounded-xl" />
                                    </div>
                                    {errors['password'] && <p className="text-[10px] text-destructive font-medium">{errors['password']}</p>}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card className="glass-card border-none overflow-hidden shadow-xl shadow-black/5">
                        <CardHeader className="bg-primary/5 border-b border-white/5 p-6">
                            <CardTitle className="text-xl flex items-center gap-2 text-primary">
                                <Sparkles className="h-5 w-5" /> Appearance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 flex flex-col items-center gap-6">
                            <div className="relative group">
                                <div className="h-40 w-40 rounded-3xl bg-secondary/50 flex items-center justify-center border-4 border-background shadow-2xl overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:rotate-1">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Preview" className="h-full w-full object-cover" />
                                    ) : (
                                        <User className="h-16 w-16 text-muted-foreground opacity-20" />
                                    )}
                                </div>
                                <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer rounded-3xl scale-95 group-hover:scale-100 backdrop-blur-sm">
                                    <Sparkles className="h-6 w-6 text-white mb-2" />
                                    <span className="text-white text-[10px] font-bold uppercase tracking-[0.2em]">Upload Image</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                </label>
                            </div>
                            <div className="text-center space-y-1">
                                <p className="text-xs font-semibold text-muted-foreground">Profile Picture</p>
                                <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest leading-relaxed">
                                    Max size: 2MB<br />Square image (1:1) preferred
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col gap-3">
                        <Button type="submit" className="h-14 shadow-2xl shadow-primary/30 bg-primary font-bold tracking-tight rounded-2xl group" disabled={loading}>
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Registering...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    {userId ? 'Update User Information' : 'Register Member'}
                                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </Button>
                        <Button type="button" variant="ghost" className="h-12 hover:bg-white/5 rounded-xl font-medium" onClick={() => router.push('/dashboard/admin/users')}>
                            Discard Changes
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default UserForm;
