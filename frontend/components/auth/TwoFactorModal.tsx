'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Copy, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';

interface TwoFactorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEnabled: () => void;
}

export function TwoFactorModal({ isOpen, onClose, onEnabled }: TwoFactorModalProps) {
    const [step, setStep] = useState<'INITIAL' | 'SCAN' | 'VERIFY'>('INITIAL');
    const [secret, setSecret] = useState<{ secret: string; qrCodeUrl: string } | null>(null);
    const [token, setToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleStart = async () => {
        setIsLoading(true);
        try {
            const response = await api.post('/auth/2fa/generate');
            setSecret(response.data.data);
            setStep('SCAN');
        } catch (error) {
            toast.error('Failed to generate 2FA secret');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async () => {
        if (!token || token.length !== 6) {
            toast.error('Please enter a valid 6-digit code');
            return;
        }

        setIsLoading(true);
        try {
            await api.post('/auth/2fa/enable', {
                token,
                secret: secret?.secret
            });
            toast.success('Two-factor authentication enabled!');
            onEnabled();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Invalid code');
        } finally {
            setIsLoading(false);
        }
    };

    const copySecret = () => {
        if (secret?.secret) {
            navigator.clipboard.writeText(secret.secret);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            toast.success('Secret copied to clipboard');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                        Enable Two-Factor Authentication
                    </DialogTitle>
                    <DialogDescription>
                        Protect your account by enabling 2FA using Google Authenticator or Authy.
                    </DialogDescription>
                </DialogHeader>

                {step === 'INITIAL' && (
                    <div className="py-4">
                        <p className="text-sm text-muted-foreground mb-4">
                            When 2FA is enabled, you will be prompted to enter a secure code from your authenticator app each time you sign in.
                        </p>
                        <Button onClick={handleStart} disabled={isLoading} className="w-full">
                            {isLoading ? 'Loading...' : 'Start Setup'}
                        </Button>
                    </div>
                )}

                {step === 'SCAN' && secret && (
                    <div className="space-y-4 py-4">
                        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl">
                            <img src={secret.qrCodeUrl} alt="2FA QR Code" className="w-48 h-48" />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs text-center block text-muted-foreground">Or enter code manually</Label>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 bg-secondary p-2 rounded text-center font-mono text-sm">
                                    {secret.secret}
                                </code>
                                <Button size="icon" variant="outline" onClick={copySecret}>
                                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2 pt-4">
                            <Label>Verify Code</Label>
                            <Input
                                placeholder="Enter 6-digit code"
                                value={token}
                                onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                className="text-center text-lg tracking-widest"
                            />
                        </div>

                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setStep('INITIAL')}>Back</Button>
                            <Button onClick={handleVerify} disabled={isLoading || token.length !== 6}>
                                {isLoading ? 'Verifying...' : 'Verify & Enable'}
                            </Button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
