'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { parentSchema, updateParentSchema } from '@/lib/validation';
import toast from 'react-hot-toast';
import { User, Phone, Mail, Shield, Users, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { parentService } from '@/services/parent.service';
import { studentService } from '@/services/student.service';

interface ParentFormProps {
    parentId?: string;
    initialData?: any;
}

const ParentForm = ({ parentId, initialData }: ParentFormProps) => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        relationship: 'Parent',
        studentIds: [] as string[],
        avatarUrl: '',
    });

    const [allStudents, setAllStudents] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await studentService.getStudents({ limit: 100 });
            setAllStudents(res.data || []);
        } catch (error) {
            console.error('Failed to fetch students');
        }
    };

    useEffect(() => {
        if (initialData) {
            setFormData({
                firstName: initialData.firstName || '',
                lastName: initialData.lastName || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                password: '', // Don't populate password
                relationship: initialData.parentProfiles?.[0]?.relationship || 'Parent',
                studentIds: initialData.parentProfiles?.map((p: any) => p.studentId) || [],
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

    const toggleStudent = (studentId: string) => {
        setFormData(prev => {
            const isSelected = prev.studentIds.includes(studentId);
            if (isSelected) {
                return { ...prev, studentIds: prev.studentIds.filter(id => id !== studentId) };
            } else {
                return { ...prev, studentIds: [...prev.studentIds, studentId] };
            }
        });
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

        const submitData = { ...formData, avatarUrl };

        const schema = parentId ? updateParentSchema : parentSchema;
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
            if (parentId) {
                await parentService.updateParent(parentId, submitData);
                toast.success('Parent record updated');
            } else {
                await parentService.createParent(submitData);
                toast.success('New parent account created successfully');
            }
            router.push('/dashboard/admin/parents');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = allStudents.filter(s =>
        `${s.user?.firstName} ${s.user?.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.enrollmentNo?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-8 pb-12 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card className="glass-card border-none overflow-hidden">
                        <CardHeader className="bg-primary/5 border-b border-white/5">
                            <CardTitle className="text-xl flex items-center gap-2 text-primary">
                                <User className="h-5 w-5" /> Account Information
                            </CardTitle>
                            <CardDescription>Primary account details for the parent</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 tracking-tight">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider opacity-70">First Name <span className="text-destructive">*</span></Label>
                                <Input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First name" className="bg-white/5 border-white/10" />
                                {errors['firstName'] && <p className="text-xs text-destructive">{errors['firstName']}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider opacity-70">Last Name <span className="text-destructive">*</span></Label>
                                <Input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last name" className="bg-white/5 border-white/10" />
                                {errors['lastName'] && <p className="text-xs text-destructive">{errors['lastName']}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider opacity-70">Email Address <span className="text-destructive">*</span></Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input name="email" type="email" value={formData.email} onChange={handleChange} className="pl-9 bg-white/5 border-white/10" placeholder="email@example.com" />
                                </div>
                                {errors['email'] && <p className="text-xs text-destructive">{errors['email']}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider opacity-70">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input name="phone" value={formData.phone} onChange={handleChange} className="pl-9 bg-white/5 border-white/10" placeholder="+1..." />
                                </div>
                            </div>
                            {!parentId && (
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider opacity-70">Password <span className="text-destructive">*</span></Label>
                                    <Input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Minimum 6 characters" className="bg-white/5 border-white/10" />
                                    {errors['password'] && <p className="text-xs text-destructive">{errors['password']}</p>}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="glass-card border-none overflow-hidden">
                        <CardHeader className="bg-primary/5 border-b border-white/5">
                            <CardTitle className="text-xl flex items-center gap-2 text-primary">
                                <Users className="h-5 w-5" /> Associated Students
                            </CardTitle>
                            <CardDescription>Link this parent account to one or more students</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search students by name or enrollment ID..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 bg-white/5 border-white/10"
                                />
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {formData.studentIds.map(id => {
                                    const student = allStudents.find(s => s.id === id);
                                    if (!student) return null;
                                    return (
                                        <div key={id} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-bold animate-in zoom-in duration-200">
                                            {student.user?.firstName} {student.user?.lastName}
                                            <button type="button" onClick={() => toggleStudent(id)} className="hover:text-white transition-colors">
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map(student => (
                                        <div
                                            key={student.id}
                                            onClick={() => toggleStudent(student.id)}
                                            className={cn(
                                                "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer",
                                                formData.studentIds.includes(student.id)
                                                    ? "bg-primary/10 border-primary/50 shadow-md ring-1 ring-primary/20"
                                                    : "bg-white/5 border-white/5 hover:border-white/20"
                                            )}
                                        >
                                            <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                                                <span className="text-[10px] font-bold">{student.user?.firstName?.[0]}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold truncate tracking-tight">{student.user?.firstName} {student.user?.lastName}</p>
                                                <p className="text-[10px] text-muted-foreground">{student.class?.name || 'Unassigned'}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-2 text-center py-10 opacity-50 italic text-sm">No students found</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card className="glass-card border-none overflow-hidden">
                        <CardHeader className="bg-primary/5 border-b border-white/5">
                            <CardTitle className="text-xl flex items-center gap-2 text-primary">
                                <Sparkles className="h-5 w-5" /> Profile Image
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 flex flex-col items-center gap-4">
                            <div className="relative group">
                                <div className="h-32 w-32 rounded-2xl bg-secondary flex items-center justify-center border-4 border-background shadow-xl overflow-hidden">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Preview" className="h-full w-full object-cover" />
                                    ) : (
                                        <User className="h-12 w-12 text-muted-foreground opacity-20" />
                                    )}
                                </div>
                                <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl">
                                    <span className="text-white text-xs font-bold uppercase tracking-widest">Change</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                </label>
                            </div>
                            <p className="text-[10px] text-muted-foreground text-center uppercase tracking-widest opacity-60">
                                Recommended: 400x400 JPG or PNG
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="glass-card border-none overflow-hidden">
                        <CardHeader className="bg-primary/5 border-b border-white/5">
                            <CardTitle className="text-xl flex items-center gap-2 text-primary">
                                <Shield className="h-5 w-5" /> Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider opacity-70">Relationship</Label>
                                <Input name="relationship" value={formData.relationship} onChange={handleChange} placeholder="Father, Mother, Legal Guardian..." className="bg-white/5 border-white/10" />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col gap-3 pt-4">
                        <Button type="submit" className="h-12 shadow-xl shadow-primary/20 bg-primary font-bold tracking-tight" disabled={loading}>
                            {loading ? 'Saving Changes...' : parentId ? 'Update Record' : 'Create Account'}
                        </Button>
                        <Button type="button" variant="ghost" className="h-12 hover:bg-white/5" onClick={() => router.push('/dashboard/admin/parents')}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default ParentForm;
