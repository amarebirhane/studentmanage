'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ children, adminOnly = false, teacherOnly = false }) => {
  const { user, loading, isAdmin, isTeacher } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
        return;
      }
      
      if (adminOnly && !isAdmin) {
        toast.error('Access denied. Admin privileges required.');
        router.push('/dashboard');
        return;
      }
      
      if (teacherOnly && !isTeacher) {
        toast.error('Access denied. Teacher or Admin privileges required.');
        router.push('/dashboard');
        return;
      }
    }
  }, [user, loading, isAdmin, isTeacher, router, adminOnly, teacherOnly]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (adminOnly && !isAdmin) {
    return null;
  }

  if (teacherOnly && !isTeacher) {
    return null;
  }

  return children;
};

export default ProtectedRoute;

