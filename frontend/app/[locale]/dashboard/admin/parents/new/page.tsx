'use client';

import ParentForm from '@/components/forms/parent-form';
import { Button } from '@/components/ui/button';
import { ChevronLeft, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function NewParentPage() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/admin/parents">
                    <Button variant="ghost" size="sm" className="hover:bg-primary/10 transition-all">
                        <ChevronLeft className="h-4 w-4 mr-2" /> Back
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Add New Parent</h1>
                    <p className="text-muted-foreground mt-1">Register a new parent account and link them to students.</p>
                </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <ParentForm />
            </div>
        </div>
    );
}
