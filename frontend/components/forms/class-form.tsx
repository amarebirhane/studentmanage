'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { classService } from '@/services/class.service';
import toast from 'react-hot-toast';

interface ClassFormProps {
    classId?: string;
    initialData?: any;
}

const ClassForm = ({ classId, initialData }: ClassFormProps) => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        grade: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                grade: initialData.grade || '',
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (classId) {
                await classService.updateClass(classId, formData);
                toast.success('Class updated successfully');
            } else {
                await classService.createClass(formData);
                toast.success('Class created successfully');
            }
            router.push('/dashboard/admin/classes');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="glass-card max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>{classId ? 'Edit Class' : 'Class Information'}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label>Class Name (e.g. Grade 10-A)</Label>
                        <Input name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label>Grade/Level</Label>
                        <Input name="grade" value={formData.grade} onChange={handleChange} required />
                    </div>
                    <Button type="submit" className="w-full h-11" disabled={loading}>
                        {loading ? 'Processing...' : classId ? 'Update Class' : 'Create Class'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default ClassForm;
