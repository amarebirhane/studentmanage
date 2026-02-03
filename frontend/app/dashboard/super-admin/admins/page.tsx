import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Shield, Mail, Phone, School, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { platformService, PlatformAdmin } from "@/services/platform.service";
import { toast } from "react-hot-toast";

export default function SchoolAdminsPage() {
    const [admins, setAdmins] = useState<PlatformAdmin[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const data = await platformService.getAdmins();
            setAdmins(data);
        } catch (error) {
            console.error('Failed to fetch admins:', error);
            toast.error('Failed to load administrators');
        } finally {
            setLoading(false);
        }
    };

    const filteredAdmins = admins.filter(admin =>
        admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.school.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">School Administrators</h1>
                    <p className="text-muted-foreground">Manage administrative accounts for all school tenants.</p>
                </div>
                <Button className="glass bg-primary/20 hover:bg-primary/30 text-primary border-primary/20">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Administrator
                </Button>
            </div>

            <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search administrators..."
                        className="pl-10 glass border-white/10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="glass border-white/10">Filter</Button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    <p className="text-muted-foreground font-medium">Loading administrators...</p>
                </div>
            ) : filteredAdmins.length === 0 ? (
                <div className="text-center py-20 glass border-white/10 rounded-3xl">
                    <p className="text-muted-foreground">No administrators found.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {filteredAdmins.map((admin) => (
                        <Card key={admin.id} className="glass border-white/10 overflow-hidden group hover:border-primary/30 transition-colors">
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row md:items-center p-6 gap-6">
                                    <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                                        <Shield className="h-8 w-8 text-primary" />
                                    </div>

                                    <div className="flex-1 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold">{admin.name}</p>
                                            <div className="flex items-center text-xs text-muted-foreground">
                                                <Mail className="h-3 w-3 mr-1" />
                                                {admin.email}
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Education Center</p>
                                            <div className="flex items-center text-sm font-medium">
                                                <School className="h-4 w-4 mr-2 text-primary" />
                                                {admin.school}
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact</p>
                                            <div className="flex items-center text-xs">
                                                <Phone className="h-3 w-3 mr-1" />
                                                {admin.phone}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between md:justify-end gap-4">
                                            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${admin.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'
                                                }`}>
                                                {admin.status}
                                            </div>
                                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                Manage
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
