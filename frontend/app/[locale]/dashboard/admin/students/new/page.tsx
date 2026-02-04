'use client';

import StudentForm from '@/components/forms/student-form';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewStudentPage() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/admin/students">
                    <Button variant="ghost" size="sm">
                        <ChevronLeft className="h-4 w-4 mr-2" /> Back
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Enroll Student</h1>
                    <p className="text-muted-foreground mt-1">Create a new student profile and academic record.</p>
                </div>
            </div>

            <StudentForm />
        </div>
    );
}
