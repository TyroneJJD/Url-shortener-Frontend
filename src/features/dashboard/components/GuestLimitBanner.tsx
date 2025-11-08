'use client';

import { UserCircle, Clock, Sparkles, Infinity, Shield, Smartphone } from 'lucide-react';
import type { UserResponse } from '@/types/user';

interface GuestLimitBannerProps {
    user: UserResponse;
    urlCount: number;
    onUpgrade: () => void;
}

/**
 * Banner informativo para usuarios guest
 * Muestra el límite de URLs y botón para actualizar a cuenta permanente
 */
export function GuestLimitBanner({ user, urlCount, onUpgrade }: GuestLimitBannerProps) {
    const isGuest = user.user_type === 'guest';

    if (!isGuest) return null;

    const maxUrls = 5;
    const remaining = Math.max(0, maxUrls - urlCount);

    return (
        <div className="bg-white border-2 border-amber-200/50 rounded-xl p-6 mb-6 shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Sección izquierda: Info de cuenta */}
                <div className="flex items-start gap-4 flex-1">
                    <div className="shrink-0">
                        <div className="bg-linear-to-br from-amber-400 to-yellow-500 p-3 rounded-full shadow-md">
                            <UserCircle className="w-7 h-7 text-white" />
                        </div>
                    </div>

                    <div className="flex-1">
                        <h3 className="font-bold text-lg text-amber-900 mb-2">
                            Cuenta Temporal
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-1.5">
                                <span className="text-2xl font-bold text-amber-800">{urlCount}</span>
                                <span className="text-sm text-amber-700">de {maxUrls}</span>
                            </div>
                            <span className="text-sm text-amber-700">URLs creadas</span>
                        </div>
                        {remaining > 0 ? (
                            <p className="text-sm text-amber-700 font-medium">
                                Te quedan {remaining} URL{remaining !== 1 ? 's' : ''} disponible{remaining !== 1 ? 's' : ''}
                            </p>
                        ) : (
                            <p className="text-sm text-red-700 font-semibold">
                                Has alcanzado el límite de URLs
                            </p>
                        )}
                        <div className="flex items-center gap-1.5 text-xs text-amber-700 mt-2">
                            <Clock className="w-4 h-4" />
                            <span>Tus URLs expirarán en 7 días</span>
                        </div>
                    </div>
                </div>

                {/* Sección central: Beneficios */}
                <div className="hidden lg:flex lg:flex-col gap-2 px-6 border-l-2 border-amber-200">
                    <div className="flex items-center gap-2 text-sm text-amber-800">
                        <Infinity className="w-4 h-4 text-amber-600" />
                        <span>URLs ilimitadas</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-amber-800">
                        <Shield className="w-4 h-4 text-amber-600" />
                        <span>Sin fechas de expiración</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-amber-800">
                        <Smartphone className="w-4 h-4 text-amber-600" />
                        <span>Acceso multiplataforma</span>
                    </div>
                </div>

                {/* Sección derecha: Botón CTA */}
                <div className="shrink-0">
                    <button
                        onClick={onUpgrade}
                        className="w-full lg:w-auto flex items-center justify-center gap-2 bg-linear-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                        <Sparkles className="w-5 h-5" />
                        Actualizar a cuenta permanente
                    </button>

                    {/* Beneficios en móvil */}
                    <div className="lg:hidden flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-amber-700">
                        <div className="flex items-center gap-1">
                            <Infinity className="w-3 h-3" />
                            <span>URLs ilimitadas</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            <span>Sin expiración</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Smartphone className="w-3 h-3" />
                            <span>Multiplataforma</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
