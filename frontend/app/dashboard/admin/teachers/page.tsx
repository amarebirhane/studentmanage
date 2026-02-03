'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/tables/data-table';
import { teacherService } from '@/services/teacher.service';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function TeachersPage() {
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTeachers = async () => {
        try {
            setLoading(true);
            const data = await teacherService.getTeachers();
            setTeachers(data || []);
        } catch (error) {
            toast.error('Failed to fetch teachers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this teacher?')) {
            try {
                await teacherService.deleteTeacher(id);
                toast.success('Teacher deleted successfully');
                fetchTeachers();
            } catch (error) {
                toast.error('Failed to delete teacher');
            }
        }
    };

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: 'user.firstName',
            header: 'First Name',
            cell: ({ row }) => row.original.user?.firstName,
        },
        {
            accessorKey: 'user.lastName',
            header: 'Last Name',
            cell: ({ row }) => row.original.user?.lastName,
        },
        // {
        //     accessorKey: 'employeeId',
        //     header: 'Emp ID',
        //     cell: ({ row }) => <span className="font-mono font-bold text-xs uppercase">{row.original.employeeId || 'N/A'}</span>,
        // },
        {
            accessorKey: 'joiningDate',
            header: 'Joined',
            cell: ({ row }) => <span className="text-xs">{row.original.joiningDate ? new Date(row.original.joiningDate).toLocaleDateString() : 'N/A'}</span>,
        },
        {
            accessorKey: 'specialization',
            header: 'Specialization',
            cell: ({ row }) => <span className="text-xs font-semibold text-primary">{row.original.specialization || 'N/A'}</span>,
        },
        // {
        //     accessorKey: 'qualification',
        //     header: 'Qualification',
        //     cell: ({ row }) => <span className="text-xs">{row.original.qualification || 'N/A'}</span>,
        // },
        {
            header: 'Assignments',
            cell: ({ row }) => {
                const teacher = row.original;
                const subjectsCount = teacher._count?.subjects || 0;
                const sectionsCount = teacher._count?.sections || 0;
                return (
                    <div className="flex flex-col gap-1">
                        <div className="text-xs font-medium">{subjectsCount} Subjects</div>
                        <div className="text-[10px] text-muted-foreground">{sectionsCount} Sections managed</div>
                    </div>
                );
            }
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const teacher = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Link href={`/dashboard/admin/teachers/view/${teacher.id}`}>
                            <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href={`/dashboard/admin/teachers/edit/${teacher.id}`}>
                            <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(teacher.id)}>
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
                    <h1 className="text-3xl font-bold tracking-tight">Teachers Management</h1>
                    <p className="text-muted-foreground mt-1">Manage staff, specializations and profiles.</p>
                </div>
                <Link href="/dashboard/admin/teachers/new">
                    <Button className="shadow-lg shadow-primary/20 gap-2 h-11 px-6">
                        <Plus className="h-5 w-5" /> Add New Teacher
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
                            data={teachers}
                            searchPlaceholder="Search teachers..."
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
