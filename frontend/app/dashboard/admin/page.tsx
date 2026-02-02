'use client';

import React from 'react';

export default function AdminDashboard() {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Overview Cards */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium">Total Students</h3>
                    <p className="text-3xl font-bold mt-2">0</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium">Total Teachers</h3>
                    <p className="text-3xl font-bold mt-2">0</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium">Total Classes</h3>
                    <p className="text-3xl font-bold mt-2">0</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium">Active Sessions</h3>
                    <p className="text-3xl font-bold mt-2">0</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-4">
                    <a href="/admin/students" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Manage Students
                    </a>
                    <a href="/admin/teachers" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
                        Manage Teachers
                    </a>
                    <a href="/admin/classes" className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                        Manage Classes
                    </a>
                    <a href="/admin/fees" className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                        Fee Management
                    </a>
                </div>
            </div>
        </div>
    );
}
