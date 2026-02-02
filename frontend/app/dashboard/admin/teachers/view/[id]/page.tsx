'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, User, Phone, Mail, Award, BookOpen, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { teacherService } from '@/services/teacher.service';
import toast from 'react-hot-toast';

export default function ViewTeacherPage() {
    const params = useParams();
    const id = params.id as string;
    const [teacher, setTeacher] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeacher = async () => {
            try {
                const data = await teacherService.getTeacherById(id);
                setTeacher(data);
            } catch (error) {
                toast.error('Failed to fetch teacher details');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchTeacher();
    }, [id]);

    if (loading) return <div className="p-8 text-center italic text-muted-foreground">Loading teacher profile...</div>;
    if (!teacher) return <div className="p-8 text-center text-destructive font-bold">Teacher not found</div>;

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/admin/teachers">
                        <Button variant="ghost" size="sm">
                            <ChevronLeft className="h-4 w-4 mr-2" /> Back
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">Staff Member Profile</h1>
                </div>
                <Link href={`/dashboard/admin/teachers/edit/${id}`}>
                    <Button>Edit Record</Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-1 glass-card border-none overflow-hidden">
                    <div className="h-32 bg-primary/20 relative" />
                    <CardContent className="pt-8 text-center space-y-4 pb-8">
                        <div className="h-24 w-24 rounded-2xl bg-secondary flex items-center justify-center mx-auto border-4 border-white shadow-lg">
                            <User className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{teacher.user?.firstName} {teacher.user?.lastName}</h2>
                            <p className="text-sm font-medium text-primary uppercase tracking-widest">{teacher.specialization}</p>
                        </div>
                        <div className="bg-secondary/30 p-4 rounded-xl text-left space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="truncate">{teacher.user?.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{teacher.user?.phone || 'N/A'}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="lg:col-span-2 space-y-8">
                    <Card className="glass-card border-none">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Award className="h-5 w-5 text-primary" /> Professional Background
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Qualification</p>
                                <p className="font-medium text-lg">{teacher.qualification}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Experience</p>
                                <div className="flex items-center gap-2 font-medium text-lg">
                                    <Briefcase className="h-5 w-5 text-primary" />
                                    {teacher.experience} Years
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Joining Date</p>
                                <div className="flex items-center gap-2 font-medium text-lg">
                                    <BookOpen className="h-5 w-5 text-primary" />
                                    {teacher.joiningDate ? new Date(teacher.joiningDate).toLocaleDateString() : 'N/A'}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Employee ID</p>
                                <p className="font-mono font-bold text-lg">{teacher.employeeId}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card border-none">
                        <CardHeader>
                            <CardTitle>Assigned Classes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center p-8 text-muted-foreground italic border-2 border-dashed border-white/10 rounded-2xl">
                                No specific classes assigned to this staff member yet.
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
