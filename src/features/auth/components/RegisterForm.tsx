'use client';

import { useState } from 'react';
import { api } from '@/utils/api';
import type { RegisterData, UserResponse } from '@/types/user';
import { clearGuestSession } from '@/utils/guestSession';

interface RegisterFormProps {
    onRegisterSuccess: (user: UserResponse) => void;
    onToggleForm: () => void;
    currentUser?: UserResponse | null; // Para detectar si es guest
}

export function RegisterForm({ onRegisterSuccess, onToggleForm, currentUser }: RegisterFormProps) {
    const [registerData, setRegisterData] = useState<RegisterData>({
        username: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const isGuest = currentUser?.user_type === 'guest';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let userData: any;

            if (isGuest) {
                // Migrar de guest a registrado
                userData = await api.migrateToRegistered(registerData);
                // Limpiar UUID del localStorage
                clearGuestSession();
            } else {
                // Registro normal
                userData = await api.register(registerData);
            }

            // Extraer user de la respuesta
            const user = userData.user || userData;
            onRegisterSuccess(user);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
                {isGuest ? 'Actualiza tu cuenta' : 'Register'}
            </h1>

            {isGuest && (
                <div className="mb-4 p-3 rounded bg-blue-100 text-blue-800 text-sm">
                    🎉 ¡Convierte tu cuenta temporal en permanente! Tus URLs actuales se conservarán sin fecha de expiración.
                </div>
            )}

            {error && (
                <div className="mb-4 p-3 rounded bg-red-100 text-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="register-username" className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                    </label>
                    <input
                        id="register-username"
                        type="text"
                        required
                        value={registerData.username}
                        onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        placeholder="johndoe"
                    />
                </div>

                <div>
                    <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        id="register-email"
                        type="email"
                        required
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        placeholder="user@example.com"
                    />
                </div>

                <div>
                    <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        id="register-password"
                        type="password"
                        required
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:bg-gray-400"
                >
                    {loading ? 'Loading...' : (isGuest ? 'Convertir a cuenta permanente' : 'Register')}
                </button>
            </form>

            {!isGuest && (
                <div className="mt-6 text-center">
                    <button
                        onClick={onToggleForm}
                        className="text-blue-500 hover:text-blue-600 font-medium"
                    >
                        ¿Ya tienes una cuenta? Iniciar sesión
                    </button>
                </div>
            )}
        </div>
    );
}
