'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, DollarSign, Calendar, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { feeService } from '@/services/fee.service';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function StudentFeesPage() {
    const [fees, setFees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFees();
    }, []);

    const fetchFees = async () => {
        try {
            setLoading(true);
            // Assuming getFees returns fees relevant to the student
            const data = await feeService.getFees();
            setFees(data || []);
        } catch (error) {
            toast.error('Failed to load fee records');
        } finally {
            setLoading(false);
        }
    };

    const getStatusInfo = (fee: any) => {
        // Status logic might depend on backend structure. 
        // Assuming fee has status or paidAmount/amount structure

        if (fee.status === 'PAID' || (fee.paidAmount >= fee.amount)) {
            return { label: 'Paid', color: 'text-green-500 bg-green-500/10 border-green-500/20', icon: CheckCircle2 };
        }

        const isOverdue = new Date(fee.dueDate) < new Date() && fee.status !== 'PAID';
        if (isOverdue) {
            return { label: 'Overdue', color: 'text-destructive bg-destructive/10 border-destructive/20', icon: AlertCircle };
        }

        return { label: 'Pending', color: 'text-orange-500 bg-orange-500/10 border-orange-500/20', icon: FileText };
    };

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Fees</h1>
                <p className="text-muted-foreground mt-1">Track your fee payments and invoices.</p>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">Loading fee records...</p>
                    </div>
                ) : fees.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {fees.map((fee) => {
                            const status = getStatusInfo(fee);
                            const StatusIcon = status.icon;

                            return (
                                <Card key={fee.id} className="glass-card border-none hover:ring-1 hover:ring-primary/20 transition-all">
                                    <div className="p-1">
                                        <div className={cn("px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-t-xl flex items-center justify-between gap-2 border-b border-transparent", status.color)}>
                                            <span className="flex items-center gap-1.5">
                                                <StatusIcon className="h-3.5 w-3.5" />
                                                {status.label}
                                            </span>
                                            {fee.dueDate && (
                                                <span className="opacity-75">
                                                    Due: {format(new Date(fee.dueDate), 'MMM d')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <CardHeader className="pb-2 pt-4">
                                        <div className="flex justify-between items-start gap-4">
                                            <CardTitle className="text-xl font-bold">{fee.title || 'Tuition Fee'}</CardTitle>
                                            <div className="text-lg font-bold text-primary">
                                                ${fee.amount?.toLocaleString()}
                                            </div>
                                        </div>
                                        <CardDescription>{fee.description || 'School Fee'}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3 pt-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Paid Amount</span>
                                                <span className="font-medium">${fee.paidAmount?.toLocaleString() || '0'}</span>
                                            </div>
                                            <div className="w-full bg-secondary/30 h-2 rounded-full overflow-hidden">
                                                <div
                                                    className={cn("h-full transition-all duration-500",
                                                        status.label === 'Overdue' ? 'bg-destructive' : 'bg-primary'
                                                    )}
                                                    style={{ width: `${Math.min(((fee.paidAmount || 0) / fee.amount) * 100, 100)}%` }}
                                                />
                                            </div>
                                            {status.label !== 'Paid' && (
                                                <Button className="w-full mt-2" variant="outline">
                                                    View Details
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <Card className="glass-card border-none p-12 text-center text-muted-foreground">
                        <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <h3 className="text-lg font-medium">No fee records found</h3>
                        <p>You don't have any pending fee invoices.</p>
                    </Card>
                )}
            </div>
        </div>
    );
}
