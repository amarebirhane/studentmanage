'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Users,
    UserPlus,
    GraduationCap,
    Settings,
    Calendar,
    BookOpen,
    ClipboardList,
    ShieldCheck,
    LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const { isSuperAdmin, isAdmin, isTeacher, isStudent, isAccountant } = useRole({ userRole: user?.role as any });

    const menuGroups = [
        {
            label: 'Main Menu',
            items: [
                {
                    title: 'System Overview',
                    href: '/dashboard/superadmin',
                    icon: ShieldCheck,
                    show: isSuperAdmin,
                },
                {
                    title: 'Dashboard',
                    href: user?.role ? `/dashboard/${user.role.toLowerCase()}` : '/dashboard/admin',
                    icon: LayoutDashboard,
                    show: !isSuperAdmin,
                },
            ]
        },
        {
            label: 'Platform Management',
            items: [
                {
                    title: 'Schools',
                    href: '/dashboard/schools',
                    icon: GraduationCap,
                    show: isSuperAdmin,
                },
                {
                    title: 'Global Analytics',
                    href: '/dashboard/analytics',
                    icon: ClipboardList,
                    show: isSuperAdmin,
                },
            ]
        },
        {
            label: 'Academic Management',
            items: [
                {
                    title: 'Students',
                    href: '/dashboard/admin/students',
                    icon: Users,
                    show: isTeacher || isAdmin,
                },
                {
                    title: 'Parents',
                    href: '/dashboard/admin/parents',
                    icon: Users,
                    show: isTeacher || isAdmin,
                },
                {
                    title: 'Classes',
                    href: '/dashboard/admin/classes',
                    icon: GraduationCap,
                    show: isTeacher || isAdmin,
                },
                {
                    title: 'Attendance',
                    href: '/dashboard/attendance',
                    icon: Calendar,
                    show: isTeacher || isAdmin || isStudent,
                },
            ]
        },
        {
            label: 'Financial Management',
            items: [
                {
                    title: 'Fee Invoices',
                    href: '/dashboard/admin/fees',
                    icon: ClipboardList,
                    show: isAdmin || isAccountant,
                },
                {
                    title: 'Reports',
                    href: '/dashboard/admin/reports',
                    icon: BookOpen,
                    show: isAdmin || isAccountant,
                },
            ]
        },
        ...(isAdmin ? [{
            label: 'Administrative',
            items: [
                {
                    title: 'Teachers',
                    href: '/dashboard/admin/teachers',
                    icon: Users,
                    show: true,
                },
            ]
        }] : []),
        {
            label: 'System',
            items: [
                {
                    title: 'Settings',
                    href: '/dashboard/settings',
                    icon: Settings,
                    show: true,
                },
            ]
        }
    ];

    return (
        <aside className="w-72 glass border-r border-white/10 min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-50">
            <div className="h-20 flex items-center px-8 mb-6 border-b border-white/5">
                <div className="flex items-center space-x-3">
                    <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
                        <GraduationCap className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        EduSmart
                    </span>
                </div>
            </div>

            <nav className="flex-1 space-y-8 overflow-y-auto px-4 custom-scrollbar pb-10">
                {menuGroups.map((group, idx) => {
                    const visibleItems = group.items.filter(item => item.show);
                    if (visibleItems.length === 0) return null;

                    return (
                        <div key={idx} className="space-y-3">
                            <h3 className="px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-60">
                                {group.label}
                            </h3>
                            <div className="space-y-1">
                                {visibleItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group',
                                                isActive
                                                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 translate-x-1'
                                                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground hover:translate-x-1'
                                            )}
                                        >
                                            <Icon className={cn(
                                                "h-5 w-5 transition-all duration-300",
                                                isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
                                            )} />
                                            <span className="font-medium text-sm">{item.title}</span>
                                            {isActive && (
                                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse" />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/5 bg-black/5">
                <div className="glass-card bg-secondary/30 border-none p-4 rounded-2xl">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                            <span className="font-bold text-primary">{user?.firstName?.[0]}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate leading-none mb-1">{user?.firstName} {user?.lastName}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{user?.role}</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-xs font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg group transition-all"
                        onClick={() => logout()}
                    >
                        <LogOut className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                        Sign Out
                    </Button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
