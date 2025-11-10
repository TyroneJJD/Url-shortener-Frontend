'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, redirect } from 'next/navigation';
import { UserCircle, Zap } from 'lucide-react';
import type { UserResponse } from '@/types/user';
import { LoginForm, RegisterForm, UserDashboard } from '@/features/auth/components';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/utils/api';
import { getOrCreateGuestUUID, setLogoutFlag, clearLogoutFlag } from '@/utils/guestSession';
import { API_BASE_URL_EXPORT } from '@/utils/api';
import LoadingSpinner from '@/components/LoadingSpinner';

function HomeContent() {
  const [isLogin, setIsLogin] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [returnUrl, setReturnUrl] = useState<string>('');
  const [showAuthForms, setShowAuthForms] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Use custom auth hook to check for existing session
  const { user, loading, setUser } = useAuth();

  useEffect(() => {
    const returnUrlParam = searchParams.get('returnUrl');
    const showAuthParam = searchParams.get('showAuth');

    if (returnUrlParam) {
      setReturnUrl(decodeURIComponent(returnUrlParam));
    }

    // Si viene el parámetro showAuth=true, mostrar los formularios automáticamente
    if (showAuthParam === 'true') {
      setShowAuthForms(true);
    }
  }, [searchParams]);

  // Resetear formularios si el usuario se autentica
  useEffect(() => {
    if (user) {
      setShowAuthForms(false);
    }
  }, [user]);

  const handleLoginSuccess = (userData: UserResponse, returnUrlFromLogin?: string) => {
    // Limpiar la bandera de logout al iniciar sesión exitosamente
    clearLogoutFlag();

    // If there's a return URL, redirect immediately without setting user state
    const urlToRedirect = returnUrlFromLogin || returnUrl;
    if (urlToRedirect) {
      // Clear the return URL from browser URL (replace history to avoid back button issues)
      router.replace('/');
      // Redirect to the backend with the short code immediately
      window.location.href = `${API_BASE_URL_EXPORT}/${urlToRedirect}`;
      return; // Don't set user state, just redirect
    }

    // Only set user state if there's no return URL (normal login flow)
    setUser(userData);
  };

  const handleRegisterSuccess = (userData: UserResponse) => {
    // Limpiar la bandera de logout al registrarse exitosamente
    clearLogoutFlag();

    // Si es migración desde guest, el usuario ya está autenticado
    // Simplemente actualizar el estado
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Marcar que el usuario hizo logout explícitamente
      setLogoutFlag();
      setUser(null);
      // Resetear la bandera para permitir creación de guest después del logout
      setShowAuthForms(false);
      redirect('/');
    }
  };

  const handleToggleForm = () => {
    setIsLogin(!isLogin);
    setSuccessMessage('');
  };

  const handleContinueAsGuest = async () => {
    try {
      // Limpiar la bandera de logout al crear sesión guest explícitamente
      clearLogoutFlag();

      const guestUUID = getOrCreateGuestUUID();
      const guestData: any = await api.createGuestSession({ uuid: guestUUID });

      // Extract user from guest session response
      const guestUser = guestData.user || guestData;
      setUser(guestUser);
    } catch (error) {
      console.error('Failed to create guest session:', error);
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-amber-50 via-yellow-50 to-orange-50">
        <LoadingSpinner />
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
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-amber-50 via-yellow-50 to-orange-50 p-4">
      <div className="w-full max-w-4xl">
        {/* Hero Section - Mostrar solo si no están visibles los formularios */}
        {!showAuthForms && (
          <div className="text-center mb-8 animate-fade-in">
            <div className="mb-6">
              <div className="inline-block p-4 bg-linear-to-br from-amber-400 to-yellow-500 rounded-2xl shadow-lg mb-4">
                <Zap className="w-16 h-16 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              ShortlyUrl
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Acorta tus enlaces en segundos y compártelos fácilmente
            </p>

            {/* Opciones de acceso */}
            <div className="flex flex-col gap-4 justify-center items-center max-w-md mx-auto">
              {/* Botón principal - Registrarse */}
              <button
                onClick={() => {
                  setIsLogin(false);
                  setShowAuthForms(true);
                }}
                className="w-full px-8 py-4 bg-linear-to-r from-amber-500 to-yellow-500 text-white rounded-xl font-bold text-lg hover:from-amber-600 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 transition-duration-ease-in-out"
              >
                Crear Cuenta Gratis
              </button>

              {/* Leyenda e inicio de sesión */}
              <div className="flex items-center gap-2 text-gray-600">
                <span>¿Ya tienes una cuenta?</span>
                <button
                  onClick={() => {
                    setIsLogin(true);
                    setShowAuthForms(true);
                  }}
                  className="text-amber-600 hover:text-amber-700 font-semibold hover:underline"
                >
                  Inicia sesión
                </button>
              </div>

              {/* Separador */}
              <div className="flex items-center gap-3 w-full my-2">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="text-gray-500 text-sm">o</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* Continuar como invitado */}
              <button
                onClick={handleContinueAsGuest}
                className="group w-full flex items-center justify-center gap-3 px-8 py-3 bg-white text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all shadow-md border-2 border-gray-200 hover:border-amber-300"
              >
                <UserCircle className="w-5 h-5" />
                Continuar como Invitado
              </button>
            </div>
          </div>
        )}

        {/* Formularios de Auth */}
        {showAuthForms && (
          <div className="animate-fade-in">
            <button
              onClick={() => setShowAuthForms(false)}
              className="mb-4 text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
              ← Volver
            </button>

            {successMessage && (
              <div className="mb-4 p-3 rounded bg-green-100 text-green-700 text-center max-w-md mx-auto">
                {successMessage}
              </div>
            )}

            <div className="flex justify-center">
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
                  currentUser={user}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-amber-50 via-yellow-50 to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </main>
    }>
      <HomeContent />
    </Suspense>
  );
}
