'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Bell,
    Plus,
    Loader2,
    Calendar,
    User,
    Tag,
    Trash2,
    Megaphone
} from 'lucide-react';
import { announcementService } from '@/services/announcement.service';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useRole } from '@/hooks/useRole';
import { useAuth } from '@/hooks/useAuth';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';

export default function AnnouncementsPage() {
    const { user } = useAuth();
    const { isAdmin, isTeacher, isSuperAdmin } = useRole({ userRole: user?.role as any });
    const canCreate = isAdmin || isTeacher || isSuperAdmin;

    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [announcementToDelete, setAnnouncementToDelete] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        target: 'ALL' // ALL, TEACHERS, STUDENTS, PARENTS
    });

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const data = await announcementService.getAnnouncements();
            setAnnouncements(data || []);
        } catch (error) {
            toast.error('Failed to load announcements');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!formData.title || !formData.content) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            setSubmitting(true);
            await announcementService.createAnnouncement(formData);
            toast.success('Announcement posted successfully');
            setIsCreateModalOpen(false);
            setFormData({ title: '', content: '', target: 'ALL' });
            fetchAnnouncements();
        } catch (error) {
            toast.error('Failed to post announcement');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        setAnnouncementToDelete(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!announcementToDelete) return;
        try {
            await announcementService.deleteAnnouncement(announcementToDelete);
            toast.success('Announcement deleted');
            setAnnouncements(prev => prev.filter(a => a.id !== announcementToDelete));
        } catch (error) {
            toast.error('Failed to delete announcement');
        } finally {
            setAnnouncementToDelete(null);
        }
    };

    const getTargetBadge = (target: string) => {
        switch (target) {
            case 'ALL': return <Badge variant="secondary">Everyone</Badge>;
            case 'TEACHERS': return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20">Teachers Only</Badge>;
            case 'STUDENTS': return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">Students Only</Badge>;
            case 'PARENTS': return <Badge className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20">Parents Only</Badge>;
            default: return <Badge variant="outline">{target}</Badge>;
        }
    };

    return (
        <div className="p-6 space-y-8 max-w-5xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
                    <p className="text-muted-foreground mt-1">Stay updated with the latest school news and notices.</p>
                </div>
                {canCreate && (
                    <Button onClick={() => setIsCreateModalOpen(true)} className="shadow-lg shadow-primary/20 gap-2">
                        <Plus className="h-4 w-4" /> Post Announcement
                    </Button>
                )}
            </div>

            <div className="space-y-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">Loading announcements...</p>
                    </div>
                ) : announcements.length > 0 ? (
                    announcements.map((announcement) => (
                        <Card key={announcement.id} className="glass-card border-none overflow-hidden hover:shadow-md transition-all">
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="space-y-1">
                                        <CardTitle className="text-xl flex items-center gap-2">
                                            {announcement.title}
                                            {getTargetBadge(announcement.target)}
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-3 text-xs">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {format(new Date(announcement.createdAt), 'PPP')}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                Admin
                                            </span>
                                        </CardDescription>
                                    </div>
                                    {canCreate && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => handleDelete(announcement.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                                    {announcement.content}
                                </p>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card className="glass-card border-none p-12 text-center text-muted-foreground">
                        <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>No announcements found.</p>
                    </Card>
                )}
            </div>

            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="glass-card border-none sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Post New Announcement</DialogTitle>
                        <DialogDescription>Share updates with the school community.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                                placeholder="Announcement Title"
                                className="glass border-white/10"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Target Audience</Label>
                            <Select
                                value={formData.target}
                                onValueChange={(val) => setFormData(prev => ({ ...prev, target: val }))}
                            >
                                <SelectTrigger className="glass border-white/10">
                                    <SelectValue placeholder="Select Audience" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">Everyone</SelectItem>
                                    <SelectItem value="TEACHERS">Teachers Only</SelectItem>
                                    <SelectItem value="STUDENTS">Students Only</SelectItem>
                                    <SelectItem value="PARENTS">Parents Only</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Content</Label>
                            <Textarea
                                placeholder="Type your announcement here..."
                                className="glass border-white/10 min-h-[150px]"
                                value={formData.content}
                                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreate} disabled={submitting}>
                            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Post Announcement'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={confirmDelete}
                title="Delete Announcement"
                description="Are you sure you want to delete this announcement? This action cannot be undone."
            />
        </div>
    );
}
