'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, User, Phone, Mail, MapPin, Calendar, Hash, Users, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { parentService } from '@/services/parent.service';
import toast from 'react-hot-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ViewParentPage() {
    const params = useParams();
    const id = params.id as string;
    const [parent, setParent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const getFullAvatarUrl = (url: string | null | undefined) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const baseUrl = apiUrl.replace('/api/v1', '');
        return `${baseUrl}${url}`;
    };

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

    if (!parent) return (
        <div className="p-8 text-center text-destructive font-bold bg-destructive/5 rounded-2xl border border-destructive/10">
            Parent not found
        </div>
    );

    return (
        <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/admin/parents">
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary transition-all">
                            <ChevronLeft className="h-4 w-4 mr-2" /> Back
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Parent Profile</h1>
                        <p className="text-muted-foreground text-sm">Account details and linked student records.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link href={`/dashboard/admin/parents/edit/${id}`}>
                        <Button className="shadow-lg shadow-primary/20 bg-primary hover:scale-105 transition-all">
                            Edit Record
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <Card className="lg:col-span-1 glass-card border-none overflow-hidden hover:shadow-2xl transition-all duration-500">
                    <div className="h-32 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                            <Sparkles className="h-20 w-20 text-primary" />
                        </div>
                        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                            <Avatar className="h-24 w-24 rounded-2xl border-4 border-background shadow-xl">
                                <AvatarImage src={getFullAvatarUrl(parent.avatarUrl) || ''} className="object-cover" />
                                <AvatarFallback className="bg-secondary text-2xl font-bold text-muted-foreground">
                                    {parent.firstName?.[0]}{parent.lastName?.[0]}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                    <CardContent className="pt-16 text-center space-y-3 pb-8">
                        <h2 className="text-2xl font-bold">{parent.firstName} {parent.lastName}</h2>
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                            Parent Account
                        </div>
                        <div className="pt-4 space-y-2">
                            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                                <Mail className="h-4 w-4 text-primary" /> {parent.email}
                            </div>
                            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                                <Phone className="h-4 w-4 text-primary" /> {parent.phone || 'N/A'}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="lg:col-span-2 space-y-8">
                    {/* Details section */}
                    <Card className="glass-card border-none hover:shadow-xl transition-all">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary" />
                                Account Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1 group">
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">Full Name</p>
                                <p className="text-lg font-semibold group-hover:text-primary transition-colors">{parent.firstName} {parent.lastName}</p>
                            </div>
                            <div className="space-y-1 group">
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">Email Address</p>
                                <p className="text-lg font-semibold group-hover:text-primary transition-colors">{parent.email}</p>
                            </div>
                            <div className="space-y-1 group">
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">Phone</p>
                                <p className="text-lg font-semibold group-hover:text-primary transition-colors">{parent.phone || 'N/A'}</p>
                            </div>
                            <div className="space-y-1 group">
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">Joined Date</p>
                                <p className="text-lg font-semibold group-hover:text-primary transition-colors">
                                    {new Date(parent.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Linked Students Section */}
                    <Card className="glass-card border-none hover:shadow-xl transition-all">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" />
                                Linked Students
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {parent.parentProfiles && parent.parentProfiles.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {parent.parentProfiles.map((p: any) => (
                                        <Link key={p.id} href={`/dashboard/admin/students/view/${p.student?.id}`}>
                                            <div className="group p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                                                        <span className="font-bold text-primary">{p.student?.user?.firstName?.[0]}</span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-sm truncate uppercase tracking-tight group-hover:text-primary transition-colors">
                                                            {p.student?.user?.firstName} {p.student?.user?.lastName}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-[10px] font-bold text-muted-foreground uppercase">
                                                                {p.student?.class?.name || 'No Class'}
                                                            </span>
                                                            <div className="w-1 h-1 rounded-full bg-white/20" />
                                                            <span className="text-[10px] font-mono text-muted-foreground">
                                                                #{p.student?.enrollmentNo?.split('-')[0]}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <ChevronLeft className="h-4 w-4 rotate-180 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                                </div>
                                                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-50">Relationship</span>
                                                    <span className="text-[10px] font-bold text-primary uppercase">{p.relationship || 'Guardian'}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center border-2 border-dashed border-white/5 rounded-3xl">
                                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 mb-4">
                                        <User className="h-6 w-6 text-muted-foreground opacity-20" />
                                    </div>
                                    <p className="text-sm font-medium text-muted-foreground italic">No students linked to this account yet.</p>
                                    <Link href={`/dashboard/admin/parents/edit/${id}`}>
                                        <Button variant="link" className="mt-2 text-primary">Manage Students</Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
