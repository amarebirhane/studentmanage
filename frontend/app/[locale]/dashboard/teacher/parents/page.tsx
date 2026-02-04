'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/tables/data-table';
import { parentService } from '@/services/parent.service';
import { ColumnDef } from '@tanstack/react-table';
import { User, Phone, Mail, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { Badge } from '@/components/ui/badge';

export default function TeacherParentsPage() {
    const [parents, setParents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchParents = async () => {
            try {
                const response = await parentService.getParents();
                setParents(response || []);
            } catch (error) {
                toast.error('Failed to fetch parents');
            } finally {
                setLoading(false);
            }
        };

        fetchParents();
    }, []);

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: 'firstName',
            header: 'Parent Name',
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                        {row.original.firstName?.[0]}
                    </div>
                    <span className="font-medium">{row.original.firstName} {row.original.lastName}</span>
                </div>
            ),
        },
        {
            id: 'children',
            header: 'Children',
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-1">
                    {row.original.parentProfiles?.map((profile: any, idx: number) => (
                        <Badge key={idx} variant="secondary" className="bg-primary/5 text-primary border-none text-xs">
                            {profile.student?.user?.firstName} {profile.student?.user?.lastName}
                        </Badge>
                    ))}
                </div>
            )
        },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: ({ row }) => (
                <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">{row.original.email}</span>
                </div>
            )
        },
        {
            accessorKey: 'phone',
            header: 'Phone',
            cell: ({ row }) => (
                <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground font-mono">{row.original.phone || 'N/A'}</span>
                </div>
            )
        }
    ];

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Parents Directory</h1>
                <p className="text-muted-foreground mt-1">Contact information for parents of students in your classes.</p>
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
                            data={parents}
                            searchPlaceholder="Search parents..."
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
