'use client';

import TeacherForm from '@/components/forms/teacher-form';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewTeacherPage() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/admin/teachers">
                    <Button variant="ghost" size="sm">
                        <ChevronLeft className="h-4 w-4 mr-2" /> Back
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Add Teacher</h1>
            </div>
            <TeacherForm />
        </div>
    );
}
