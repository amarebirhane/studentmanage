'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import { ArrowLeft, Edit } from 'lucide-react';
import Link from 'next/link';

function StudentDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [student, setStudent] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchStudent();
  }, [params.id]);

  const fetchStudent = async () => {
    try {
      const { data } = await api.get(`/students/${params.id}`);
      setStudent(data);
    } catch (error) {
      toast.error('Failed to fetch student');
      router.push('/dashboard/students');
    } finally {
      setFetching(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!student) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Student Details</h1>
            <p className="text-muted-foreground">View student information</p>
          </div>
        </div>
        {isAdmin && (
          <Link href={`/dashboard/students/${student._id}/edit`}>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {student.photo && (
              <div className="flex justify-center">
                <img
                  src={
                    student.photo.startsWith('http')
                      ? student.photo
                      : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}${student.photo}`
                  }
                  alt={student.name}
                  className="h-32 w-32 object-cover rounded-full"
                />
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="text-lg font-semibold">{student.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-lg">{student.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="text-lg">{student.phone}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Academic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Enrollment Number</p>
              <p className="text-lg font-semibold">{student.enrollmentNo}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date of Admission</p>
              <p className="text-lg">
                {new Date(student.dateOfAdmission).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="text-lg">
                {new Date(student.createdAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function StudentDetailPage() {
  return (
    <ProtectedRoute teacherOnly>
      <StudentDetailContent />
    </ProtectedRoute>
  );
}
