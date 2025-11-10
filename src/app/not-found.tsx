'use client';

import { useRouter } from 'next/navigation';
import { AlertCircle, Home, Search } from 'lucide-react';

export default function NotFound() {
    const router = useRouter();

    return (
        <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-amber-50 via-yellow-50 to-orange-50 p-4">
            <div className="max-w-2xl w-full text-center">
                <div className="mb-8 animate-fade-in">
                    <div className="inline-block p-6 bg-linear-to-br from-amber-400 to-yellow-500 rounded-full shadow-2xl mb-6">
                        <AlertCircle className="w-24 h-24 text-white" />
                    </div>
                    <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-linear-to-r from-amber-500 to-yellow-600 mb-4">
                        404
                    </h1>
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">
                        Página No Encontrada
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Lo sentimos, la página que buscas no existe o ha sido movida.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-linear-to-r from-amber-500 to-yellow-500 text-white rounded-xl font-bold text-lg hover:from-amber-600 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        <Home className="w-5 h-5" />
                        Ir al Inicio
                    </button>
                </div>
            </div>
        </main>
    );
}
