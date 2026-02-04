'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { resourceService, Resource } from '@/services/resource.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, FileText, Video, Link as LinkIcon, Image as ImageIcon, Plus, Trash2, Search, Filter, Download, ExternalLink, GraduationCap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

export default function DigitalLibraryPage() {
    const { user } = useAuth();
    const [resources, setResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<string>('ALL');
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'PDF',
        url: '',
        subjectId: '',
        classId: ''
    });
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            const data = await resourceService.getAll();
            setResources(data);
        } catch (error) {
            toast.error('Failed to load resources');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            let fileUrl = formData.url;

            if (file) {
                // Upload file first
                const uploadedUrl = await resourceService.uploadFile(file);
                fileUrl = uploadedUrl;
            }

            await resourceService.create({
                ...formData,
                url: fileUrl
            });

            toast.success('Resource added successfully');
            setIsUploadOpen(false);
            setFormData({ title: '', description: '', type: 'PDF', url: '', subjectId: '', classId: '' });
            setFile(null);
            fetchResources();
        } catch (error) {
            toast.error('Failed to add resource');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this resource?')) return;
        try {
            await resourceService.delete(id);
            toast.success('Resource deleted');
            fetchResources();
        } catch (error) {
            toast.error('Failed to delete resource');
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'PDF': return <FileText className="h-5 w-5 text-red-500" />;
            case 'VIDEO': return <Video className="h-5 w-5 text-blue-500" />;
            case 'IMAGE': return <ImageIcon className="h-5 w-5 text-green-500" />;
            case 'LINK': return <LinkIcon className="h-5 w-5 text-orange-500" />;
            default: return <BookOpen className="h-5 w-5" />;
        }
    };

    const filteredResources = resources.filter(res => {
        const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            res.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = selectedType === 'ALL' || res.type === selectedType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                        Digital Library
                    </h1>
                    <p className="text-muted-foreground mt-1">Access study materials, videos, and resources.</p>
                </div>

                {(user?.role === 'ADMIN' || user?.role === 'TEACHER') && (
                    <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-primary/20 transition-all">
                                <Plus className="h-4 w-4 mr-2" /> Upload Resource
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] glass-card border-white/10">
                            <DialogHeader>
                                <DialogTitle>Add New Resource</DialogTitle>
                                <DialogDescription>Share learning materials with students.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g. Chapter 1: Introduction to Physics"
                                        className="bg-secondary/50 border-white/10"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Input
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Brief description of the content"
                                        className="bg-secondary/50 border-white/10"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Type</Label>
                                        <Select
                                            value={formData.type}
                                            onValueChange={(val) => setFormData({ ...formData, type: val })}
                                        >
                                            <SelectTrigger className="bg-secondary/50 border-white/10">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="PDF">PDF Document</SelectItem>
                                                <SelectItem value="VIDEO">Video</SelectItem>
                                                <SelectItem value="IMAGE">Image</SelectItem>
                                                <SelectItem value="LINK">External Link</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {formData.type === 'LINK' ? (
                                        <div className="space-y-2">
                                            <Label>URL</Label>
                                            <Input
                                                required
                                                value={formData.url}
                                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                                placeholder="https://..."
                                                className="bg-secondary/50 border-white/10"
                                            />
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <Label>File</Label>
                                            <Input
                                                type="file"
                                                required={!formData.url}
                                                onChange={handleFileChange}
                                                className="bg-secondary/50 border-white/10 cursor-pointer"
                                            />
                                        </div>
                                    )}
                                </div>

                                <DialogFooter className="pt-4">
                                    <Button type="button" variant="ghost" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
                                    <Button type="submit" disabled={uploading}>
                                        {uploading ? 'Uploading...' : 'Add Resource'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {/* Filters */}
            <div className="glass-card p-4 rounded-xl border border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search resources..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-secondary/30 border-white/5 focus:bg-secondary/50 transition-colors"
                    />
                </div>

                <Tabs value={selectedType} onValueChange={setSelectedType} className="w-full md:w-auto">
                    <TabsList className="bg-secondary/30">
                        <TabsTrigger value="ALL">All</TabsTrigger>
                        <TabsTrigger value="PDF">PDFs</TabsTrigger>
                        <TabsTrigger value="VIDEO">Videos</TabsTrigger>
                        <TabsTrigger value="LINK">Links</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Resource Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-48 rounded-xl bg-secondary/30 animate-pulse" />
                    ))}
                </div>
            ) : filteredResources.length === 0 ? (
                <div className="text-center py-20 opacity-50">
                    <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                    <h3 className="text-lg font-medium">No resources found</h3>
                    <p>Try adjusting your search or filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredResources.map((resource) => (
                        <Card key={resource.id} className="glass-card border-none group hover:bg-secondary/40 transition-all duration-300 hover:-translate-y-1">
                            <CardHeader className="relative pb-2">
                                <div className="flex justify-between items-start">
                                    <div className="p-2 rounded-lg bg-background/50 backdrop-blur-sm border border-white/10">
                                        {getIcon(resource.type)}
                                    </div>
                                    {(user?.role === 'ADMIN' || user?.role === 'TEACHER') && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => handleDelete(resource.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                                <div className="pt-4">
                                    <CardTitle className="text-base line-clamp-1 group-hover:text-primary transition-colors">
                                        {resource.title}
                                    </CardTitle>
                                    <CardDescription className="line-clamp-2 text-xs mt-1">
                                        {resource.description || 'No description provided.'}
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0 pb-4">
                                <div className="flex justify-between items-center text-[10px] text-muted-foreground mb-4">
                                    <span>{format(new Date(resource.createdAt), 'MMM d, yyyy')}</span>
                                    <span className="flex items-center gap-1">
                                        <GraduationCap className="h-3 w-3" />
                                        {resource.uploadedBy?.firstName}
                                    </span>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full text-xs gap-2 border-white/10 hover:bg-primary hover:text-white hover:border-primary transition-colors"
                                    onClick={() => window.open(resource.url, '_blank')}
                                >
                                    {resource.type === 'LINK' || resource.type === 'VIDEO' ? (
                                        <>
                                            <ExternalLink className="h-3 w-3" /> Open Link
                                        </>
                                    ) : (
                                        <>
                                            <Download className="h-3 w-3" /> Download
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
