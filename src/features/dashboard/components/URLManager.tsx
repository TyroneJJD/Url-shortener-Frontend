'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Link2, Download, Upload } from 'lucide-react';
import { api } from '@/utils/api';
import type { URLResponse, URLCreate, URLUpdate, PaginatedURLResponse, BulkURLResponse } from '@/types/url';
import type { UserResponse } from '@/types/user';
import { URLTable } from './URLTable';
import { URLModal } from './URLModal';
import { GuestLimitBanner } from './GuestLimitBanner';
import { useAlertDialog } from '@/hooks/useAlertDialog';
import { CustomAlertDialog } from '@/components/CustomAlertDialog';
import  downloadFile from '@/utils/file_download';

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
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUrls, setTotalUrls] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { dialogState, showAlert, handleConfirm, handleCancel } = useAlertDialog();


    const PAGE_SIZE = 20; // Tamaño de página (debe coincidir con el backend)

    const loadUrls = async (page: number = 1) => {
        try {
            setLoading(true);
            // Calcular offset basado en la página: offset = (page - 1) * PAGE_SIZE
            const calculatedOffset = (page - 1) * PAGE_SIZE;
                        
            const response = await api.getMyUrls({ 
                offset: calculatedOffset, 
                with_history: false 
            });

            // Manejar el caso donde el backend retorna un array vacío en lugar de un objeto paginado
            if (Array.isArray(response)) {
                // Respuesta es un array directo (no había urls o fallo en paginación)
                setUrls(response as URLResponse[]);
                setTotalPages(1);
                setTotalUrls(response.length);
                setCurrentPage(1);
            } else {
                // Respuesta es un objeto paginado con offset
                const paginatedResponse = response as PaginatedURLResponse;
                setUrls(paginatedResponse? paginatedResponse.urls : []);
                setTotalUrls(paginatedResponse ? paginatedResponse.total : 0);
                // Calcular total de páginas: ceil(total / PAGE_SIZE)
                setTotalPages(  Math.ceil((paginatedResponse ? paginatedResponse.total : 0) / PAGE_SIZE));
                setCurrentPage(page);
            }
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
        await loadUrls(currentPage);
    };

    const handleDelete = async (urlId: number) => {
        try {
            await api.deleteUrl(urlId);
            await loadUrls(currentPage);
        } catch (err) {
            console.error('Failed to delete URL:', err);
            showAlert('Error', 'Failed to delete URL. Please try again.');
        }
    };

    const handleDownload = async () => {
        try {
            setLoading(true);
            
            // Solicitar el archivo JSON con export=true
            const blob = await api.getMyUrls({ 
                offset: 0,
                with_history: true,
                export: true
            }) as Blob;

            downloadFile(blob, `my-urls-${new Date().toISOString().split('T')[0]}.json`);
            showAlert('Éxito', 'URLs descargadas correctamente con historial de accesos');
        } catch (err) {
            console.error('Failed to download URLs:', err);
            showAlert('Error', 'No se pudo descargar las URLs. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validar que sea un archivo JSON
        if (!file.name.endsWith('.json')) {
            showAlert('Error', 'Solo se aceptan archivos .json');
            return;
        }

        try {
            setIsUploading(true);

            // Enviar el archivo directamente al backend
            const response = await api.createUrlsBulk(file) as BulkURLResponse;

            showAlert('Éxito', `Se crearon ${response.urls.length} URLs correctamente`);    

            await loadUrls(1); // Volver a la primera página
        } catch (err) {
            console.error('Failed to upload URLs:', err);
            showAlert('Error', err instanceof Error ? err.message : 'No se pudo procesar el archivo. Verifica el formato.');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
            fileInputRef.current.value = '';
            }
        }
        
    };

    const handlePageChange = (page: number) => {
        loadUrls(page);
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
                                    {totalUrls === 0 ? 'Aún no tienes URLs' : `${totalUrls} URL${totalUrls !== 1 ? 's' : ''} creada${totalUrls !== 1 ? 's' : ''}`}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={handleDownload}
                                disabled={urls.length === 0 || loading}
                                className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all shadow-md hover:shadow-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                                title="Descargar URLs con historial"
                            >
                                <Download className="w-5 h-5" />
                                <span className="hidden sm:inline">Descargar</span>
                            </button>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading || loading}
                                className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-all shadow-md hover:shadow-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                                title="Cargar URLs masivamente"
                            >
                                <Upload className="w-5 h-5" />
                                <span className="hidden sm:inline">Cargar JSON</span>
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="application/json,.json"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                            <button
                                onClick={handleCreate}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-amber-500 to-yellow-500 text-white rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-all shadow-md hover:shadow-lg font-bold transform hover:scale-105"
                            >
                                <Plus className="w-5 h-5" />
                                <span className="hidden sm:inline">Crear Nueva URL</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabla de URLs integrada */}
                <div className="p-6">
                    <URLTable
                        urls={urls}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        loading={loading}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
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
