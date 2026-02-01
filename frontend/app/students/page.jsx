'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DataTable from '@/components/tables/data-table';
import api from '@/lib/api';
import { UserPlus, Eye, Edit, Trash2, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

export default function StudentsPage() {
  return (
    <ProtectedRoute teacherOnly>
      <StudentsPageContent />
    </ProtectedRoute>
  );
}

function StudentsPageContent() {
  const { isAdmin, isTeacher } = useAuth();
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  useEffect(() => {
    if (isTeacher) {
      fetchStudents();
    }
  }, [isTeacher, pagination.page, search]);

  const fetchStudents = async () => {
    try {
      const { data } = await api.get('/students', {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          search: search || undefined,
        },
      });
      setStudents(data.students || []);
      setPagination((prev) => ({
        ...prev,
        total: data.pagination?.total || 0,
      }));
    } catch (error) {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this student record? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/students/${id}`);
      toast.success('Student record deleted');
      fetchStudents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete student');
    }
  };

  const columns = useMemo(
    () => [
      {
        id: 'fullName',
        header: 'Student Name',
        cell: ({ row }) => {
          const { user } = row.original;
          return (
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs border border-primary/20">
                {user?.firstName?.[0]}
              </div>
              <span className="font-semibold text-foreground">
                {user?.firstName} {user?.lastName}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: 'enrollmentNo',
        header: 'Enrollment No',
        cell: ({ row }) => (
          <code className="bg-secondary px-2 py-0.5 rounded text-xs font-mono">
            {row.original.enrollmentNo || 'N/A'}
          </code>
        ),
      },
      {
        id: 'classInfo',
        header: 'Class / Section',
        cell: ({ row }) => {
          const { class: cls, section } = row.original;
          return (
            <span className="text-sm">
              {cls?.name || 'N/A'} - {section?.name || 'N/A'}
            </span>
          );
        },
      },
      {
        id: 'contact',
        header: 'Contact',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-sm">{row.original.user?.email}</span>
            <span className="text-xs text-muted-foreground">{row.original.user?.phone || 'No phone'}</span>
          </div>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Joined Date',
        cell: ({ row }) => {
          return (
            <span className="text-sm text-muted-foreground">
              {new Date(row.original.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const student = row.original;
          return (
            <div className="flex items-center space-x-1">
              <Link href={`/dashboard/students/${student.id}`}>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </Button>
              </Link>
              {isAdmin && (
                <>
                  <Link href={`/dashboard/students/${student.id}/edit`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:text-primary">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:text-destructive"
                    onClick={() => handleDelete(student.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          );
        },
      },
    ],
    [isAdmin]
  );

  if (loading && students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground animate-pulse">Loading students...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Students</h1>
          <p className="text-muted-foreground mt-1">
            Access and manage the directory of all enrolled students.
          </p>
        </div>
        {isAdmin && (
          <Link href="/dashboard/students/add">
            <Button className="shadow-lg shadow-primary/25 gap-2 h-11 px-6 rounded-xl">
              <UserPlus className="h-4 w-4" />
              Add Student
            </Button>
          </Link>
        )}
      </div>

      <Card className="glass-card border-none overflow-hidden">
        <CardHeader className="border-b bg-secondary/10 px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Student Directory</CardTitle>
              <CardDescription>
                Showing {students.length} of {pagination.total} students
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  className="pl-9 bg-background/50 border-none focus-visible:ring-1 focus-visible:ring-primary/50"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="glass">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable data={students} columns={columns} showSearch={false} />
        </CardContent>
      </Card>
    </div>
  );
}
