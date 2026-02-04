'use client';

import { useState, useEffect } from 'react';
import { expenseService, Expense } from '@/services/expense.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Edit, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { ColumnDef } from '@tanstack/react-table';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [summary, setSummary] = useState({ total: 0, thisMonth: 0, byCategory: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        amount: '',
        category: 'OTHER',
        description: '',
        date: format(new Date(), 'yyyy-MM-dd')
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [data, summaryData] = await Promise.all([
                expenseService.getAll(),
                expenseService.getSummary()
            ]);
            setExpenses(data);
            setSummary(summaryData);
        } catch (error) {
            toast.error('Failed to load expenses');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await expenseService.create({
                ...formData,
                amount: parseFloat(formData.amount)
            });
            toast.success('Expense recorded');
            setIsCreateOpen(false);
            setFormData({ amount: '', category: 'OTHER', description: '', date: format(new Date(), 'yyyy-MM-dd') });
            loadData();
        } catch (error) {
            toast.error('Failed to save expense');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        setExpenseToDelete(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!expenseToDelete) return;
        try {
            await expenseService.delete(expenseToDelete);
            toast.success('Expense deleted');
            loadData();
        } catch (error) {
            toast.error('Failed to delete expense');
        } finally {
            setExpenseToDelete(null);
        }
    };

    const columns: ColumnDef<Expense>[] = [
        {
            accessorKey: 'date',
            header: 'Date',
            cell: ({ row }) => format(new Date(row.original.date), 'MMM dd, yyyy')
        },
        {
            accessorKey: 'category',
            header: 'Category',
            cell: ({ row }) => <span className="font-medium text-xs bg-secondary px-2 py-1 rounded-full">{row.original.category}</span>
        },
        {
            accessorKey: 'description',
            header: 'Description',
        },
        {
            accessorKey: 'amount',
            header: 'Amount',
            cell: ({ row }) => <span className="text-red-500 font-bold">-${row.original.amount.toLocaleString()}</span>
        },
        {
            accessorKey: 'recordedBy',
            header: 'Recorded By',
            cell: ({ row }) => `${row.original.recordedBy?.firstName} ${row.original.recordedBy?.lastName}`
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <Button variant="ghost" size="icon" onClick={() => handleDelete(row.original.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
            )
        }
    ];

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Expense Tracking</h1>
                    <p className="text-muted-foreground">Monitor school expenditures and costs.</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-red-600 hover:bg-red-700 text-white gap-2 shadow-lg shadow-red-500/20">
                            <Plus className="h-4 w-4" /> Add Expense
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Record New Expense</DialogTitle>
                            <DialogDescription>Enter details of the expenditure.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Amount</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="number" step="0.01" required
                                            className="pl-9"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Date</Label>
                                    <Input
                                        type="date" required
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(val) => setFormData({ ...formData, category: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="SALARY">Salary</SelectItem>
                                        <SelectItem value="UTILITIES">Utilities</SelectItem>
                                        <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                                        <SelectItem value="EQUIPMENT">Equipment</SelectItem>
                                        <SelectItem value="EVENTS">Events</SelectItem>
                                        <SelectItem value="OTHER">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Input
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="e.g. Monthly Electricity Bill"
                                />
                            </div>

                            <DialogFooter className="pt-4">
                                <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={isSubmitting} className="bg-red-600 hover:bg-red-700">
                                    {isSubmitting ? 'Saving...' : 'Save Expense'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-card border-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                        <TrendingDown className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">${summary.total.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Lifetime expenditure</p>
                    </CardContent>
                </Card>
                <Card className="glass-card border-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Month</CardTitle>
                        <TrendingDown className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">${summary.thisMonth.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">{format(new Date(), 'MMMM yyyy')}</p>
                    </CardContent>
                </Card>
                <Card className="glass-card border-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Top Category</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {/* @ts-ignore */}
                            {summary.byCategory.length > 0 ? summary.byCategory.sort((a, b) => b._sum.amount - a._sum.amount)[0].category : 'N/A'}
                        </div>
                        <p className="text-xs text-muted-foreground">Highest spending area</p>
                    </CardContent>
                </Card>
            </div>

            {/* Expenses Table */}
            <Card className="glass-card border-none">
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>A list of all recorded expenses.</CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={expenses}
                        isLoading={isLoading}
                    />
                </CardContent>
            </Card>

            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={confirmDelete}
                title="Delete Expense"
                description="Are you sure you want to delete this expense record? This action cannot be undone."
            />
        </div>
    );
}
