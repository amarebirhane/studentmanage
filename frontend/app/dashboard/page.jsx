'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import api from '@/lib/api';
import {
  Users,
  UserPlus,
  TrendingUp,
  Activity,
  Calendar,
  GraduationCap,
  ArrowRight,
  MoreVertical
} from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

const StatCard = ({ title, value, icon: Icon, description, trend, color }) => (
  <Card className="glass-card overflow-hidden">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <div className={cn("p-2 rounded-lg", color)}>
        <Icon className="h-4 w-4" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">
        {trend && <span className="text-emerald-500 font-medium">{trend}</span>} {description}
      </p>
    </CardContent>
  </Card>
);

export default function Dashboard() {
  const { user, isAdmin, isTeacher } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/students/stats');
      setStats(data);
    } catch (error) {
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground animate-pulse text-sm">Synchronizing your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 nebula-gradient p-2 rounded-3xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, <span className="text-foreground font-semibold">{user?.firstName}</span>. Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="glass gap-2">
            <Calendar className="h-4 w-4" />
            <span>Feb 01, 2026</span>
          </Button>
          {isAdmin && (
            <Link href="/dashboard/students/add">
              <Button className="shadow-lg shadow-primary/25 gap-2">
                <UserPlus className="h-4 w-4" />
                <span>Add Student</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 px-2">
        <StatCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          icon={Users}
          description="enrolled this session"
          trend="+12%"
          color="bg-blue-500/10 text-blue-500"
        />
        <StatCard
          title="Total Teachers"
          value={stats?.totalTeachers || 0}
          icon={GraduationCap}
          description="active faculty members"
          color="bg-purple-500/10 text-purple-500"
        />
        <StatCard
          title="Daily Attendance"
          value="94%"
          icon={Activity}
          description="average across all classes"
          trend="+2.4%"
          color="bg-emerald-500/10 text-emerald-500"
        />
        <StatCard
          title="Avg. Performance"
          value="B+"
          icon={TrendingUp}
          description="current semester average"
          trend="+5%"
          color="bg-amber-500/10 text-amber-500"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-7 px-2">
        <Card className="md:col-span-4 glass-card border-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Admissions</CardTitle>
              <CardDescription>Latest students to join the academy</CardDescription>
            </div>
            <Link href="/dashboard/students">
              <Button variant="ghost" size="sm" className="text-primary gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentAdmissions?.length > 0 ? (
                stats.recentAdmissions.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 bg-secondary/30 rounded-2xl hover:bg-secondary/50 transition-colors group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center border-2 border-primary/20 text-primary font-bold shadow-sm">
                        {student.user?.firstName?.[0]}
                      </div>
                      <div>
                        <p className="font-bold">{student.user?.firstName} {student.user?.lastName}</p>
                        <p className="text-xs text-muted-foreground font-medium">
                          {student.enrollmentNo || 'NO-ID'} • {student.class?.name || 'Unassigned'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex items-center space-x-4">
                      <div className="hidden sm:block">
                        <p className="text-sm font-semibold">{new Date(student.createdAt).toLocaleDateString()}</p>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Joined</p>
                      </div>
                      <Button variant="ghost" size="icon" className="group-hover:bg-background rounded-full">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No recent admissions found.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 glass-card border-none h-fit">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Commonly used operations</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link href="/dashboard/attendance">
              <Button variant="outline" className="w-full justify-start h-14 rounded-2xl border-none bg-secondary/50 hover:bg-secondary group">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 mr-3 group-hover:scale-110 transition-transform">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="font-bold leading-none">Record Attendance</p>
                  <p className="text-xs text-muted-foreground mt-1">Mark today's attendance</p>
                </div>
              </Button>
            </Link>
            <Link href="/dashboard/reports">
              <Button variant="outline" className="w-full justify-start h-14 rounded-2xl border-none bg-secondary/50 hover:bg-secondary group">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500 mr-3 group-hover:scale-110 transition-transform">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="font-bold leading-none">Generate Reports</p>
                  <p className="text-xs text-muted-foreground mt-1">Academic & Financial reports</p>
                </div>
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button variant="outline" className="w-full justify-start h-14 rounded-2xl border-none bg-secondary/50 hover:bg-secondary group">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 mr-3 group-hover:scale-110 transition-transform">
                  <Settings className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="font-bold leading-none">System Settings</p>
                  <p className="text-xs text-muted-foreground mt-1">Manage portal configuration</p>
                </div>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

