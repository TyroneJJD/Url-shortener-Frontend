'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { api } from '@/utils/api';
import type { URLResponse, URLCreate, URLUpdate } from '@/types/url';
import { URLTable } from './URLTable';
import { URLModal } from './URLModal';

export function URLManager() {
    const [urls, setUrls] = useState<URLResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedUrl, setSelectedUrl] = useState<URLResponse | null>(null);

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
            alert('Failed to delete URL');
        }
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">My URLs</h2>
                <button
                    onClick={handleCreate}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                >
                    <Plus className="w-5 h-5" />
                    Add URL
                </button>
            </div>

            <URLTable
                urls={urls}
                onEdit={handleEdit}
                onDelete={handleDelete}
                loading={loading}
            />

            <URLModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                mode={modalMode}
                initialData={selectedUrl || undefined}
            />
        </div>
    );
}
