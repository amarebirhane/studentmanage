'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { teacherSchema, updateTeacherSchema } from '@/lib/validation';
import toast from 'react-hot-toast';
import { Upload, User, Phone, Mail, Hash, BookOpen, Eye, EyeOff, Lock, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TeacherFormProps {
    teacherId?: string;
    initialData?: any;
}

const TeacherForm = ({ teacherId, initialData }: TeacherFormProps) => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        employeeId: '',
        specialization: '',
        qualification: '',
        experience: '',
        joiningDate: '',
        avatarUrl: null,
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (initialData) {
            const { user, ...profile } = initialData;
            setFormData({
                firstName: user?.firstName || '',
                lastName: user?.lastName || '',
                email: user?.email || '',
                phone: user?.phone || '',
                employeeId: profile.employeeId || '',
                specialization: profile.specialization || '',
                qualification: profile.qualification || '',
                experience: profile.experience?.toString() || '',
                joiningDate: profile.joiningDate ? new Date(profile.joiningDate).toISOString().split('T')[0] : '',
                avatarUrl: profile.avatarUrl || null,
                password: '',
            });
            if (profile.avatarUrl) {
                setAvatarPreview(profile.avatarUrl.startsWith('http') ? profile.avatarUrl : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}${profile.avatarUrl}`);
            }
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Image size should be less than 2MB');
                return;
            }
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    setAvatarPreview(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadAvatar = async () => {
        if (!avatarFile) return formData.avatarUrl;
        const data = new FormData();
        data.append('file', avatarFile);
        try {
            const res = await api.post('/upload', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const avatarUrl = res.data?.data?.url || res.data?.url;
            return avatarUrl;
        } catch (error) {
            toast.error('Avatar upload failed');
            return formData.avatarUrl;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const avatarUrl = await uploadAvatar();
            const { experience, ...rest } = formData;
            const submitData = {
                ...rest,
                experience: experience ? parseInt(experience) : 0,
                avatarUrl
            };

            const schema = teacherId ? updateTeacherSchema : teacherSchema;
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

            if (teacherId) {
                await api.put(`/teachers/${teacherId}`, submitData);
                toast.success('Teacher record updated');
            } else {
                await api.post('/teachers', submitData);
                toast.success('New teacher added successfully');
            }
            router.push('/dashboard/admin/teachers');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" /> Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>First Name <span className="text-destructive">*</span></Label>
                                <Input name="firstName" value={formData.firstName} onChange={handleChange} />
                                {errors['firstName'] && <p className="text-xs text-destructive">{errors['firstName']}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Last Name <span className="text-destructive">*</span></Label>
                                <Input name="lastName" value={formData.lastName} onChange={handleChange} />
                                {errors['lastName'] && <p className="text-xs text-destructive">{errors['lastName']}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Email <span className="text-destructive">*</span></Label>
                                <Input name="email" value={formData.email} onChange={handleChange} />
                                {errors['email'] && <p className="text-xs text-destructive">{errors['email']}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Phone</Label>
                                <Input name="phone" value={formData.phone} onChange={handleChange} />
                            </div>
                            {!teacherId && (
                                <div className="space-y-2">
                                    <Label>Initial Password</Label>
                                    <div className="relative">
                                        <Input
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Leave empty for default: Teacher@123"
                                            className="pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {errors['password'] && <p className="text-xs text-destructive">{errors['password']}</p>}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-primary" /> Professional Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Specialization</Label>
                                <Input name="specialization" value={formData.specialization} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label>Qualification</Label>
                                <Input name="qualification" value={formData.qualification} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label>Experience (Years)</Label>
                                <Input name="experience" type="number" value={formData.experience} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label>Joining Date</Label>
                                <Input name="joiningDate" type="date" value={formData.joiningDate} onChange={handleChange} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary" /> Photo
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center space-y-4">
                            <div className="relative group">
                                <Avatar className="h-32 w-32 border-4 border-background shadow-xl rounded-2xl overflow-hidden">
                                    <AvatarImage src={avatarPreview || undefined} className="object-cover" />
                                    <AvatarFallback className="bg-secondary">
                                        <User className="h-12 w-12 text-muted-foreground/50" />
                                    </AvatarFallback>
                                </Avatar>
                                <Label htmlFor="avatar-upload" className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                                    <Upload className="h-6 w-6" />
                                </Label>
                                <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                            </div>
                            <p className="text-[10px] text-muted-foreground text-center uppercase tracking-widest font-bold opacity-60">Recommended: 400x400 JPG/PNG</p>
                        </CardContent>
                    </Card>

                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="text-xl">Employment</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Employee ID <span className="text-destructive">*</span></Label>
                                <Input name="employeeId" value={formData.employeeId} onChange={handleChange} />
                                {errors['employeeId'] && <p className="text-xs text-destructive">{errors['employeeId']}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <Button type="submit" className="w-full h-12" disabled={loading}>
                        {loading ? 'Processing...' : teacherId ? 'Update Teacher' : 'Add Teacher'}
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default TeacherForm;
