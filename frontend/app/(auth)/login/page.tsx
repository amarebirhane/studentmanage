'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Eye,
    EyeOff,
    GraduationCap,
    ArrowLeft,
    CheckCircle2,
    Lock,
    Mail,
    Github,
    AlertCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { loginSchema } from '@/lib/validation';
import { getDashboardRoute } from '@/lib/utils/routes';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const { login, isLoading, user, isAuthenticated } = useAuth();
    const router = useRouter();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && user) {
            const dashboardRoute = getDashboardRoute(user.role);
            router.push(dashboardRoute);
        }
    }, [isAuthenticated, user, router]);

    if (isLoading) {
        return (
            <div className="h-screen w-screen flex flex-col items-center justify-center bg-primary text-primary-foreground">
                <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-xl shadow-2xl animate-pulse">
                    <GraduationCap className="h-16 w-16" />
                </div>
                <div className="mt-8 flex flex-col items-center gap-2">
                    <div className="h-1.5 w-32 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white animate-[shimmer_1s_infinite] w-1/2 rounded-full" />
                    </div>
                </div>
            </div>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
        setValidationErrors({});

        const result = loginSchema.safeParse(formData);
        if (!result.success) {
            const errors: Record<string, string> = {};
            result.error.errors.forEach((err) => {
                if (err.path[0]) errors[err.path[0] as string] = err.message;
            });
            setValidationErrors(errors);
            return;
        }

        try {
            await login(formData);
            const loggedInUser = useAuthStore.getState().user;
            if (loggedInUser) {
                const dashboardRoute = getDashboardRoute(loggedInUser.role);
                toast.success(`Welcome back, ${loggedInUser.firstName}!`);
                router.push(dashboardRoute);
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Invalid credentials');
        }
    };

    return (
        <div className="h-screen w-screen grid grid-cols-1 md:grid-cols-[1.1fr,1fr] relative overflow-hidden font-sans selection:bg-primary/30">
            {/* Left Branding Side */}
            <div className="relative hidden md:flex h-full flex-col justify-between p-16 lg:p-24 bg-primary overflow-hidden text-primary-foreground border-r border-white/5">
                {/* Visual Background Elements */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-15%] left-[-15%] w-[70%] h-[70%] bg-white/10 rounded-full blur-[160px] animate-pulse" />
                    <div className="absolute bottom-[-15%] right-[-15%] w-[70%] h-[70%] bg-black/30 rounded-full blur-[160px]" />
                    <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]" />
                    {/* Subtle Grid Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                </div>

                <div className="relative z-10 space-y-16 animate-in slide-in-from-left duration-1000 fill-mode-both">
                    <div className="flex items-center space-x-5">
                        <div className="bg-white/15 p-4 rounded-2xl backdrop-blur-md shadow-2xl shadow-black/10">
                            <GraduationCap className="h-12 w-12 text-white" />
                        </div>
                        <span className="font-black text-4xl tracking-tighter">EduSmart</span>
                    </div>

                    <div className="space-y-10">
                        <h2 className="text-7xl font-black leading-[1] tracking-tighter max-w-xl">
                            Revolutionizing <br />
                            <span className="text-white/50">Modern Classrooms</span>
                        </h2>
                        <p className="text-2xl font-medium opacity-70 leading-relaxed max-w-md">
                            The most advanced school management portal ever designed. Efficiency meets elegance.
                        </p>
                    </div>

                    <div className="space-y-10 pt-6">
                        {[
                            { title: "Universal Management", desc: "One portal for admins, teachers, and students." },
                            { title: "Real-time Intelligence", desc: "Live analytics for immediate decision making." }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-6 group">
                                <div className="mt-1 h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-primary transition-all duration-300">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-2xl tracking-tight">{item.title}</h4>
                                    <p className="text-base font-medium opacity-50 leading-tight">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 pt-10 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-2.5 w-2.5 rounded-full bg-white animate-ping" />
                        <div className="text-[12px] font-black uppercase tracking-[0.4em] opacity-60">System Core V2.4</div>
                    </div>
                </div>
            </div>

            {/* Right Form Side */}
            <div className="h-full flex flex-col bg-background relative z-10 overflow-y-auto">
                {/* Back Button */}
                <Link href="/" className="absolute top-10 right-10 flex items-center text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 hover:text-primary transition-all group">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Access Root</span>
                </Link>

                <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-24">
                    <div className="max-w-md w-full space-y-12 animate-in slide-in-from-right duration-1000 delay-200 fill-mode-both">
                        <div className="space-y-4 text-center md:text-left">
                            <h1 className="text-5xl font-black tracking-tight text-foreground">Sign In</h1>
                            <p className="text-muted-foreground font-medium text-xl leading-relaxed opacity-60">
                                Authenticate your identity to proceed to your secure dashboard.
                            </p>
                        </div>

                        {/* Social Auth Placeholders */}
                        <div className="grid grid-cols-2 gap-5">
                            <Button variant="outline" className="h-16 border-border/40 bg-muted/20 hover:bg-muted/40 gap-3 font-bold rounded-[1.25rem] transition-all border-2 text-base" onClick={() => toast.success('Coming soon!')}>
                                <svg className="h-6 w-6 text-[#4285F4]" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Google
                            </Button>
                            <Button variant="outline" className="h-16 border-border/40 bg-muted/20 hover:bg-muted/40 gap-3 font-bold rounded-[1.25rem] transition-all border-2 text-base" onClick={() => toast.success('Coming soon!')}>
                                <Github className="h-6 w-6 text-foreground" /> Github
                            </Button>
                        </div>

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/50"></span></div>
                            <div className="relative flex justify-center text-[11px] uppercase tracking-[0.4em] font-black"><span className="bg-background px-8 text-muted-foreground/30">Secure Terminal Access</span></div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-3">
                                <Label htmlFor="email" className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground/40 ml-1">Identity Vector</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="user@portal.com"
                                        className="pl-16 h-16 bg-muted/10 border-2 border-border/40 focus:border-primary focus:bg-background transition-all rounded-[1.5rem] text-xl font-medium"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                </div>
                                {validationErrors.email && (
                                    <p className="text-xs text-destructive mt-3 font-bold flex items-center gap-1.5 px-2">
                                        <AlertCircle className="h-4 w-4" /> {validationErrors.email}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between px-1">
                                    <Label htmlFor="password" className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground/40">Credential Key</Label>
                                    <Link href="/forgot-password" className="text-[12px] text-primary font-black hover:underline tracking-tight">
                                        Recover Access
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="••••••••••••"
                                        className="pl-16 pr-16 h-16 bg-muted/10 border-2 border-border/40 focus:border-primary focus:bg-background transition-all rounded-[1.5rem] text-xl font-medium"
                                        value={formData.password}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground/30 hover:text-foreground transition-colors p-1"
                                    >
                                        {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                                    </button>
                                </div>
                                {validationErrors.password && (
                                    <p className="text-xs text-destructive mt-3 font-bold flex items-center gap-1.5 px-2">
                                        <AlertCircle className="h-4 w-4" /> {validationErrors.password}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center space-x-3 px-1">
                                <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setRememberMe(!rememberMe)}>
                                    <div className={`h-7 w-7 rounded-xl border-2 border-border flex items-center justify-center transition-all ${rememberMe ? 'bg-primary border-primary' : 'bg-muted/10 hover:border-primary/50'}`}>
                                        {rememberMe && <CheckCircle2 className="h-4 w-4 text-primary-foreground" />}
                                    </div>
                                    <span className="text-base font-bold text-muted-foreground group-hover:text-foreground transition-colors select-none">
                                        Preserve session for 30 cycles
                                    </span>
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-20 text-2xl font-black shadow-[0_20px_50px_rgba(59,130,246,0.25)] hover:shadow-primary/40 hover:-translate-y-1.5 active:translate-y-0 transition-all rounded-[1.5rem] bg-primary hover:bg-primary/90 text-primary-foreground group" disabled={isLoading}>
                                {isLoading ? (
                                    <span className="flex items-center gap-4">
                                        <div className="h-7 w-7 border-4 border-white/20 border-t-white animate-spin rounded-full" />
                                        <span>Authorizing...</span>
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-3">
                                        Initiate Authentication <ArrowLeft className="h-8 w-8 rotate-180 group-hover:translate-x-3 transition-transform" />
                                    </span>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="p-10 text-center border-t border-border mt-auto">
                    <p className="text-[12px] text-muted-foreground/30 font-black uppercase tracking-[0.3em] leading-relaxed">
                        Security Clearance Required <br />
                        <Link href="/help" className="text-primary hover:underline">Support</Link> • <Link href="/privacy" className="text-primary hover:underline">Legal</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
