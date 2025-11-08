'use client';

import { Copy, Edit2, Trash2, Lock, Globe, CheckCircle2, XCircle } from 'lucide-react';
import type { URLResponse } from '@/types/url';
import { useState } from 'react';

interface URLTableProps {
    urls: URLResponse[];
    onEdit: (url: URLResponse) => void;
    onDelete: (urlId: number) => void;
    loading?: boolean;
}

export function URLTable({ urls, onEdit, onDelete, loading }: URLTableProps) {
    const [copiedId, setCopiedId] = useState<number | null>(null);

    const getShortUrl = (shortCode: string) => {
        return `http://localhost:8000/${shortCode}`;
    };

    const copyToClipboard = async (text: string, urlId: number) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(urlId);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            alert('Failed to copy to clipboard');
        }
    };

    if (loading) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-600">Loading URLs...</p>
            </div>
        );
    }

    if (urls.length === 0) {
        return (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No URLs yet. Create your first shortened URL!</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Original URL
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Short Code
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Privacy
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {urls.map((url) => (
                        <tr key={url.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                                <div className="text-sm text-gray-900 truncate max-w-xs" title={url.original_url}>
                                    <a
                                        href={url.original_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline truncate block"
                                    >
                                        {url.original_url}
                                    </a>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => copyToClipboard(getShortUrl(url.short_code), url.id)}
                                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors group"
                                        title="Click to copy full URL"
                                    >
                                        <code className="text-sm font-mono cursor-pointer">
                                            {url.short_code}
                                        </code>
                                        {copiedId === url.id ? (
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        )}
                                    </button>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <span
                                    className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${url.is_private
                                        ? 'bg-orange-100 text-orange-800'
                                        : 'bg-green-100 text-green-800'
                                        }`}
                                >
                                    {url.is_private ? (
                                        <>
                                            <Lock className="w-3 h-3" />
                                            Private
                                        </>
                                    ) : (
                                        <>
                                            <Globe className="w-3 h-3" />
                                            Public
                                        </>
                                    )}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                    {url.is_active ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-red-500" />
                                    )}
                                    <span className="text-sm text-gray-600">
                                        {url.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => onEdit(url)}
                                        className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirm('Are you sure you want to delete this URL?')) {
                                                onDelete(url.id);
                                            }
                                        }}
                                        className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
