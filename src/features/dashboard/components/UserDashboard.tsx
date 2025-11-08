'use client';

import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { api } from '@/utils/api';
import type { UserResponse } from '@/types/user';
import { URLManager } from '@/features/dashboard/components';
import { RegisterForm } from '@/features/auth/components';

interface UserDashboardProps {
    user: UserResponse;
    onLogout: () => void;
}

export function UserDashboard({ user, onLogout }: UserDashboardProps) {
    const [showUpgradeForm, setShowUpgradeForm] = useState(false);

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

    const handleUpgradeClick = () => {
        setShowUpgradeForm(true);
    };

    const handleUpgradeSuccess = () => {
        // After successful migration, reload the page to refresh user data
        window.location.reload();
    };

    // Show upgrade form if guest user clicks upgrade button
    if (showUpgradeForm && user.user_type === 'guest') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-amber-50 via-yellow-50 to-orange-50">
                <div className="relative">
                    <button
                        onClick={() => setShowUpgradeForm(false)}
                        className="absolute -top-4 -left-4 text-gray-600 hover:text-gray-800 text-2xl"
                    >
                        ← Volver
                    </button>
                    <RegisterForm
                        onRegisterSuccess={handleUpgradeSuccess}
                        onToggleForm={() => { }}
                        currentUser={user}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-amber-50 via-yellow-50 to-orange-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* User Info Header */}
                <div className="bg-white border-2 border-amber-200/50 p-6 rounded-xl shadow-lg mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                ¡Hola, {user.username}!
                            </h1>
                            <p className="text-gray-600 mt-1">{user.email || 'Usuario invitado'}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                            <LogOut className="w-5 h-5" />
                            Salir
                        </button>
                    </div>
                </div>

                {/* URL Manager */}
                <URLManager user={user} onUpgradeClick={handleUpgradeClick} />
            </div>
        </div>
    );
}
