'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
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
  ShieldCheck
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();
  const { isAdmin, isTeacher, isStudent, user } = useAuth();

  const menuGroups = [
    {
      label: 'Main',
      items: [
        {
          title: 'Dashboard',
          href: '/dashboard',
          icon: LayoutDashboard,
          show: true,
        },
      ]
    },
    {
      label: 'Academic',
      items: [
        {
          title: 'Students',
          href: '/dashboard/students',
          icon: Users,
          show: isTeacher || isAdmin,
        },
        {
          title: 'Classes',
          href: '/dashboard/classes',
          icon: GraduationCap,
          show: isTeacher || isAdmin,
        },
        {
          title: 'Courses',
          href: '/dashboard/courses',
          icon: BookOpen,
          show: true,
        },
        {
          title: 'Attendance',
          href: '/dashboard/attendance',
          icon: Calendar,
          show: isTeacher || isAdmin || isStudent,
        },
      ]
    },
    ...(isAdmin ? [{
      label: 'Administration',
      items: [
        {
          title: 'User Management',
          href: '/dashboard/users',
          icon: ShieldCheck,
          show: true,
        },
        {
          title: 'Add Student',
          href: '/dashboard/students/add',
          icon: UserPlus,
          show: true,
        },
        {
          title: 'Reports',
          href: '/dashboard/reports',
          icon: ClipboardList,
          show: true,
        },
      ]
    }] : []),
    {
      label: 'Other',
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
    <aside className="w-64 glass border-r min-h-screen flex flex-col p-4 z-50">
      <div className="flex items-center space-x-3 px-4 mb-8">
        <div className="bg-primary p-2 rounded-lg">
          <GraduationCap className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="font-bold text-xl tracking-tight">EduSmart</span>
      </div>

      <nav className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
        {menuGroups.map((group, idx) => {
          const visibleItems = group.items.filter(item => item.show);
          if (visibleItems.length === 0) return null;

          return (
            <div key={idx} className="space-y-2">
              <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
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
                        'flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 group',
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      )}
                    >
                      <Icon className={cn(
                        "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                        isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground"
                      )} />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="mt-auto p-4 glass-card bg-secondary/50 border-none">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
            <span className="font-bold text-primary">{user?.firstName?.[0] || user?.name?.[0]}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

