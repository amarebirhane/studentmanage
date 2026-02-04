'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { paymentService } from '@/services/payment.service';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function PaymentSuccessPage() {
    const router = useRouter();
    // const searchParams = useSearchParams(); // Should be accessible if this component is wrapped in Suspense or effectively used
    // Since Next.js 13+ App Router, useSearchParams hook is standard but careful with Suspense boundary.
    // For simplicity, we'll try to parse window url if hook issues occur, but assume standard setup works.

    // We will parse standard URL params manually to be safe on client side rendering without suspense boundary issues for now
    const [status, setStatus] = useState<'VERIFYING' | 'SUCCESS' | 'FAILED'>('VERIFYING');
    const [txRef, setTxRef] = useState<string | null>(null);

    useEffect(() => {
        // Extract tx_ref from URL manually
        // Chapa usually redirects to: return_url?tx_ref=...
        // Wait for router isReady concept isn't direct in App Router, useEffect mount is fine.

        const params = new URLSearchParams(window.location.search);
        const ref = params.get('tx_ref');

        if (ref) {
            setTxRef(ref);
            verify(ref);
        } else {
            // Fallback or error
            setStatus('FAILED');
        }
    }, []);

    const verify = async (ref: string) => {
        try {
            const result = await paymentService.verifyPayment(ref);
            if (result.success) {
                setStatus('SUCCESS');
                toast.success('Payment verified successfully!');
            } else {
                setStatus('FAILED');
                toast.error('Payment verification failed.');
            }
        } catch (error) {
            console.error(error);
            setStatus('FAILED');
            toast.error('Error verifying payment.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md glass-card border-none shadow-2xl">
                <CardContent className="pt-10 pb-8 text-center space-y-6">
                    {status === 'VERIFYING' && (
                        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                            </div>
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
                                Verifying Payment...
                            </h2>
                            <p className="text-muted-foreground mt-2">Please wait while we confirm your transaction.</p>
                        </div>
                    )}

                    {status === 'SUCCESS' && (
                        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                            <div className="h-24 w-24 rounded-full bg-green-500/10 flex items-center justify-center mb-6 ring-8 ring-green-500/5">
                                <CheckCircle2 className="h-12 w-12 text-green-500" />
                            </div>
                            <h2 className="text-3xl font-bold text-foreground">Payment Successful!</h2>
                            <p className="text-muted-foreground mt-2 px-6">
                                Thank you! Your fee payment has been recorded successfully.
                            </p>
                            <div className="w-full pt-6">
                                <Button
                                    className="w-full h-12 text-lg gap-2"
                                    onClick={() => router.push('/dashboard/student/fees')}
                                >
                                    Back to Fees <ArrowRight className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {status === 'FAILED' && (
                        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                            <div className="h-24 w-24 rounded-full bg-red-500/10 flex items-center justify-center mb-6 ring-8 ring-red-500/5">
                                <XCircle className="h-12 w-12 text-red-500" />
                            </div>
                            <h2 className="text-3xl font-bold text-foreground">Payment Failed</h2>
                            <p className="text-muted-foreground mt-2 px-6">
                                We couldn't verify your payment. Please contact support if this persists.
                            </p>
                            <div className="w-full pt-6">
                                <Button
                                    variant="outline"
                                    className="w-full h-12 text-lg gap-2"
                                    onClick={() => router.push('/dashboard/student/fees')}
                                >
                                    <ArrowRight className="h-5 w-5 rotate-180" /> Back to Fees
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
