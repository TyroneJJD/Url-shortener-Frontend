'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldOff, XCircle } from 'lucide-react';

export default function ShortCodePage({ params }: { params: { shortCode: string } }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<'unauthorized' | 'not-found' | null>(null);

    useEffect(() => {
        // Check if we were redirected here with an error parameter
        const errorParam = searchParams.get('error');

        if (errorParam === 'unauthorized' || errorParam === '401' || errorParam === '403') {
            setError('unauthorized');
        } else if (errorParam === 'not-found' || errorParam === '404') {
            setError('not-found');
        } else if (errorParam) {
            // Any other error, treat as not found
            setError('not-found');
        } else {
            // If no error parameter, the URL should have been handled by the backend
            // If we reach this component without an error, something went wrong
            setError('not-found');
        }
    }, [searchParams]);

    if (error === 'unauthorized') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                    <ShieldOff className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Access Denied</h1>
                    <p className="text-gray-600 mb-6">
                        This URL is private and requires authentication to access.
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={() => router.push('/')}
                            className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                        >
                            Login to Access
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="w-full px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Go to Homepage
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Default to not-found error
    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-800 mb-4">URL Not Found</h1>
                <p className="text-gray-600 mb-6">
                    The short URL you&apos;re looking for doesn&apos;t exist or has been deleted.
                </p>
                <button
                    onClick={() => router.push('/')}
                    className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                >
                    Go to Homepage
                </button>
            </div>
        </div>
    );
}

