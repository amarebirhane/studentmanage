'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/tables/data-table';
import { studentService } from '@/services/student.service';
import { ColumnDef } from '@tanstack/react-table';
import { StudentProfile } from '@/types/student';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';

export default function StudentsPage() {
    const [students, setStudents] = useState<StudentProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState<string | null>(null);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const data = await studentService.getStudents();
            setStudents(data.data || []);
        } catch (error) {
            toast.error('Failed to fetch students');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleDelete = async (id: string) => {
        setStudentToDelete(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!studentToDelete) return;
        try {
            await studentService.deleteStudent(studentToDelete);
            toast.success('Student deleted successfully');
            fetchStudents();
        } catch (error) {
            toast.error('Failed to delete student');
        } finally {
            setStudentToDelete(null);
        }
    };

    const columns: ColumnDef<StudentProfile>[] = [
        {
            id: 'avatar',
            header: '',
            cell: ({ row }) => {
                const avatarUrl = row.original.avatarUrl;
                const fullAvatarUrl = avatarUrl
                    ? (avatarUrl.startsWith('http') ? avatarUrl : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}${avatarUrl}`)
                    : null;
                return (
                    <Avatar className="h-9 w-9 border border-primary/10">
                        <AvatarImage src={fullAvatarUrl || undefined} className="object-cover" />
                        <AvatarFallback className="bg-primary/5 text-primary text-xs">
                            {row.original.user?.firstName?.[0]}{row.original.user?.lastName?.[0]}
                        </AvatarFallback>
                    </Avatar>
                );
            },
        },
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
        {
            accessorKey: 'enrollmentNo',
            header: 'Enrollment No',
        },
        {
            accessorKey: 'class.name',
            header: 'Class',
            cell: ({ row }) => row.original.class?.name || 'Unassigned',
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const student = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Link href={`/dashboard/admin/students/view/${student.id}`}>
                            <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href={`/dashboard/admin/students/edit/${student.id}`}>
                            <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(student.id)}>
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
                    <h1 className="text-3xl font-bold tracking-tight">Students Management</h1>
                    <p className="text-muted-foreground mt-1">Manage, add and organize student records.</p>
                </div>
                <Link href="/dashboard/admin/students/new">
                    <Button className="shadow-lg shadow-primary/20 gap-2 h-11 px-6">
                        <Plus className="h-5 w-5" /> Enroll New Student
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
                            data={students}
                            searchPlaceholder="Search by name, ID or class..."
                        />
                    )}
                </CardContent>
            </Card>

            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={confirmDelete}
                title="Delete Student"
                description="Are you sure you want to delete this student? This will permanently remove all student records and cannot be undone."
            />
        </div>
    );
}
