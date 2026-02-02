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
        <div className="min-h-screen bg-background nebula-gradient flex items-center justify-center p-4 relative overflow-hidden selection:bg-primary/30 font-sans">
            {/* Ambient Background Blur */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] bg-blue-600/10 rounded-full blur-[120px]" />
            </div>

            {/* Back Button */}
            <Link href="/" className="absolute top-8 left-8 flex items-center text-sm font-bold text-muted-foreground hover:text-primary transition-all group z-20">
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Home</span>
            </Link>

            <Card className="w-full max-w-6xl glass-card border-white/5 overflow-hidden shadow-[0_32px_128px_-16px_rgba(0,0,0,0.4)] flex flex-col md:flex-row min-h-[720px] z-10 animate-in fade-in zoom-in duration-1000">
                {/* Branding Panel */}
                <div className="w-full md:w-[42%] bg-primary/5 p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden text-primary border-r border-white/5">
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />

                    <div className="relative z-10 space-y-12">
                        <div className="flex items-center space-x-4">
                            <div className="bg-primary p-3 rounded-2xl shadow-2xl shadow-primary/40 rotate-1">
                                <GraduationCap className="h-9 w-9 text-primary-foreground" />
                            </div>
                            <span className="font-black text-3xl tracking-tighter">EduSmart</span>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-5xl font-black leading-[1.05] tracking-tight">
                                Empowering <br />
                                <span className="text-foreground">Modern Learning</span>
                            </h2>
                            <p className="text-xl font-medium opacity-70 leading-relaxed max-w-sm">
                                The most powerful, intuitive school management system ever built.
                            </p>
                        </div>

                        <div className="space-y-6 pt-4">
                            {[
                                { title: "Seamless Operations", desc: "Automate everything from attendance to fees." },
                                { title: "Deep Analytics", desc: "Unlock insights into student performance." },
                                { title: "Community First", desc: "Bridge the gap between teachers and parents." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 group">
                                    <div className="mt-1 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                        <CheckCircle2 className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-foreground text-lg">{item.title}</h4>
                                        <p className="text-sm font-medium opacity-60 leading-tight">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 pt-10 border-t border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="text-xs font-bold uppercase tracking-[0.2em] opacity-40">Trusted by 500+ Schools</div>
                        </div>
                    </div>
                </div>

                {/* Login Form Panel */}
                <div className="w-full md:w-[58%] p-10 lg:p-16 flex flex-col justify-center bg-background/30 backdrop-blur-md relative">
                    <div className="max-w-md mx-auto w-full space-y-10 animate-in slide-in-from-right duration-700 delay-200 fill-mode-both">
                        <div className="space-y-2 text-center md:text-left">
                            <h1 className="text-4xl font-black tracking-tight">Welcome back</h1>
                            <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                                Enter your credentials to access your dashboard.
                            </p>
                        </div>

                        {/* Social Auth Placeholders */}
                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" className="h-14 border-white/5 glass hover:bg-white/5 gap-3 font-bold rounded-2xl transition-all" onClick={() => toast.success('Coming soon!')}>
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Google
                            </Button>
                            <Button variant="outline" className="h-14 border-white/5 glass hover:bg-white/5 gap-3 font-bold rounded-2xl transition-all" onClick={() => toast.success('Coming soon!')}>
                                <Github className="h-5 w-5" /> GitHub
                            </Button>
                        </div>

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
                            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em]"><span className="bg-transparent px-4 text-muted-foreground/50 font-black">or continue with email</span></div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.15em] opacity-40 ml-1">Work Email</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="admin@school.com"
                                        className="pl-12 h-14 bg-white/[0.03] border-white/5 focus:bg-white/[0.05] focus:ring-4 focus:ring-primary/10 transition-all rounded-[1.25rem] text-lg font-medium"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                </div>
                                {validationErrors.email && (
                                    <p className="text-xs text-destructive mt-2 font-bold flex items-center gap-1.5 px-2">
                                        <AlertCircle className="h-3.5 w-3.5" /> {validationErrors.email}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between px-1">
                                    <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.15em] opacity-40">Security Key</Label>
                                    <Link href="/forgot-password" className="text-[11px] text-primary font-black hover:underline tracking-tight">
                                        Forgot Password?
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="••••••••••••"
                                        className="pl-12 pr-12 h-14 bg-white/[0.03] border-white/5 focus:bg-white/[0.05] focus:ring-4 focus:ring-primary/10 transition-all rounded-[1.25rem] text-lg font-medium"
                                        value={formData.password}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {validationErrors.password && (
                                    <p className="text-xs text-destructive mt-2 font-bold flex items-center gap-1.5 px-2">
                                        <AlertCircle className="h-3.5 w-3.5" /> {validationErrors.password}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center space-x-3 px-1">
                                <div className="flex items-center space-x-2 cursor-pointer group" onClick={() => setRememberMe(!rememberMe)}>
                                    <div className={`h-5 w-5 rounded-md border-2 border-white/10 flex items-center justify-center transition-all ${rememberMe ? 'bg-primary border-primary' : 'bg-transparent'}`}>
                                        {rememberMe && <CheckCircle2 className="h-3 w-3 text-primary-foreground" />}
                                    </div>
                                    <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors select-none italic">
                                        Keep me logged in for security audits
                                    </span>
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-16 text-xl font-black shadow-[0_12px_48px_-8px_rgba(0,0,0,0.5)] hover:shadow-primary/30 hover:scale-[1.01] active:scale-[0.99] transition-all rounded-[1.25rem] bg-primary hover:bg-primary/90 text-primary-foreground group" disabled={isLoading}>
                                {isLoading ? (
                                    <span className="flex items-center gap-3">
                                        <div className="h-5 w-5 border-[3px] border-white/30 border-t-white animate-spin rounded-full" />
                                        <span>Authenticating Session...</span>
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Sign In to Dashboard <ArrowLeft className="h-5 w-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </Button>
                        </form>

                        <div className="text-center pt-6 opacity-60 hover:opacity-100 transition-opacity">
                            <p className="text-[11px] text-muted-foreground font-black uppercase tracking-[0.1em]">
                                Unauthorized access is strictly prohibited. <br />
                                <Link href="/help" className="text-primary hover:underline">System status</Link> • <Link href="/privacy" className="text-primary hover:underline">Compliance</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Micro-Footer */}
            <div className="absolute bottom-6 flex gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 z-0">
                <span>V2.4.0 ENCRYPTION ENABLED</span>
                <span>GLOBAL SCHOOL NETWORK</span>
            </div>
        </div>
    );
}
