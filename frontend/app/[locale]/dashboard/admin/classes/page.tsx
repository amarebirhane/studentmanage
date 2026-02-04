'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Search, Plus, Loader2, Users, Layout, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { classService } from "@/services/class.service";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";

export default function ClassesPage() {
    const router = useRouter();
    const [classes, setClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const data = await classService.getClasses();
            setClasses(data || []);
        } catch (error) {
            console.error('Failed to fetch classes:', error);
            toast.error('Failed to load academic structures');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, type: 'class' | 'section') => {
        if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

        try {
            if (type === 'class') {
                await classService.deleteClass(id);
            } else {
                await classService.deleteSection(id);
            }
            toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
            fetchClasses();
        } catch (error) {
            toast.error(`Failed to delete ${type}`);
        }
    };

    const filteredClasses = classes.filter(cls =>
        cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.grade?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Academic Management</h1>
                    <p className="text-muted-foreground">Define grade levels, sections, and curriculum tracks.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="glass border-white/10">
                        <Layout className="h-4 w-4 mr-2" />
                        Manage Sections
                    </Button>
                    <Button
                        onClick={() => router.push('/dashboard/admin/classes/new')}
                        className="glass bg-primary/20 hover:bg-primary/30 text-primary border-primary/20"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Class
                    </Button>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by class name or grade..."
                        className="pl-10 glass border-white/10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    <p className="text-muted-foreground font-medium">Loading classes...</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {filteredClasses.length > 0 ? filteredClasses.map((cls) => (
                        <Card key={cls.id} className="glass border-white/10 overflow-hidden group hover:border-primary/30 transition-colors">
                            <CardContent className="p-0">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                                <GraduationCap className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold">{cls.name}</h3>
                                                <div className="flex items-center text-xs text-muted-foreground">
                                                    <span className="font-medium mr-2">Grade: {cls.grade}</span>
                                                    <span>•</span>
                                                    <span className="ml-2">{cls._count?.students || 0} Students total</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(cls.id, 'class')}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {cls.sections?.length > 0 ? cls.sections.map((section: any) => (
                                            <div key={section.id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group/section hover:bg-white/10 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-lg bg-secondary/50 flex items-center justify-center text-xs font-bold text-primary">
                                                        {section.name}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold">Section {section.name}</p>
                                                        <div className="flex items-center text-[10px] text-muted-foreground">
                                                            <Users className="h-3 w-3 mr-1" />
                                                            {section._count?.students || 0} Students
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-section/hover:opacity-100" onClick={() => handleDelete(section.id, 'section')}>
                                                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                                </Button>
                                            </div>
                                        )) : (
                                            <div className="p-4 rounded-xl bg-dashed border border-white/10 flex items-center justify-center text-xs text-muted-foreground italic">
                                                No sections defined
                                            </div>
                                        )}
                                        <Button variant="outline" className="h-full border-dashed border-white/10 hover:bg-white/5 text-xs text-muted-foreground py-4">
                                            <Plus className="h-3 w-3 mr-1" /> Add Section
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )) : (
                        <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
                            <p className="text-muted-foreground font-medium">No classes found.</p>
                            <p className="text-xs text-muted-foreground mt-1">Try refining your search or add a new academic class.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
