'use client';

import { useEffect, useState } from 'react';
import StudentForm from '@/components/forms/student-form';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { studentService } from '@/services/student.service';
import toast from 'react-hot-toast';

export default function EditStudentPage() {
    const params = useParams();
    const id = params.id as string;
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const data = await studentService.getStudentById(id);
                setStudent(data);
            } catch (error) {
                toast.error('Failed to fetch student details');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchStudent();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/admin/students">
                    <Button variant="ghost" size="sm">
                        <ChevronLeft className="h-4 w-4 mr-2" /> Back
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Student</h1>
                    <p className="text-muted-foreground mt-1">Update record for {student?.user?.firstName} {student?.user?.lastName}.</p>
                </div>
            </div>

            <StudentForm studentId={id} initialData={student} />
        </div>
    );
}
