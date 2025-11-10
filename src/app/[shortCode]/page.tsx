'use client';

import { useEffect, useState, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldOff, XCircle } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ShortCodePage({ params }: { params: Promise<{ shortCode: string }> }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<'unauthorized' | 'not-found' | 'guest-forbidden' | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Unwrap the params Promise
    const { shortCode } = use(params);

    useEffect(() => {
        // Check if we were redirected here with an error parameter
        const errorParam = searchParams.get('error');

        if (errorParam === 'guest_forbidden' || errorParam === 'guest-forbidden') {
            setError('guest-forbidden');
        } else if (errorParam === 'unauthorized' || errorParam === '401' || errorParam === '403') {
            setError('unauthorized');
        } else if (errorParam === 'not-found' || errorParam === '404') {
            setError('not-found');
        }

        setIsLoading(false);

    }, [searchParams]);

    if (isLoading) {
        return (
            <LoadingSpinner />
        );
    }

    if (error === 'guest-forbidden') {
        // Guest user trying to access private URL
        const returnUrl = encodeURIComponent(shortCode);

        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-amber-50 via-yellow-50 to-orange-50 p-4">
                <div className="bg-white border-2 border-amber-200/50 p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <div className="bg-amber-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <ShieldOff className="w-10 h-10 text-amber-700" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Cuenta Temporal</h1>
                    <p className="text-gray-600 mb-4">
                        Los usuarios invitados no pueden acceder a URLs privadas.
                    </p>
                    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-sm text-amber-900 font-medium mb-2">
                            🔒 Esta es una URL privada
                        </p>
                        <p className="text-xs text-amber-700">
                            Actualiza tu cuenta a permanente para acceder a URLs privadas y disfrutar de beneficios ilimitados.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <button
                            onClick={() => router.push(`/?returnUrl=${returnUrl}&showAuth=true`)}
                            className="w-full px-6 py-3 bg-linear-to-r from-amber-500 to-yellow-500 text-white rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-all shadow-md hover:shadow-lg font-bold transform hover:scale-105"
                        >
                            Actualizar a Cuenta Permanente
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="w-full px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-semibold"
                        >
                            Ir al Inicio
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (error === 'unauthorized') {
        // Get the short code to pass as return URL
        const returnUrl = encodeURIComponent(shortCode);

        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-amber-50 via-yellow-50 to-orange-50 p-4">
                <div className="bg-white border-2 border-amber-200/50 p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <div className="bg-orange-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <ShieldOff className="w-10 h-10 text-orange-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Acceso Denegado</h1>
                    <p className="text-gray-600 mb-4">
                        Esta URL es privada y requiere autenticación para acceder.
                    </p>
                    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-sm text-amber-900 font-medium mb-1">
                            <strong>URL Corta:</strong>
                        </p>
                        <code className="bg-amber-100 px-3 py-1.5 rounded text-sm text-amber-800 font-mono inline-block">
                            {shortCode}
                        </code>
                        <p className="text-xs text-amber-700 mt-2">
                            Serás redirigido aquí después de iniciar sesión.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <button
                            onClick={() => router.push(`/?returnUrl=${returnUrl}&showAuth=true`)}
                            className="w-full px-6 py-3 bg-linear-to-r from-amber-500 to-yellow-500 text-white rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-all shadow-md hover:shadow-lg font-bold transform hover:scale-105"
                        >
                            Iniciar Sesión para Acceder
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="w-full px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-semibold"
                        >
                            Ir al Inicio
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Default to not-found error
    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-amber-50 via-yellow-50 to-orange-50 p-4">
            <div className="bg-white border-2 border-amber-200/50 p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                <div className="bg-red-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <XCircle className="w-10 h-10 text-red-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">URL No Encontrada</h1>
                <p className="text-gray-600 mb-6">
                    La URL corta que buscas no existe o ha sido eliminada.
                </p>
                <button
                    onClick={() => router.push('/')}
                    className="w-full px-6 py-3 bg-linear-to-r from-amber-500 to-yellow-500 text-white rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-all shadow-md hover:shadow-lg font-bold transform hover:scale-105"
                >
                    Ir al Inicio
                </button>
            </div>
        </div>
    );
}

