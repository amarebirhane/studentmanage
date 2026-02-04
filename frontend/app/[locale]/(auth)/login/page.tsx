'use client';

import { useState, useEffect } from 'react';
import { useRouter, Link } from '@/navigation';
import {
    Eye,
    EyeOff,
    GraduationCap,
    ArrowLeft,
    CheckCircle2,
    Lock,
    Mail,
    AlertCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginSchema } from '@/lib/validation';
import { getDashboardRoute } from '@/lib/utils/routes';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
    const t = useTranslations('Auth');
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const [twoFactorRequired, setTwoFactorRequired] = useState(false);
    const [twoFactorToken, setTwoFactorToken] = useState('');

    const { login, isLoading, user, isAuthenticated } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationErrors({});

        if (twoFactorRequired) {
            if (!twoFactorToken || twoFactorToken.length !== 6) {
                toast.error(t('enterValidCode'));
                return;
            }
            try {
                await login({ ...formData, code: twoFactorToken });
                const loggedInUser = useAuthStore.getState().user;
                if (loggedInUser) {
                    const dashboardRoute = getDashboardRoute(loggedInUser.role);
                    toast.success(`Welcome back, ${loggedInUser.firstName}!`);
                    router.push(dashboardRoute as any);
                }
            } catch (err: any) {
                console.error('LoginPage - 2FA Submit Error:', err);
                toast.error(err.response?.data?.message || t('invalid2faCode'));
            }
            return;
        }

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
            const response = await login(formData);

            if (response && response.twoFactorRequired) {
                setTwoFactorRequired(true);
                toast.success(t('twoFactorRequired'));
                return;
            }

            const loggedInUser = useAuthStore.getState().user;
            if (loggedInUser) {
                const dashboardRoute = getDashboardRoute(loggedInUser.role);
                toast.success(`Welcome back, ${loggedInUser.firstName}!`);
                router.push(dashboardRoute as any);
            }
        } catch (err: any) {
            console.error('LoginPage - Submit Error:', err);
            toast.error(err.response?.data?.message || t('invalidCredentials'));
        }
    };

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

    return (
        <div className="h-screen w-screen grid grid-cols-1 md:grid-cols-[1.1fr,1fr] relative overflow-hidden font-sans selection:bg-primary/30">
            {/* Left Branding Side */}
            <div className="relative hidden md:flex h-full flex-col justify-between p-16 lg:p-24 bg-primary overflow-hidden text-primary-foreground border-r border-white/5">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-15%] left-[-15%] w-[70%] h-[70%] bg-white/10 rounded-full blur-[160px] animate-pulse" />
                    <div className="absolute bottom-[-15%] right-[-15%] w-[70%] h-[70%] bg-black/30 rounded-full blur-[160px]" />
                    <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]" />
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                </div>

                <div className="relative z-10 space-y-16 animate-in slide-in-from-left duration-1000 fill-mode-both">
                    <Link href="/" className="flex items-center space-x-5">
                        <div className="bg-white/15 p-4 rounded-2xl backdrop-blur-md shadow-2xl shadow-black/10">
                            <GraduationCap className="h-12 w-12 text-white" />
                        </div>
                        <span className="font-black text-4xl tracking-tighter">EduSmart</span>
                    </Link>

                    <div className="space-y-10">
                        <h2 className="text-7xl font-black leading-[1] tracking-tighter max-w-xl">
                            {t('revolutionaryClassrooms')}
                        </h2>
                        <p className="text-2xl font-medium opacity-70 leading-relaxed max-w-md">
                            {t('brandingDesc')}
                        </p>
                    </div>

                    <div className="space-y-10 pt-6">
                        {[
                            { title: t('universalManagement'), desc: t('universalManagementDesc') },
                            { title: t('realtimeIntelligence'), desc: t('realtimeIntelligenceDesc') }
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
                        <div className="text-[12px] font-black uppercase tracking-[0.4em] opacity-60">{t('systemCore')}</div>
                    </div>
                </div>
            </div>

            {/* Right Form Side */}
            <div className="h-full flex flex-col bg-background relative z-10 overflow-y-auto">
                {/* Back Button */}
                <Link href="/" className="absolute top-10 right-10 flex items-center text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 hover:text-primary transition-all group">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    <span>{t('accessRoot')}</span>
                </Link>

                <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-24">
                    <div className="max-w-md w-full space-y-12 animate-in slide-in-from-right duration-1000 delay-200 fill-mode-both">
                        <div className="space-y-4 text-center md:text-left">
                            <h1 className="text-5xl font-black tracking-tight text-foreground">{t('welcomeBack')} </h1>
                            <p className="text-muted-foreground font-medium text-xl leading-relaxed opacity-60">
                                {t('authenticateDesc')}
                            </p>
                        </div>

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/50"></span></div>
                            <div className="relative flex justify-center text-[11px] uppercase tracking-[0.4em] font-black"><span className="bg-background px-8 text-muted-foreground/30">{t('securityClearance')}</span></div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-3">
                                <Label htmlFor="email" className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground/40 ml-1">{t('identityVector')}</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder={t('emailPlaceholder')}
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
                                    <Label htmlFor="password" className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground/40">{t('credentialKey')}</Label>
                                    <Link href="/forgot-password" className="text-[12px] text-primary font-black hover:underline tracking-tight">
                                        {t('recoverAccess')}
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder={t('passwordPlaceholder')}
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
                                        {t('preserveSession')}
                                    </span>
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-20 text-2xl font-black shadow-[0_20px_50px_rgba(59,130,246,0.25)] hover:shadow-primary/40 hover:-translate-y-1.5 active:translate-y-0 transition-all rounded-[1.5rem] bg-primary hover:bg-primary/90 text-primary-foreground group" disabled={isLoading}>
                                {isLoading ? (
                                    <span className="flex items-center gap-4">
                                        <div className="h-7 w-7 border-4 border-white/20 border-t-white animate-spin rounded-full" />
                                        <span>{t('authorizing')}</span>
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-3">
                                        {t('loginButton')} <ArrowLeft className="h-8 w-8 rotate-180 group-hover:translate-x-3 transition-transform" />
                                    </span>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="p-10 text-center border-t border-border mt-auto">
                    <p className="text-[12px] text-muted-foreground/30 font-black uppercase tracking-[0.3em] leading-relaxed">
                        {t('securityClearance')} <br />
                        <Link href="/help" className="text-primary hover:underline">Support</Link> • <Link href="/privacy" className="text-primary hover:underline">Legal</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
