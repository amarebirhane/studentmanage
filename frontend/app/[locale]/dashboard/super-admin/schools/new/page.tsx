'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, User, ChevronRight, Check, Loader2, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { schoolService } from '@/services/school.service';
import Link from 'next/link';

export default function AddSchoolPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        address: '',
        phone: '',
        email: '',
        adminUser: {
            firstName: '',
            lastName: '',
            email: '',
            password: ''
        }
    });

    const handleSchoolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            adminUser: {
                ...formData.adminUser,
                [e.target.name]: e.target.value
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await schoolService.createSchool(formData);
            router.push('/dashboard/super-admin/schools');
        } catch (error) {
            console.error('Failed to create school', error);
            // In a real app, show toast error here
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard/super-admin/schools">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Onboard New School</h1>
                    <p className="text-muted-foreground mt-1">Set up a new tenant and main administrator.</p>
                </div>
            </div>

            {/* Steps Indicator */}
            <div className="flex items-center gap-4 mb-8">
                <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-primary bg-primary/10' : 'border-muted'}`}>
                        <Building2 className="h-4 w-4" />
                    </div>
                    <span className="font-medium">School Details</span>
                </div>
                <div className="h-[2px] flex-1 bg-muted">
                    <div className={`h-full bg-primary transition-all duration-300 ${step === 2 ? 'w-full' : 'w-0'}`} />
                </div>
                <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-primary bg-primary/10' : 'border-muted'}`}>
                        <User className="h-4 w-4" />
                    </div>
                    <span className="font-medium">Admin Account</span>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="glass-card border-none">
                    <CardHeader>
                        <CardTitle>{step === 1 ? 'School Information' : 'Administrator Account'}</CardTitle>
                        <CardDescription>
                            {step === 1 ? 'Enter the basic details for the new school tenant.' : 'Create the initial Super User for this school.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {step === 1 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">School Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            required
                                            placeholder="e.g. Springfield High"
                                            value={formData.name}
                                            onChange={handleSchoolChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="slug">Domain / Slug</Label>
                                        <Input
                                            id="slug"
                                            name="slug"
                                            required
                                            placeholder="e.g. springfield"
                                            value={formData.slug}
                                            onChange={handleSchoolChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Official Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            placeholder="contact@school.com"
                                            value={formData.email}
                                            onChange={handleSchoolChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            required
                                            placeholder="+1 (555) 000-0000"
                                            value={formData.phone}
                                            onChange={handleSchoolChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Physical Address</Label>
                                    <Input
                                        id="address"
                                        name="address"
                                        required
                                        placeholder="123 Education Lane, City, State"
                                        value={formData.address}
                                        onChange={handleSchoolChange}
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            required
                                            placeholder="John"
                                            value={formData.adminUser.firstName}
                                            onChange={handleAdminChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            required
                                            placeholder="Doe"
                                            value={formData.adminUser.lastName}
                                            onChange={handleAdminChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="adminEmail">School Admin Email</Label>
                                    <Input
                                        id="adminEmail"
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="admin@springfield.com"
                                        value={formData.adminUser.email}
                                        onChange={handleAdminChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Temporary Password</Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        value={formData.adminUser.password}
                                        onChange={handleAdminChange}
                                    />
                                </div>
                            </>
                        )}

                        <div className="flex justify-between pt-4">
                            {step > 1 ? (
                                <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                                    Back
                                </Button>
                            ) : (
                                <div />
                            )}

                            {step < 2 ? (
                                <Button type="button" onClick={() => setStep(step + 1)}>
                                    Next Step <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <Button type="submit" disabled={loading}>
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                                    Create School
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
