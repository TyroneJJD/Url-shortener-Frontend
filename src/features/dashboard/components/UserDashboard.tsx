'use client';

import { LogOut } from 'lucide-react';
import { api } from '@/utils/api';
import type { UserResponse } from '@/types/user';
import { URLManager } from '@/features/dashboard/components';

interface UserDashboardProps {
    user: UserResponse;
    onLogout: () => void;
}

export function UserDashboard({ user, onLogout }: UserDashboardProps) {
    const handleLogout = async () => {
        try {
            await api.logout();
            onLogout();
        } catch (err) {
            console.error('Logout error:', err);
            // Even if logout fails, clear the local state
            onLogout();
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* User Info Header */}
                <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                Welcome, {user.username}!
                            </h1>
                            <p className="text-gray-600 mt-1">{user.email}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center gap-2 px-6 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </button>
                    </div>
                </div>

                {/* URL Manager */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <URLManager />
                </div>
            </div>
        </div>
    );
}
