'use client';

import { api } from '@/utils/api';
import type { UserResponse } from '@/types/user';

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
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
                Welcome, {user.username}!
            </h1>

            <div className="space-y-3 mb-6">
                <div className="p-4 bg-gray-50 rounded">
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-800">{user.email}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded">
                    <p className="text-sm text-gray-600">Account Status</p>
                    <p className="font-medium text-gray-800">
                        {user.is_active ? 'Active' : 'Inactive'}
                    </p>
                </div>

                <div className="p-4 bg-gray-50 rounded">
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-medium text-gray-800">
                        {new Date(user.created_at).toLocaleDateString()}
                    </p>
                </div>
            </div>

            <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
                Logout
            </button>
        </div>
    );
}
