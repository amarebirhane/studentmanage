'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DataTable from '@/components/DataTable';
import api from '@/lib/api';
import { UserPlus, Eye, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';

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
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  useEffect(() => {
    if (isTeacher) {
      fetchStudents();
    }
  }, [isTeacher, pagination.page]);

  const fetchStudents = async () => {
    try {
      const { data } = await api.get('/students', {
        params: {
          page: pagination.page,
          limit: pagination.limit,
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
    if (!confirm('Are you sure you want to delete this student?')) {
      return;
    }

    try {
      await api.delete(`/students/${id}`);
      toast.success('Student deleted successfully');
      fetchStudents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete student');
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'enrollmentNo',
        header: 'Enrollment No',
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
      },
      {
        accessorKey: 'dateOfAdmission',
        header: 'Date of Admission',
        cell: ({ row }) => {
          return new Date(row.original.dateOfAdmission).toLocaleDateString();
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const student = row.original;
          return (
            <div className="flex items-center space-x-2">
              <Link href={`/dashboard/students/${student._id}`}>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
              {isAdmin && (
                <>
                  <Link href={`/dashboard/students/${student._id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(student._id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground">Manage student records</p>
        </div>
        {isAdmin && (
          <Link href="/dashboard/students/add">
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </Link>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>
            {pagination.total} total students
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable data={students} columns={columns} searchPlaceholder="Search students..." />
        </CardContent>
      </Card>
    </div>
  );
}
