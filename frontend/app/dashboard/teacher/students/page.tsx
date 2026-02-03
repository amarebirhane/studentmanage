'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/tables/data-table';
import { studentService } from '@/services/student.service';
import { ColumnDef } from '@tanstack/react-table';
import { User, Phone, Mail, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TeacherStudentsPage() {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                // For teachers, we fetch all students for now, 
                // but in a real app, the backend should limit this to their assigned sections.
                const response = await studentService.getStudents();
                setStudents(response.data || []);
            } catch (error) {
                toast.error('Failed to fetch students');
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

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
        {
            accessorKey: 'enrollmentNo',
            header: 'Enrollment No',
            cell: ({ row }) => <span className="font-mono">{row.original.enrollmentNo}</span>,
        },
        {
            accessorKey: 'class.name',
            header: 'Class',
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium">{row.original.class?.name}</span>
                    <span className="text-[10px] text-muted-foreground">{row.original.section?.name}</span>
                </div>
            ),
        },
        {
            id: 'contact',
            header: 'Contact',
            cell: ({ row }) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs">
                        <Mail className="h-3 w-3" /> {row.original.user?.email}
                    </div>
                    {row.original.user?.phone && (
                        <div className="flex items-center gap-2 text-xs">
                            <Phone className="h-3 w-3" /> {row.original.user?.phone}
                        </div>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Students</h1>
                <p className="text-muted-foreground mt-1">View personal and academic details of your students.</p>
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
                            searchPlaceholder="Search students..."
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
