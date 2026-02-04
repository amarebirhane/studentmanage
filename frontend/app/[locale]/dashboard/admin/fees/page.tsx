'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Banknote,
    Search,
    Filter,
    Plus,
    Loader2,
    CreditCard,
    Clock,
    CheckCircle2,
    AlertCircle,
    MoreVertical,
    Calendar,
    DollarSign,
    FileText,
    User,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { feeService } from "@/services/fee.service";
import { studentService } from "@/services/student.service";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export default function FeesPage() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal states
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
    const [submitting, setSubmitting] = useState(false);

    // Form states
    const [invoiceData, setInvoiceData] = useState({
        studentId: "",
        amount: "",
        dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString().split('T')[0],
        description: "",
        discount: "0"
    });

    const [paymentData, setPaymentData] = useState({
        amount: "",
        method: "Cash",
        reference: ""
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [invoicesRes, studentsRes] = await Promise.all([
                feeService.getFees(),
                studentService.getStudents({ limit: 1000 })
            ]);
            setInvoices(invoicesRes || []);
            setStudents(studentsRes.data || []);
        } catch (error) {
            toast.error('Failed to load financial records');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateInvoice = async () => {
        if (!invoiceData.studentId || !invoiceData.amount) {
            toast.error('Please fill in required fields');
            return;
        }

        try {
            setSubmitting(true);
            await feeService.createFee({
                ...invoiceData,
                amount: parseFloat(invoiceData.amount),
                discount: parseFloat(invoiceData.discount || "0"),
                dueDate: new Date(invoiceData.dueDate)
            });
            toast.success('Invoice created successfully');
            setIsInvoiceModalOpen(false);
            fetchInitialData();
        } catch (error) {
            toast.error('Failed to create invoice');
        } finally {
            setSubmitting(false);
        }
    };

    const handleRecordPayment = async () => {
        if (!paymentData.amount || !selectedInvoice) return;

        try {
            setSubmitting(true);
            await feeService.recordPayment(selectedInvoice.id, {
                amount: parseFloat(paymentData.amount),
                method: paymentData.method,
                reference: paymentData.reference
            });
            toast.success('Payment recorded successfully');
            setIsPaymentModalOpen(false);
            fetchInitialData();
        } catch (error) {
            toast.error('Failed to record payment');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PAID':
                return <Badge className="bg-green-500/10 text-green-500 border-green-500/20"><CheckCircle2 className="h-3 w-3 mr-1" /> Paid</Badge>;
            case 'PENDING':
                return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
            case 'OVERDUE':
                return <Badge className="bg-red-500/10 text-red-500 border-red-500/20"><AlertCircle className="h-3 w-3 mr-1" /> Overdue</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const filteredInvoices = invoices.filter(inv =>
        inv.student?.user?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.student?.user?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalCollected = invoices.filter(i => i.status === 'PAID').reduce((sum, i) => sum + i.amount, 0);
    const outstanding = invoices.filter(i => i.status !== 'PAID').reduce((sum, i) => sum + i.amount, 0);

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Fee Management</h1>
                    <p className="text-muted-foreground mt-1">Track payments, create invoices, and manage school finances.</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        onClick={() => setIsInvoiceModalOpen(true)}
                        className="shadow-lg shadow-primary/20 gap-2"
                    >
                        <Plus className="h-4 w-4" /> Create Invoice
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-card border-none bg-primary/5">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                <DollarSign className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Collected</p>
                                <p className="text-3xl font-bold">${totalCollected.toLocaleString()}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass-card border-none bg-orange-500/5">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                                <Clock className="h-6 w-6 text-orange-500" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Outstanding</p>
                                <p className="text-3xl font-bold">${outstanding.toLocaleString()}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass-card border-none">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                <FileText className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Invoices</p>
                                <p className="text-3xl font-bold">{invoices.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="glass-card border-none overflow-hidden">
                <CardHeader className="bg-white/5 border-b border-white/5 px-6 py-4">
                    <div className="flex items-center justify-between gap-4">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Banknote className="h-5 w-5 text-primary" /> Recent Invoices
                        </CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search student or ID..."
                                className="pl-9 glass border-white/10 h-9 text-xs"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 border-b border-white/5">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest opacity-50">Invoice ID</th>
                                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest opacity-50">Student</th>
                                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest opacity-50">Amount</th>
                                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest opacity-50">Due Date</th>
                                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest opacity-50">Status</th>
                                    <th className="px-6 py-4 text-right font-bold text-xs uppercase tracking-widest opacity-50">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto" />
                                            <p className="text-xs text-muted-foreground mt-4 uppercase tracking-widest">Loading records...</p>
                                        </td>
                                    </tr>
                                ) : filteredInvoices.length > 0 ? filteredInvoices.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 font-mono text-[10px] uppercase">{inv.id.split('-')[0]}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold">{inv.student?.user?.firstName} {inv.student?.user?.lastName}</div>
                                            <div className="text-[10px] text-muted-foreground uppercase opacity-70">{inv.student?.enrollmentNo}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-base">${inv.amount.toLocaleString()}</div>
                                            {inv.discount > 0 && <div className="text-[10px] text-green-500 font-bold">-{inv.discount} DISCOUNT</div>}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground text-xs">
                                            {new Date(inv.dueDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(inv.status)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {inv.status !== 'PAID' ? (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="hover:bg-primary/10 hover:text-primary rounded-xl px-4"
                                                    onClick={() => {
                                                        setSelectedInvoice(inv);
                                                        setPaymentData(prev => ({ ...prev, amount: inv.amount.toString() }));
                                                        setIsPaymentModalOpen(true);
                                                    }}
                                                >
                                                    Record Payment
                                                </Button>
                                            ) : (
                                                <Button variant="ghost" size="sm" className="opacity-30 cursor-not-allowed">
                                                    Paid in Full
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-20 text-center opacity-50">
                                            <Banknote className="h-10 w-10 mx-auto mb-4 opacity-20" />
                                            <p className="text-sm italic font-medium">No records found matching your criteria.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Create Invoice Modal */}
            <Dialog open={isInvoiceModalOpen} onOpenChange={setIsInvoiceModalOpen}>
                <DialogContent className="glass-card border-none sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            <Plus className="h-6 w-6 text-primary" /> Create New Invoice
                        </DialogTitle>
                        <DialogDescription>Issue a new fee invoice to a student.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4 tracking-tight">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Select Student</Label>
                            <Select
                                value={invoiceData.studentId}
                                onValueChange={(val) => setInvoiceData(prev => ({ ...prev, studentId: val }))}
                            >
                                <SelectTrigger className="glass border-white/10 h-11">
                                    <SelectValue placeholder="Choose student" />
                                </SelectTrigger>
                                <SelectContent className="max-h-60">
                                    {students.map(s => (
                                        <SelectItem key={s.id} value={s.id}>
                                            {s.user?.firstName} {s.user?.lastName} ({s.class?.name || 'No Class'})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Total Amount ($)</Label>
                                <Input
                                    type="number"
                                    className="glass border-white/10 h-11"
                                    placeholder="0.00"
                                    value={invoiceData.amount}
                                    onChange={(e) => setInvoiceData(prev => ({ ...prev, amount: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Discount ($)</Label>
                                <Input
                                    type="number"
                                    className="glass border-white/10 h-11"
                                    placeholder="0.00"
                                    value={invoiceData.discount}
                                    onChange={(e) => setInvoiceData(prev => ({ ...prev, discount: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Due Date</Label>
                            <Input
                                type="date"
                                className="glass border-white/10 h-11"
                                value={invoiceData.dueDate}
                                onChange={(e) => setInvoiceData(prev => ({ ...prev, dueDate: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Description / Note</Label>
                            <Textarea
                                className="glass border-white/10 min-h-[100px]"
                                placeholder="e.g. Tuition Fee Q1, Library Dues..."
                                value={invoiceData.description}
                                onChange={(e) => setInvoiceData(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="ghost" onClick={() => setIsInvoiceModalOpen(false)} className="hover:bg-white/5">Cancel</Button>
                        <Button
                            onClick={handleCreateInvoice}
                            disabled={submitting}
                            className="shadow-lg shadow-primary/20 min-w-[120px]"
                        >
                            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate Invoice"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Record Payment Modal */}
            <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
                <DialogContent className="glass-card border-none sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            <CreditCard className="h-6 w-6 text-primary" /> Record Payment
                        </DialogTitle>
                        <DialogDescription>Apply a payment to invoice #{selectedInvoice?.id?.split('-')[0].toUpperCase()}</DialogDescription>
                    </DialogHeader>
                    {selectedInvoice && (
                        <div className="space-y-6 py-4">
                            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Student</p>
                                    <p className="font-bold">{selectedInvoice.student?.user?.firstName} {selectedInvoice.student?.user?.lastName}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Balance</p>
                                    <p className="font-bold text-primary text-xl">${selectedInvoice.amount.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Payment Amount ($)</Label>
                                    <Input
                                        type="number"
                                        className="glass border-white/10 h-11 text-lg font-bold"
                                        value={paymentData.amount}
                                        onChange={(e) => setPaymentData(prev => ({ ...prev, amount: e.target.value }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Payment Method</Label>
                                    <Select
                                        value={paymentData.method}
                                        onValueChange={(val) => setPaymentData(prev => ({ ...prev, method: val }))}
                                    >
                                        <SelectTrigger className="glass border-white/10 h-11">
                                            <SelectValue placeholder="Choose method" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Cash">Cash</SelectItem>
                                            <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                            <SelectItem value="Credit Card">Credit Card</SelectItem>
                                            <SelectItem value="Check">Check</SelectItem>
                                            <SelectItem value="Scholarship Application">Scholarship Offset</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Reference Number / Note</Label>
                                    <Input
                                        className="glass border-white/10 h-11"
                                        placeholder="Transaction ID, Receipt #..."
                                        value={paymentData.reference}
                                        onChange={(e) => setPaymentData(prev => ({ ...prev, reference: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter className="gap-2">
                        <Button variant="ghost" onClick={() => setIsPaymentModalOpen(false)} className="hover:bg-white/5">Cancel</Button>
                        <Button
                            onClick={handleRecordPayment}
                            disabled={submitting}
                            className="shadow-lg shadow-primary/20 min-w-[140px]"
                        >
                            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Payment"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
