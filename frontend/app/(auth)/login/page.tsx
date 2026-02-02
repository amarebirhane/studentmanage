'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, GraduationCap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { loginSchema } from '@/lib/validation';
import { getDashboardRoute } from '@/lib/utils/routes';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);

    const { login, isLoading, user } = useAuth();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        // Clear validation error for this field
        if (validationErrors[name]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setValidationErrors({});

        // Validate with Zod
        const result = loginSchema.safeParse(formData);

        if (!result.success) {
            const errors: Record<string, string> = {};
            result.error.errors.forEach((err) => {
                if (err.path[0]) {
                    errors[err.path[0] as string] = err.message;
                }
            });
            setValidationErrors(errors);
            return;
        }


        try {
            console.log('Login Page - Starting login with:', formData.email);
            await login(formData);

            // Get the user directly from the store after login completes
            const loggedInUser = useAuthStore.getState().user;
            const authState = useAuthStore.getState();

            console.log('Login Page - After login, full auth state:', {
                user: loggedInUser,
                isAuthenticated: authState.isAuthenticated,
                token: authState.token ? 'exists' : 'missing',
                hasAttemptedLoad: authState.hasAttemptedLoad
            });

            if (loggedInUser) {
                const dashboardRoute = getDashboardRoute(loggedInUser.role);
                console.log('Login Page - Redirecting to:', dashboardRoute);
                toast.success(`Welcome back, ${loggedInUser.firstName}!`);
                router.push(dashboardRoute);
            } else {
                console.warn('Login Page - User is null after login, using fallback');
                // Fallback to admin dashboard if user is not available
                toast.success('Login successful!');
                router.push('/dashboard/admin');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Login failed';
            console.error('Login Page - Error:', err);
            toast.error(errorMessage);
        }

    };

    const togglePasswordVisibility = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background nebula-gradient p-4">
            <Card className="w-full max-w-md glass-card border-none overflow-hidden">
                <div className="h-2 bg-primary w-full" />
                <CardHeader className="pt-8 pb-6 px-8">
                    <div className="flex justify-center mb-6">
                        <div className="p-3 bg-primary/10 rounded-2xl">
                            <GraduationCap className="h-10 w-10 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-bold text-center tracking-tight">Welcome Back</CardTitle>
                    <CardDescription className="text-center text-muted-foreground mt-2">
                        Enter your credentials to access the dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-10">
                    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                disabled={isLoading}
                                autoComplete="email"
                                className="bg-background/50 border-white/20 h-11 transition-all focus:ring-2 focus:ring-primary/20"
                            />
                            {validationErrors.email && (
                                <p className="text-xs font-medium text-destructive mt-1 flex items-center gap-1">
                                    <span className="h-1 w-1 rounded-full bg-destructive" />
                                    {validationErrors.email}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                                <Link href="/forgot-password" className="text-xs text-primary hover:underline font-medium">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    disabled={isLoading}
                                    autoComplete="current-password"
                                    className="bg-background/50 border-white/20 h-11 pr-10 transition-all focus:ring-2 focus:ring-primary/20"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    disabled={isLoading}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {validationErrors.password && (
                                <p className="text-xs font-medium text-destructive mt-1 flex items-center gap-1">
                                    <span className="h-1 w-1 rounded-full bg-destructive" />
                                    {validationErrors.password}
                                </p>
                            )}
                        </div>

                        <Button type="submit" className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99]" disabled={isLoading}>
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                                    Logging in...
                                </div>
                            ) : 'Sign In'}
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-sm">
                        <span className="text-muted-foreground">Don&apos;t have an account?</span>{' '}
                        <Link href="/register" className="text-primary font-bold hover:underline">
                            Create Account
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div >
    );
}
