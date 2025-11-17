'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import api from '@/lib/api';
import { Users, UserPlus, TrendingUp } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/students/stats');
      setStats(data);
    } catch (error) {
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
      </div>

      {isAdmin && stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Admissions</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recentAdmissions?.length || 0}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {isAdmin && stats?.recentAdmissions && stats.recentAdmissions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Admissions</CardTitle>
            <CardDescription>Latest student registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.recentAdmissions.map((student) => (
                <div
                  key={student._id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {student.enrollmentNo} •{' '}
                      {new Date(student.dateOfAdmission).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/students">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                View All Students
              </Button>
            </Link>
            {isAdmin && (
              <Link href="/dashboard/students/add">
                <Button variant="outline" className="w-full justify-start">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add New Student
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

