'use client';

import React from 'react';

export default function TeacherDashboard() {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Teacher Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium">My Classes</h3>
                    <p className="text-3xl font-bold mt-2">0</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium">Total Students</h3>
                    <p className="text-3xl font-bold mt-2">0</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium">Pending Assignments</h3>
                    <p className="text-3xl font-bold mt-2">0</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-4">
                    <a href="/teacher/attendance" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Take Attendance
                    </a>
                    <a href="/teacher/exams" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
                        Manage Exams
                    </a>
                    <a href="/teacher/assignments" className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                        View Assignments
                    </a>
                </div>
            </div>
        </div>
    );
}
