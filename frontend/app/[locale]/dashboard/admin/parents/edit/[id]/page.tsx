'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ParentForm from '@/components/forms/parent-form';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { parentService } from '@/services/parent.service';
import toast from 'react-hot-toast';

export default function EditParentPage() {
    const params = useParams();
    const id = params.id as string;
    const [parent, setParent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchParent = async () => {
            try {
                const data = await parentService.getParentById(id);
                setParent(data);
            } catch (error) {
                toast.error('Failed to fetch parent details');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchParent();
    }, [id]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/admin/parents">
                    <Button variant="ghost" size="sm" className="hover:bg-primary/10 transition-all">
                        <ChevronLeft className="h-4 w-4 mr-2" /> Back
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Parent Account</h1>
                    <p className="text-muted-foreground mt-1">Modify parent record and update student associations.</p>
                </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <ParentForm parentId={id} initialData={parent} />
            </div>
        </div>
    );
}
