'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Search, Building2, MoreVertical, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { schoolService, School } from '@/services/school.service';
import Link from 'next/link';

export default function SchoolListPage() {
    const [schools, setSchools] = useState<School[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchSchools = async () => {
            try {
                const data = await schoolService.getAllSchools();
                setSchools(data || []);
            } catch (error) {
                console.error('Failed to fetch schools', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSchools();
    }, []);

    const filteredSchools = schools.filter(school =>
        school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Schools</h1>
                    <p className="text-muted-foreground mt-1">Manage all tenant schools in the platform.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/super-admin/schools/new">
                        <Button className="h-11 shadow-lg shadow-primary/20">
                            <Plus className="h-4 w-4 mr-2" /> Register New School
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search schools..."
                        className="pl-9 h-11"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Card className="glass-card border-none">
                <CardContent className="p-0">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Domain / Slug</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Created At</th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="h-24 text-center">
                                            <div className="flex justify-center items-center">
                                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredSchools.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="h-24 text-center text-muted-foreground">
                                            No schools found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredSchools.map((school) => (
                                        <tr key={school.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                        {school.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold">{school.name}</div>
                                                        <div className="text-xs text-muted-foreground hidden md:block">{school.email || 'No email'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="font-medium text-xs bg-secondary/50 px-2 py-1 rounded-md inline-block">
                                                    {school.slug}
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Badge variant={school.isSuspended ? "destructive" : "default"} className={!school.isSuspended ? "bg-green-600 hover:bg-green-700" : ""}>
                                                    {school.isSuspended ? 'Suspended' : 'Active'}
                                                </Badge>
                                            </td>
                                            <td className="p-4 align-middle text-muted-foreground">
                                                {new Date(school.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                                        <DropdownMenuItem>Manage Subscription</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600">
                                                            {school.isSuspended ? 'Activate School' : 'Suspend School'}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
