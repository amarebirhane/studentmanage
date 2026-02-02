'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ClassForm from '@/components/forms/class-form';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { classService } from '@/services/class.service';
import toast from 'react-hot-toast';

export default function EditClassPage() {
    const params = useParams();
    const id = params.id as string;
    const [classData, setClassData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClass = async () => {
            try {
                const data = await classService.getClassById(id);
                setClassData(data);
            } catch (error) {
                toast.error('Failed to fetch class details');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchClass();
    }, [id]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/admin/classes">
                    <Button variant="ghost" size="sm">
                        <ChevronLeft className="h-4 w-4 mr-2" /> Back
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Edit Class</h1>
            </div>
            <ClassForm classId={id} initialData={classData} />
        </div>
    );
}
