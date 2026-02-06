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

interface ClassModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    editData?: any;
}

export default function ClassModal({
    open,
    onOpenChange,
    onSuccess,
    editData,
}: ClassModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        grade: '',
    });

    useEffect(() => {
        if (editData) {
            setFormData({
                name: editData.name || '',
                grade: editData.grade || '',
            });
        } else {
            setFormData({
                name: '',
                grade: '',
            });
        }
    }, [editData, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editData?.id) {
                await classService.updateClass(editData.id, formData);
                toast.success('Class updated successfully');
            } else {
                await classService.createClass(formData);
                toast.success('Class created successfully');
            }
            onSuccess();
            onOpenChange(false);
        } catch (error: any) {
            console.error('Operation failed:', error);
            toast.error(error.response?.data?.message || 'Failed to save class');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] glass border-white/10">
                <DialogHeader>
                    <DialogTitle>{editData ? 'Edit Class' : 'Add New Class'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Class Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g. Grade 10-A"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="glass border-white/10"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="grade">Grade / Level</Label>
                        <Input
                            id="grade"
                            placeholder="e.g. 10"
                            value={formData.grade}
                            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
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
                            {editData ? 'Save Changes' : 'Create Class'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
