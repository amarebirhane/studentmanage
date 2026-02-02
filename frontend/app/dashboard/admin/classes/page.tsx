'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/tables/data-table';
import { classService } from '@/services/class.service';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ClassesPage() {
    const [classes, setClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const data = await classService.getClasses();
            setClasses(data || []);
        } catch (error) {
            toast.error('Failed to fetch classes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this class?')) {
            try {
                await classService.deleteClass(id);
                toast.success('Class deleted successfully');
                fetchClasses();
            } catch (error) {
                toast.error('Failed to delete class');
            }
        }
    };

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: 'name',
            header: 'Class Name',
        },
        {
            accessorKey: 'description',
            header: 'Description',
        },
        {
            accessorKey: '_count.students',
            header: 'Enrolled Students',
            cell: ({ row }) => row.original._count?.students || 0,
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const cls = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Link href={`/dashboard/admin/classes/edit/${cls.id}`}>
                            <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(cls.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Classes Management</h1>
                    <p className="text-muted-foreground mt-1">Define grade levels and curriculum tracks.</p>
                </div>
                <Link href="/dashboard/admin/classes/new">
                    <Button className="shadow-lg shadow-primary/20 gap-2 h-11 px-6">
                        <Plus className="h-5 w-5" /> Add New Class
                    </Button>
                </Link>
            </div>

            <Card className="glass-card border-none">
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={classes}
                            searchPlaceholder="Search classes..."
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
