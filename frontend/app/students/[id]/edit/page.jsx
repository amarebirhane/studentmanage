'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import StudentForm from '@/components/StudentForm';
import api from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

function EditStudentContent({ studentId }) {
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudent();
  }, [studentId]);

  const fetchStudent = async () => {
    try {
      const { data } = await api.get(`/students/${studentId}`);
      setStudent(data);
    } catch (error) {
      toast.error('Failed to fetch student');
      router.push('/dashboard/students');
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
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Student</h1>
          <p className="text-muted-foreground">Update student information</p>
        </div>
      </div>
      <StudentForm studentId={studentId} initialData={student} />
    </div>
  );
}

export default function EditStudentPage() {
  const params = useParams();
  const { isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/dashboard/students');
    }
  }, [isAdmin, loading, router]);

  if (loading) {
    return null;
  }

  return (
    <ProtectedRoute adminOnly>
      <EditStudentContent studentId={params.id} />
    </ProtectedRoute>
  );
}
