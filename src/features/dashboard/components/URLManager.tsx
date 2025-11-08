'use client';

import { useState, useEffect } from 'react';
import { Plus, Link2, Sparkles } from 'lucide-react';
import { api } from '@/utils/api';
import type { URLResponse, URLCreate, URLUpdate } from '@/types/url';
import type { UserResponse } from '@/types/user';
import { URLTable } from './URLTable';
import { URLModal } from './URLModal';
import { GuestLimitBanner } from './GuestLimitBanner';
import { useAlertDialog } from '@/hooks/useAlertDialog';
import { CustomAlertDialog } from '@/components/CustomAlertDialog';

interface URLManagerProps {
    user: UserResponse;
    onUpgradeClick: () => void;
}

export function URLManager({ user, onUpgradeClick }: URLManagerProps) {
    const [urls, setUrls] = useState<URLResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedUrl, setSelectedUrl] = useState<URLResponse | null>(null);
    const { dialogState, showAlert, handleConfirm, handleCancel } = useAlertDialog();

    const loadUrls = async () => {
        try {
            setLoading(true);
            const response: any = await api.getMyUrls();
            setUrls(response);
        } catch (err) {
            console.error('Failed to load URLs:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUrls();
    }, []);

    const handleCreate = () => {
        setModalMode('create');
        setSelectedUrl(null);
        setIsModalOpen(true);
    };

    const handleEdit = (url: URLResponse) => {
        setModalMode('edit');
        setSelectedUrl(url);
        setIsModalOpen(true);
    };

    const handleSave = async (data: URLCreate | URLUpdate) => {
        if (modalMode === 'create') {
            await api.createUrl(data as URLCreate);
        } else if (selectedUrl) {
            await api.updateUrl(selectedUrl.id, data as URLUpdate);
        }
        await loadUrls();
    };

    const handleDelete = async (urlId: number) => {
        try {
            await api.deleteUrl(urlId);
            await loadUrls();
        } catch (err) {
            console.error('Failed to delete URL:', err);
            showAlert('Error', 'Failed to delete URL. Please try again.');
        }
    };

    return (
        <div className="w-full">
            {/* Guest Limit Banner */}
            <GuestLimitBanner
                user={user}
                urlCount={urls.length}
                onUpgrade={onUpgradeClick}
            />

            {/* Card unificado: Header + Tabla */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-amber-200/50 overflow-hidden">
                {/* Header con diseño mejorado */}
                <div className="bg-linear-to-r from-amber-100 via-yellow-100 to-orange-100 p-6 border-b-2 border-amber-200">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-linear-to-br from-amber-500 to-yellow-600 p-3 rounded-xl shadow-md">
                                <Link2 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Mis URLs</h2>
                                <p className="text-sm text-gray-600 mt-0.5">
                                    {urls.length === 0 ? 'Aún no tienes URLs' : `${urls.length} URL${urls.length !== 1 ? 's' : ''} creada${urls.length !== 1 ? 's' : ''}`}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleCreate}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-amber-500 to-yellow-500 text-white rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-all shadow-md hover:shadow-lg font-bold transform hover:scale-105"
                        >
                            <Plus className="w-5 h-5" />
                            Crear Nueva URL
                        </button>
                    </div>
                </div>

                {/* Tabla de URLs integrada */}
                <div className="p-6">
                    <URLTable
                        urls={urls}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        loading={loading}
                    />
                </div>
            </div>

            <URLModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                mode={modalMode}
                initialData={selectedUrl || undefined}
                user={user}
            />

            <CustomAlertDialog
                isOpen={dialogState.isOpen}
                title={dialogState.title}
                description={dialogState.description}
                type={dialogState.type}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </div>
    );
}
