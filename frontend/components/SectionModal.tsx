'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { classService } from '@/services/class.service';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

interface SectionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    classId: string;
    className: string;
    editData?: any;
}

export default function SectionModal({
    open,
    onOpenChange,
    onSuccess,
    classId,
    className,
    editData,
}: SectionModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
    });

    useEffect(() => {
        if (editData) {
            setFormData({
                name: editData.name || '',
            });
        } else {
            setFormData({
                name: '',
            });
        }
    }, [editData, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editData?.id) {
                // Assuming there's an updateSection if needed, but for now we focus on Add Section
                // If updateSection doesn't exist in service, we might need to add it or skip edit for sections
                toast.error('Section update not implemented in service');
            } else {
                await classService.createSection({
                    name: formData.name,
                    classId: classId,
                });
                toast.success('Section added successfully');
            }
            onSuccess();
            onOpenChange(false);
        } catch (error: any) {
            console.error('Operation failed:', error);
            toast.error(error.response?.data?.message || 'Failed to save section');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] glass border-white/10">
                <DialogHeader>
                    <DialogTitle>
                        {editData ? 'Edit Section' : `Add Section to ${className}`}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="sectionName">Section Name</Label>
                        <Input
                            id="sectionName"
                            placeholder="e.g. A, B, North, South"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="glass border-white/10"
                            required
                        />
                    </div>
                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="hover:bg-white/5"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/20"
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editData ? 'Save Changes' : 'Add Section'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
