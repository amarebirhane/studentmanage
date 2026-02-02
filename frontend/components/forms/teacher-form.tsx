'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import toast from 'react-hot-toast';
import { Upload, User, Phone, Mail, Hash, BookOpen } from 'lucide-react';

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
    });

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

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
            });
            if (profile.avatarUrl) {
                setAvatarPreview(profile.avatarUrl.startsWith('http') ? profile.avatarUrl : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}${profile.avatarUrl}`);
            }
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { experience, ...rest } = formData;
            const submitData = {
                ...rest,
                experience: experience ? parseInt(experience) : 0
            };

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
                                <Label>First Name</Label>
                                <Input name="firstName" value={formData.firstName} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label>Last Name</Label>
                                <Input name="lastName" value={formData.lastName} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input name="email" value={formData.email} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone</Label>
                                <Input name="phone" value={formData.phone} onChange={handleChange} />
                            </div>
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
                            <CardTitle className="text-xl">Employment</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Employee ID</Label>
                                <Input name="employeeId" value={formData.employeeId} onChange={handleChange} />
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
