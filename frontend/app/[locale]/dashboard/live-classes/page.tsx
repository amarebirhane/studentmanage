'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { resourceService, Resource } from '@/services/resource.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Video, Calendar, Clock, Plus, Trash2, ExternalLink, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

export default function LiveClassesPage() {
    const { user } = useAuth();
    const [classes, setClasses] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [creating, setCreating] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        url: '', // Zoom/Meet Link
        scheduledAt: '', // We use description to store schedule for now or create a robust way
        subjectId: '',
        classId: ''
    });

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            // Filter by type LIVE_CLASS
            const allResources = await resourceService.getAll();
            const liveClasses = allResources.filter((res: Resource) => res.type === 'LIVE_CLASS');
            setClasses(liveClasses);
        } catch (error) {
            toast.error('Failed to load live classes');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);

        try {
            await resourceService.create({
                ...formData,
                type: 'LIVE_CLASS',
                description: `${formData.scheduledAt} - ${formData.description}`
            });

            toast.success('Live class scheduled');
            setIsCreateOpen(false);
            setFormData({ title: '', description: '', url: '', scheduledAt: '', subjectId: '', classId: '' });
            fetchClasses();
        } catch (error) {
            toast.error('Failed to schedule class');
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Cancel this class?')) return;
        try {
            await resourceService.delete(id);
            toast.success('Class cancelled');
            fetchClasses();
        } catch (error) {
            toast.error('Failed to cancel class');
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
                        Live Classes
                    </h1>
                    <p className="text-muted-foreground mt-1">Join virtual classrooms and webinars.</p>
                </div>

                {(user?.role === 'ADMIN' || user?.role === 'TEACHER') && (
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20">
                                <Plus className="h-4 w-4 mr-2" /> Schedule Class
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] glass-card border-white/10">
                            <DialogHeader>
                                <DialogTitle>Schedule Live Class</DialogTitle>
                                <DialogDescription>Create a meeting link for your students.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g. Weekly Math Review"
                                        className="bg-secondary/50 border-white/10"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Meeting URL (Zoom/Meet)</Label>
                                    <Input
                                        required
                                        value={formData.url}
                                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                        placeholder="https://meet.google.com/..."
                                        className="bg-secondary/50 border-white/10"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Schedule & Notes</Label>
                                    <Input
                                        required
                                        value={formData.scheduledAt}
                                        onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                                        placeholder="e.g. Tomorrow at 10:00 AM"
                                        className="bg-secondary/50 border-white/10"
                                    />
                                </div>

                                <DialogFooter className="pt-4">
                                    <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                                    <Button type="submit" disabled={creating} className="bg-red-600 hover:bg-red-700">
                                        {creating ? 'Scheduling...' : 'Schedule Class'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {/* Live Class Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 rounded-xl bg-secondary/30 animate-pulse" />
                    ))}
                </div>
            ) : classes.length === 0 ? (
                <div className="text-center py-20 opacity-50">
                    <Video className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                    <h3 className="text-lg font-medium">No live classes scheduled</h3>
                    <p>Check back later for upcoming sessions.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map((cls) => (
                        <Card key={cls.id} className="glass-card border-none overflow-hidden relative group hover:ring-1 hover:ring-red-500/30 transition-all">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500" />
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="p-3 rounded-full bg-red-500/10 text-red-500 mb-2">
                                        <Video className="h-6 w-6" />
                                    </div>
                                    {(user?.role === 'ADMIN' || user?.role === 'TEACHER') && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => handleDelete(cls.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                                <CardTitle className="text-xl">{cls.title}</CardTitle>
                                <CardDescription className="flex items-center gap-2 mt-2">
                                    <Clock className="h-4 w-4" />
                                    {cls.description}
                                </CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <Button
                                    className="w-full gap-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-lg shadow-red-500/20"
                                    onClick={() => window.open(cls.url, '_blank')}
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    Join Class
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
