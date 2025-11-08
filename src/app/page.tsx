'use client';

import { useState } from 'react';
import type { UserResponse } from '@/types/user';
import { LoginForm, RegisterForm, UserDashboard } from '@/features/auth/components';

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleLoginSuccess = (userData: UserResponse) => {
    setUser(userData);
  };

  const handleRegisterSuccess = (email: string) => {
    setIsLogin(true);
    setSuccessMessage('Registration successful! Please login.');
    // Clear message after 5 seconds
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleToggleForm = () => {
    setIsLogin(!isLogin);
    setSuccessMessage('');
  };

  // If user is logged in, show dashboard
  if (user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <UserDashboard user={user} onLogout={handleLogout} />
      </main>
    );
  }

  // Login/Register UI
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
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
