'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import TeacherForm from '@/components/forms/teacher-form';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { teacherService } from '@/services/teacher.service';
import toast from 'react-hot-toast';

export default function EditTeacherPage() {
    const params = useParams();
    const id = params.id as string;
    const [teacher, setTeacher] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeacher = async () => {
            try {
                const data = await teacherService.getTeacherById(id);
                setTeacher(data);
            } catch (error) {
                toast.error('Failed to fetch teacher details');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchTeacher();
    }, [id]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/admin/teachers">
                    <Button variant="ghost" size="sm">
                        <ChevronLeft className="h-4 w-4 mr-2" /> Back
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Edit Teacher</h1>
            </div>
            <TeacherForm teacherId={id} initialData={teacher} />
        </div>
    );
}
