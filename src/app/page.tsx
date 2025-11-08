'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { UserResponse } from '@/types/user';
import { LoginForm, RegisterForm, UserDashboard } from '@/features/auth/components';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/utils/api';

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [returnUrl, setReturnUrl] = useState<string>('');
  const searchParams = useSearchParams();
  const router = useRouter();

  // Use custom auth hook to check for existing session
  const { user, loading, setUser } = useAuth();

  useEffect(() => {
    const returnUrlParam = searchParams.get('returnUrl');
    if (returnUrlParam) {
      setReturnUrl(decodeURIComponent(returnUrlParam));
    }
  }, [searchParams]);

  const handleLoginSuccess = (userData: UserResponse, returnUrlFromLogin?: string) => {
    // If there's a return URL, redirect immediately without setting user state
    const urlToRedirect = returnUrlFromLogin || returnUrl;
    if (urlToRedirect) {
      // Clear the return URL from browser URL
      router.replace('/');
      // Redirect to the backend with the short code immediately
      window.location.href = `http://localhost:8000/${urlToRedirect}`;
      return; // Don't set user state, just redirect
    }

    // Only set user state if there's no return URL (normal login flow)
    setUser(userData);
  };

  const handleRegisterSuccess = (email: string) => {
    setIsLogin(true);
    setSuccessMessage('Registration successful! Please login.');
    // Clear message after 5 seconds
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const handleToggleForm = () => {
    setIsLogin(!isLogin);
    setSuccessMessage('');
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </main>
    );
  }

  // If user is logged in, show dashboard
  if (user) {
    return (
      <UserDashboard user={user} onLogout={handleLogout} />
    );
  }

  // Login/Register UI
  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
      <div>
        {successMessage && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-700 text-center max-w-md">
            {successMessage}
          </div>
        )}

        {isLogin ? (
          <LoginForm
            onLoginSuccess={handleLoginSuccess}
            onToggleForm={handleToggleForm}
            returnUrl={returnUrl}
          />
        ) : (
          <RegisterForm
            onRegisterSuccess={handleRegisterSuccess}
            onToggleForm={handleToggleForm}
          />
        )}
      </div>
    </main>
  );
}
