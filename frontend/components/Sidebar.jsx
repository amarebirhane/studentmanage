'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, UserPlus } from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();
  const { isAdmin, isTeacher } = useAuth();

  const navItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      show: true,
    },
    {
      title: 'Students',
      href: '/dashboard/students',
      icon: Users,
      show: isTeacher,
    },
    ...(isAdmin
      ? [
          {
            title: 'Add Student',
            href: '/dashboard/students/add',
            icon: UserPlus,
            show: true,
          },
        ]
      : []),
  ];

  return (
    <aside className="w-64 bg-card border-r min-h-screen p-4">
      <nav className="space-y-2">
        {navItems
          .filter((item) => item.show)
          .map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            );
          })}
      </nav>
    </aside>
  );
};

export default Sidebar;

