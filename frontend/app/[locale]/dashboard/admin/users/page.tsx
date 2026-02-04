'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Shield, UserCog, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/tables/data-table';
import { userService } from '@/services/user.service';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await userService.getUsers();
            // Filter to show only staff-like roles (Teacher, Accountant, Staff)
            // School admin can see everyone except maybe other high-level admins if restricted
            const filtered = data.filter(u => ['TEACHER', 'ACCOUNTANT', 'STAFF'].includes(u.role));
            setUsers(filtered || []);
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id: string) => {
        setUserToDelete(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;
        try {
            await userService.deleteUser(userToDelete);
            toast.success('User deleted successfully');
            fetchUsers();
        } catch (error) {
            toast.error('Failed to delete user');
        } finally {
            setUserToDelete(null);
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return <Badge className="bg-red-500/10 text-red-600 border-red-200 hover:bg-red-500/20">Admin</Badge>;
            case 'TEACHER':
                return <Badge className="bg-blue-500/10 text-blue-600 border-blue-200 hover:bg-blue-500/20">Teacher</Badge>;
            case 'ACCOUNTANT':
                return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 hover:bg-emerald-500/20">Accountant</Badge>;
            case 'STAFF':
                return <Badge className="bg-orange-500/10 text-orange-600 border-orange-200 hover:bg-orange-500/20">Staff</Badge>;
            default:
                return <Badge variant="outline">{role}</Badge>;
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
                        <AvatarFallback className="bg-primary/5 text-primary text-xs uppercase font-bold">
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
            cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.original.email}</span>,
        },
        {
            accessorKey: 'role',
            header: 'Role',
            cell: ({ row }) => getRoleBadge(row.original.role),
        },
        {
            accessorKey: 'phone',
            header: 'Phone',
            cell: ({ row }) => <span className="text-xs">{row.original.phone || 'N/A'}</span>,
        },
        {
            accessorKey: 'createdAt',
            header: 'Joined',
            cell: ({ row }) => <span className="text-[10px] text-muted-foreground">{new Date(row.original.createdAt).toLocaleDateString()}</span>,
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Link href={`/dashboard/admin/users/edit/${user.id}`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Edit className="h-4 w-4 text-blue-600" />
                            </Button>
                        </Link>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDelete(user.id)}>
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
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-2xl">
                        <UserCog className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                        <p className="text-muted-foreground mt-1">Manage school staff, accountants and teachers.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/admin/users/new">
                        <Button className="shadow-lg shadow-primary/20 gap-2 h-11 px-6 rounded-xl">
                            <Plus className="h-5 w-5" /> Register New Staff
                        </Button>
                    </Link>
                </div>
            </div>

            <Card className="glass-card border-none overflow-hidden rounded-2xl">
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 gap-3">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                            <p className="text-sm text-muted-foreground animate-pulse">Loading system users...</p>
                        </div>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={users}
                            searchPlaceholder="Search by name, email or role..."
                        />
                    )}
                </CardContent>
            </Card>

            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={confirmDelete}
                title="Delete User"
                description="Are you sure you want to delete this user? This will remove their account and all associated data."
            />
        </div>
    );
}
