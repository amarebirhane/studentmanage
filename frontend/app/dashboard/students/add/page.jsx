'use client';

import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import StudentForm from '@/components/StudentForm';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function AddStudentContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Student</h1>
        <p className="text-muted-foreground">Create a new student record</p>
      </div>
      <StudentForm />
    </div>
  );
}

export default function AddStudentPage() {
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
      <AddStudentContent />
    </ProtectedRoute>
  );
}

