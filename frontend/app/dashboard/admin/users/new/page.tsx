'use client';

import UserForm from '@/components/forms/user-form';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ShieldPlus } from 'lucide-react';
import Link from 'next/link';

export default function NewUserPage() {
    return (
        <div className="p-6 space-y-8 max-w-6xl mx-auto">
            <div className="flex items-center gap-6 animate-in fade-in slide-in-from-left-4 duration-500">
                <Link href="/dashboard/admin/users">
                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl hover:bg-white/5 border-white/10 shadow-lg group">
                        <ChevronLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
                    </Button>
                </Link>
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-2xl">
                        <ShieldPlus className="h-6 w-6 text-primary" />
                    </div>
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Register System Member</h1>
                    <p className="text-muted-foreground mt-1 font-medium italic opacity-80">Onboard a new staff member, accountant or teacher to the school platform.</p>
                </div>
            </div>

            <UserForm />
        </div>
    );
}
