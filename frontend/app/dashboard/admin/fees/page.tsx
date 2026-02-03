'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote, Search, Filter, Plus, Loader2, CreditCard, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { feeService } from "@/services/fee.service";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";

export default function FeesPage() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const data = await feeService.getFees();
            setInvoices(data || []);
        } catch (error) {
            console.error('Failed to fetch fee invoices:', error);
            toast.error('Failed to load financial records');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PAID':
                return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20"><CheckCircle2 className="h-3 w-3 mr-1" /> Paid</Badge>;
            case 'PENDING':
                return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
            case 'OVERDUE':
                return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20"><AlertCircle className="h-3 w-3 mr-1" /> Overdue</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const filteredInvoices = invoices.filter(inv =>
        inv.student?.user?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.student?.user?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Financial & Fee Management</h1>
                    <p className="text-muted-foreground">Track student invoices, scholarship applications, and payment history.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="glass border-white/10">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Fee Structures
                    </Button>
                    <Button className="glass bg-primary/20 hover:bg-primary/30 text-primary border-primary/20">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Invoice
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="glass border-white/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Collected</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${invoices.filter(i => i.status === 'PAID').reduce((sum, i) => sum + i.amount, 0).toLocaleString()}</div>
                        <p className="text-xs text-green-500 flex items-center mt-1">
                            Current academic year
                        </p>
                    </CardContent>
                </Card>
                <Card className="glass border-white/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Outstanding Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-500">${invoices.filter(i => i.status !== 'PAID').reduce((sum, i) => sum + i.amount, 0).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            From {invoices.filter(i => i.status !== 'PAID').length} pending invoices
                        </p>
                    </CardContent>
                </Card>
                <Card className="glass border-white/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Collection Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {invoices.length ? Math.round((invoices.filter(i => i.status === 'PAID').length / invoices.length) * 100) : 0}%
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full mt-2">
                            <div
                                className="bg-primary h-full rounded-full"
                                style={{ width: `${invoices.length ? (invoices.filter(i => i.status === 'PAID').length / invoices.length) * 100 : 0}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by student or invoice ID..."
                        className="pl-10 glass border-white/10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="glass border-white/10">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                </Button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    <p className="text-muted-foreground font-medium">Loading financial records...</p>
                </div>
            ) : (
                <Card className="glass border-white/10 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Invoice ID</th>
                                    <th className="px-6 py-4 font-bold">Student</th>
                                    <th className="px-6 py-4 font-bold">Amount</th>
                                    <th className="px-6 py-4 font-bold">Due Date</th>
                                    <th className="px-6 py-4 font-bold">Status</th>
                                    <th className="px-6 py-4 text-right font-bold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredInvoices.length > 0 ? filteredInvoices.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 font-mono text-xs">{inv.id.split('-')[0].toUpperCase()}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium">{inv.student?.user?.firstName} {inv.student?.user?.lastName}</div>
                                            <div className="text-xs text-muted-foreground">{inv.student?.enrollmentNo}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold">${inv.amount.toLocaleString()}</div>
                                            {inv.discount > 0 && <div className="text-[10px] text-green-500">-${inv.discount} discount</div>}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {new Date(inv.dueDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(inv.status)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                Record Payment
                                            </Button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                            {searchQuery ? "No invoices match your search." : "No financial records found."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    );
}
