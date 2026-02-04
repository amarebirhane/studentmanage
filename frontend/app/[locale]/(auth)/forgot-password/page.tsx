'use client';

import { useState } from 'react';
import { useRouter, Link } from '@/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

export default function ForgotPasswordPage() {
    const t = useTranslations('Auth');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // await authService.forgotPassword(email);
            // Mocking request
            await new Promise(resolve => setTimeout(resolve, 1000));
            setIsSubmitted(true);
            toast.success(t('successResetLink'));
        } catch (err: any) {
            toast.error(t('errorResetLink'));
        } finally {
            setLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>{t('checkEmail')}</CardTitle>
                        <CardDescription>
                            {t('resetLinkSentDesc', { email })}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                            <Link href="/login">{t('backToLogin')}</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>{t('forgotPassword')}</CardTitle>
                    <CardDescription>
                        {t('forgotPasswordDesc')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">{t('email')}</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? t('sendingLink') : t('sendResetLink')}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        <Link href="/login" className="text-primary hover:underline">
                            {t('backToLogin')}
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
