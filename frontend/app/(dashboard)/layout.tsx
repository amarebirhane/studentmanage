'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg z-10">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-blue-600">SMS</h2>
                </div>

                <nav className="mt-6">
                    <a
                        href={`/${user?.role?.toLowerCase()}`}
                        className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                        Dashboard
                    </a>

                    {user?.role === 'ADMIN' && (
                        <>
                            <a href="/admin/students" className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                                Students
                            </a>
                            <a href="/admin/teachers" className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                                Teachers
                            </a>
                            <a href="/admin/classes" className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                                Classes
                            </a>
                            <a href="/admin/fees" className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                                Fees
                            </a>
                        </>
                    )}

                    {user?.role === 'TEACHER' && (
                        <>
                            <a href="/teacher/attendance" className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                                Attendance
                            </a>
                            <a href="/teacher/exams" className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                                Exams
                            </a>
                            <a href="/teacher/assignments" className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                                Assignments
                            </a>
                        </>
                    )}

                    {user?.role === 'STUDENT' && (
                        <>
                            <a href="/student/results" className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                                Results
                            </a>
                            <a href="/student/attendance" className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                                Attendance
                            </a>
                            <a href="/student/homework" className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                                Homework
                            </a>
                        </>
                    )}

                    {user?.role === 'PARENT' && (
                        <a href="/parent/child-progress" className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                            Child Progress
                        </a>
                    )}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="ml-64">
                {/* Header */}
                <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                    <h1 className="text-xl font-semibold">
                        Welcome, {user?.firstName} {user?.lastName}
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">{user?.role}</span>
                        <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                            Logout
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="min-h-[calc(100vh-64px)]">{children}</main>
            </div>
        </div>
    );
}
