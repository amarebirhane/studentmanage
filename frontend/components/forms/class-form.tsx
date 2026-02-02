'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { classService } from '@/services/class.service';
import toast from 'react-hot-toast';

const ClassForm = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        grade: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await classService.createClass(formData);
            toast.success('Class created successfully');
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
                <CardTitle>Class Information</CardTitle>
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
                        {loading ? 'Creating...' : 'Create Class'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default ClassForm;
