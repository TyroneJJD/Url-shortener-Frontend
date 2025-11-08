'use client';

import { useState } from 'react';
import { api } from '@/utils/api';
import type { LoginData, UserResponse } from '@/types/user';

interface LoginFormProps {
    onLoginSuccess: (user: UserResponse, returnUrl?: string) => void;
    onToggleForm: () => void;
    returnUrl?: string;
}

export function LoginForm({ onLoginSuccess, onToggleForm, returnUrl }: LoginFormProps) {
    const [loginData, setLoginData] = useState<LoginData>({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response: any = await api.login(loginData);
            onLoginSuccess(response.user, returnUrl);
            console.log('Login successful:', response.user);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
                Login
            </h1>

            {returnUrl && (
                <div className="mb-4 p-3 rounded bg-blue-50 border border-blue-200">
                    <p className="text-sm text-blue-800">
                        <strong>Redirecting to:</strong> <code className="bg-blue-100 px-2 py-1 rounded text-xs">{returnUrl}</code>
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                        After successful login, you'll be redirected to this private URL.
                    </p>
                </div>
            )}

            {error && (
                <div className="mb-4 p-3 rounded bg-red-100 text-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        id="login-email"
                        type="email"
                        required
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        placeholder="email@example.com"
                    />
                </div>

                <div>
                    <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        id="login-password"
                        type="password"
                        required
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:bg-gray-400"
                >
                    {loading ? 'Loading...' : 'Login'}
                </button>
            </form>

            <div className="mt-6 text-center">
                <button
                    onClick={onToggleForm}
                    className="text-blue-500 hover:text-blue-600 font-medium"
                >
                    ¿No tienes una cuenta?
                </button>
            </div>
        </div>
    );
}
