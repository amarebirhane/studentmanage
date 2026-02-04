'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/tables/data-table';
import { parentService } from '@/services/parent.service';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import toast from 'react-hot-toast';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ParentsPage() {
    const [parents, setParents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchParents = async () => {
        try {
            setLoading(true);
            const data = await parentService.getParents();
            setParents(data || []);
        } catch (error) {
            toast.error('Failed to fetch parents');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchParents();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this parent?')) {
            try {
                await parentService.deleteParent(id);
                toast.success('Parent deleted successfully');
                fetchParents();
            } catch (error) {
                toast.error('Failed to delete parent');
            }
        }
    };

    const columns: ColumnDef<any>[] = [
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
                            {row.original.firstName?.[0]}{row.original.lastName?.[0]}
                        </AvatarFallback>
                    </Avatar>
                );
            },
        },
        {
            accessorKey: 'firstName',
            header: 'First Name',
        },
        {
            accessorKey: 'lastName',
            header: 'Last Name',
        },
        {
            accessorKey: 'email',
            header: 'Email',
        },
        {
            accessorKey: 'phone',
            header: 'Phone',
            cell: ({ row }) => row.original.phone || 'N/A',
        },
        {
            id: 'students',
            header: 'Linked Students',
            cell: ({ row }) => {
                const profiles = row.original.parentProfiles || [];
                return (
                    <div className="flex flex-wrap gap-1">
                        {profiles.length > 0 ? (
                            profiles.map((p: any) => (
                                <span key={p.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                                    {p.student?.user?.firstName} {p.student?.user?.lastName}
                                </span>
                            ))
                        ) : (
                            <span className="text-muted-foreground text-xs italic">No students linked</span>
                        )}
                    </div>
                );
            },
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const parent = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Link href={`/dashboard/admin/parents/view/${parent.id}`}>
                            <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href={`/dashboard/admin/parents/edit/${parent.id}`}>
                            <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(parent.id)}>
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
                    <h1 className="text-3xl font-bold tracking-tight">Parents Management</h1>
                    <p className="text-muted-foreground mt-1">Manage parent accounts and student associations.</p>
                </div>
                <Link href="/dashboard/admin/parents/new">
                    <Button className="shadow-lg shadow-primary/20 gap-2 h-11 px-6">
                        <UserPlus className="h-5 w-5" /> Add New Parent
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
                            data={parents}
                            searchPlaceholder="Search parents by name or email..."
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}