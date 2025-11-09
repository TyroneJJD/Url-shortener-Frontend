'use client';

import { useState, useEffect } from 'react';
import { X, Link2, Lock, Globe, Power, AlertCircle } from 'lucide-react';
import type { URLCreate, URLUpdate } from '@/types/url';
import type { UserResponse } from '@/types/user';

interface URLModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: URLCreate | URLUpdate) => Promise<void>;
    initialData?: {
        id?: number;
        original_url?: string;
        is_private?: boolean;
        is_active?: boolean;
    };
    mode: 'create' | 'edit';
    user?: UserResponse | null;
}

export function URLModal({ isOpen, onClose, onSave, initialData, mode, user }: URLModalProps) {
    const [formData, setFormData] = useState({
        original_url: '',
        is_private: false,
        is_active: true,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isGuest = user?.user_type === 'guest';

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    original_url: initialData.original_url || '',
                    is_private: initialData.is_private || false,
                    is_active: initialData.is_active !== undefined ? initialData.is_active : true,
                });
            } else {
                setFormData({
                    original_url: '',
                    is_private: false,
                    is_active: true,
                });
            }
            setError('');
        }
    }, [isOpen, initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (mode === 'create') {
                await onSave({
                    original_url: formData.original_url,
                    is_private: formData.is_private,
                });
            } else {
                await onSave({
                    original_url: formData.original_url,
                    is_private: formData.is_private,
                    is_active: formData.is_active,
                });
            }
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {mode === 'create' ? 'Crear URL' : 'Editar URL'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded bg-red-100 text-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="original_url" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                            <Link2 className="w-4 h-4" />
                            URL Original
                        </label>
                        <input
                            id="original_url"
                            type="url"
                            required
                            value={formData.original_url}
                            onChange={(e) => setFormData({ ...formData, original_url: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            placeholder="https://example.com/very/long/url"
                        />
                    </div>

                    {/* Opción de privacidad */}
                    <div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <input
                                id="is_private"
                                type="checkbox"
                                checked={formData.is_private}
                                onChange={(e) => setFormData({ ...formData, is_private: e.target.checked })}
                                disabled={isGuest}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <label htmlFor="is_private" className={`ml-3 flex items-center gap-2 text-sm ${isGuest ? 'text-gray-400' : 'text-gray-700'}`}>
                                {formData.is_private ? <Lock className="w-4 h-4 text-orange-600" /> : <Globe className="w-4 h-4 text-green-600" />}
                                <span>
                                    {formData.is_private ? 'URL Privada (requiere autenticación)' : 'URL Pública (accesible para cualquier persona)'}
                                </span>
                            </label>
                        </div>

                        {/* Mensaje para usuarios invitados */}
                        {isGuest && (
                            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-800">
                                    <strong>Cuenta temporal:</strong> Los usuarios invitados solo pueden crear URLs públicas.
                                    Actualiza a cuenta permanente para crear URLs privadas.
                                </p>
                            </div>
                        )}
                    </div>

                    {mode === 'edit' && (
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <input
                                id="is_active"
                                type="checkbox"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="is_active" className="ml-3 flex items-center gap-2 text-sm text-gray-700">
                                <Power className="w-4 h-4" />
                                <span>Activa (URL es accesible)</span>
                            </label>
                        </div>
                    )}

                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
                        >
                            {loading ? 'Guardando...' : mode === 'create' ? 'Crear' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
