'use client';

import { Link } from '@/navigation';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    Settings,
    Calendar,
    BookOpen,
    ClipboardList,
    ClipboardCheck,
    ShieldCheck,
    LogOut,
    BarChart3,
    CreditCard,
    UserPlus,
    Bell,
    MessageSquare,
    Clock,
    Video,
    DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

const Sidebar = () => {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const { isSuperAdmin, isAdmin, isTeacher, isStudent, isAccountant, isStaff, isParent } = useRole({ userRole: user?.role as any });
    const t = useTranslations('Sidebar');

    const getAvatarUrl = () => {
        if (user?.avatarUrl) {
            return user.avatarUrl.startsWith('http')
                ? user.avatarUrl
                : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}${user.avatarUrl}`;
        }
        return user?.email ? `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}` : '';
    };

    const menuGroups = [
        {
            label: t('systemDashboard'),
            items: [
                {
                    title: t('systemOverview'),
                    href: '/dashboard/super-admin',
                    icon: ShieldCheck,
                    show: isSuperAdmin,
                },
                {
                    title: t('myDashboard'),
                    href: user?.role ? `/dashboard/${user.role.toLowerCase()}` : '/dashboard/admin',
                    icon: LayoutDashboard,
                    show: !isSuperAdmin,
                },
            ]
        },
        {
            label: t('platformManagement'),
            items: [
                {
                    title: t('schools'),
                    href: '/dashboard/super-admin/schools',
                    icon: GraduationCap,
                    show: isSuperAdmin,
                },
                {
                    title: t('schoolAdmins'),
                    href: '/dashboard/super-admin/admins',
                    icon: UserPlus,
                    show: isSuperAdmin,
                },
                {
                    title: t('revenueTracking'),
                    href: '/dashboard/super-admin/revenue',
                    icon: DollarSign,
                    show: isSuperAdmin,
                },
                {
                    title: t('globalAnalytics'),
                    href: '/dashboard/super-admin/analytics',
                    icon: BarChart3,
                    show: isSuperAdmin,
                },
                {
                    title: t('subscriptions'),
                    href: '/dashboard/super-admin/subscriptions',
                    icon: CreditCard,
                    show: isSuperAdmin,
                },
                {
                    title: t('auditLogs'),
                    href: '/dashboard/super-admin/logs',
                    icon: ClipboardList,
                    show: isSuperAdmin,
                },
            ]
        },
        {
            label: t('academicManagement'),
            items: [
                {
                    title: t('students'),
                    href: (isAdmin || isStaff) ? '/dashboard/admin/students' : '/dashboard/teacher/students',
                    icon: Users,
                    show: (isTeacher || isAdmin || isStaff) && !isSuperAdmin,
                },
                {
                    title: t('myClasses'),
                    href: '/dashboard/teacher/classes',
                    icon: GraduationCap,
                    show: isTeacher && !isSuperAdmin,
                },
                {
                    title: t('parents'),
                    href: (isAdmin || isStaff) ? '/dashboard/admin/parents' : '/dashboard/teacher/parents',
                    icon: Users,
                    show: (isTeacher || isAdmin || isStaff) && !isSuperAdmin,
                },
                {
                    title: t('classes'),
                    href: '/dashboard/admin/classes',
                    icon: GraduationCap,
                    show: (isAdmin || isStaff) && !isSuperAdmin,
                },
                {
                    title: t('attendance'),
                    href: isStudent ? '/dashboard/student/attendance' : (isAdmin || isStaff || isTeacher) ? '/dashboard/attendance' : isParent ? '/dashboard/attendance' : '/dashboard/attendance',
                    icon: ClipboardCheck,
                    show: (isTeacher || isAdmin || isStudent || isStaff || isParent) && !isSuperAdmin,
                },
                {
                    title: t('timetable'),
                    href: isTeacher ? '/dashboard/teacher/timetable' : (isStudent || isStaff || isParent) ? '/dashboard/timetable' : '/dashboard/timetable',
                    icon: Clock,
                    show: (isTeacher || isStudent || isStaff || isParent) && !isSuperAdmin,
                },
                {
                    title: t('assignments'),
                    href: isTeacher ? '/dashboard/teacher/assignments' : '/dashboard/assignments',
                    icon: BookOpen,
                    show: (isTeacher || isStudent || isParent) && !isSuperAdmin,
                },
                {
                    title: t('examsResults'),
                    href: isTeacher ? '/dashboard/teacher/exams' : '/dashboard/exams',
                    icon: ClipboardList,
                    show: (isTeacher || isStudent || isParent) && !isSuperAdmin,
                },
                {
                    title: t('digitalLibrary'),
                    href: '/dashboard/resources',
                    icon: BookOpen,
                    show: !isSuperAdmin,
                },
            ]
        },
        {
            label: t('communication'),
            items: [
                {
                    title: t('announcements'),
                    href: '/dashboard/announcements',
                    icon: Bell,
                    show: !isSuperAdmin,
                },
                {
                    title: t('messages'),
                    href: '/dashboard/messages',
                    icon: MessageSquare,
                    show: !isSuperAdmin,
                },
                {
                    title: t('liveClasses'),
                    href: '/dashboard/live-classes',
                    icon: Video,
                    show: !isSuperAdmin,
                },
            ]
        },
        {
            label: t('financialManagement'),
            items: [
                {
                    title: t('feeManagement'),
                    href: '/dashboard/admin/fees',
                    icon: DollarSign,
                    show: (isAdmin || isAccountant) && !isSuperAdmin,
                },
                {
                    title: t('myFees'),
                    href: '/dashboard/student/fees',
                    icon: DollarSign,
                    show: (isStudent || isParent) && !isSuperAdmin,
                },
                {
                    title: t('reports'),
                    href: '/dashboard/admin/reports',
                    icon: BookOpen,
                    show: (isAdmin || isAccountant) && !isSuperAdmin,
                },
            ]
        },
        ...((isAdmin || isStaff) && !isSuperAdmin ? [{
            label: t('administrative'),
            items: [
                {
                    title: t('userManagement'),
                    href: '/dashboard/admin/users',
                    icon: Users,
                    show: isAdmin,
                },
                {
                    title: t('teachers'),
                    href: '/dashboard/admin/teachers',
                    icon: GraduationCap,
                    show: true,
                },
            ]
        }] : []),
        {
            label: t('system'),
            items: [
                {
                    title: t('settings'),
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
                                    // Check if pathname starts with the item href to handle nested routes and locale prefixes
                                    const isActive = pathname.startsWith(item.href);
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
                        <Avatar className="h-10 w-10 border border-primary/20 shrink-0 rounded-xl">
                            <AvatarImage src={getAvatarUrl()} alt={user?.firstName || 'User'} className="object-cover" />
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                {user?.firstName?.[0]}
                            </AvatarFallback>
                        </Avatar>
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
                        {t('signOut')}
                    </Button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
