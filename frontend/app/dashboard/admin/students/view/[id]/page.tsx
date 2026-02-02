'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, User, Phone, Mail, MapPin, Calendar, Hash, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { studentService } from '@/services/student.service';
import { StudentProfile } from '@/types/student';
import toast from 'react-hot-toast';

export default function ViewStudentPage() {
    const params = useParams();
    const id = params.id as string;
    const [student, setStudent] = useState<StudentProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const data = await studentService.getStudentById(id);
                setStudent(data);
            } catch (error) {
                toast.error('Failed to fetch student details');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchStudent();
    }, [id]);

    if (loading) return <div className="p-8 text-center italic text-muted-foreground">Loading student profile...</div>;
    if (!student) return <div className="p-8 text-center text-destructive font-bold">Student not found</div>;

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/admin/students">
                        <Button variant="ghost" size="sm">
                            <ChevronLeft className="h-4 w-4 mr-2" /> Back
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">Student Profile</h1>
                </div>
                <Link href={`/dashboard/admin/students/edit/${id}`}>
                    <Button>Edit Record</Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-1 glass-card border-none overflow-hidden">
                    <div className="h-32 bg-primary/20 relative">
                        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                            <div className="h-24 w-24 rounded-2xl bg-white p-1 shadow-xl">
                                {student.avatarUrl ? (
                                    <img src={student.avatarUrl} className="h-full w-full object-cover rounded-xl" alt="Avatar" />
                                ) : (
                                    <div className="h-full w-full bg-secondary flex items-center justify-center rounded-xl">
                                        <User className="h-10 w-10 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <CardContent className="pt-16 text-center space-y-2 pb-8">
                        <h2 className="text-2xl font-bold">{student.user?.firstName} {student.user?.lastName}</h2>
                        <p className="text-sm font-medium text-primary uppercase tracking-widest">{student.class?.name || 'No Class Assigned'}</p>
                        <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                            <Hash className="h-4 w-4" /> {student.enrollmentNo}
                        </div>
                    </CardContent>
                </Card>

                <div className="lg:col-span-2 space-y-8">
                    <Card className="glass-card border-none">
                        <CardHeader>
                            <CardTitle className="text-xl">Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Full Name</p>
                                <p className="font-medium">{student.user?.firstName} {student.user?.lastName}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Email Address</p>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-primary" />
                                    <p className="font-medium">{student.user?.email}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Phone</p>
                                <p className="font-medium">{student.user?.phone || 'N/A'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Date of Birth</p>
                                <p className="font-medium">{student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card border-none">
                        <CardHeader>
                            <CardTitle className="text-xl">Academic & Guardian</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Enrollment No</p>
                                <p className="font-mono font-medium">{student.enrollmentNo}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Current Class</p>
                                <p className="font-medium">{student.class?.name}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Guardian Name</p>
                                <p className="font-medium">{student.guardianName || 'N/A'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Guardian Contact</p>
                                <p className="font-medium">{student.guardianPhone || 'N/A'}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
