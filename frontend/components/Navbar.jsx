'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-xl font-bold">Student Management System</h1>
          
          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="text-sm">
                  {user.name} ({user.role})
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

