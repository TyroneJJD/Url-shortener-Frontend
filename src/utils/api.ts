import { off } from "process";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

interface FetchOptions extends RequestInit {
    headers?: Record<string, string>;
}

/**
 * Wrapper for fetch that automatically includes credentials (cookies)
 * for all requests except login responses
 */
export async function apiFetch<T>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    const config: RequestInit = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
        credentials: 'include', // This ensures cookies are sent with HTTPS requests
    };

    const response = await fetch(url, config);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.detail || `API Error: ${response.status} ${response.statusText}`
        );
    }

    return response.json();
}

// API endpoints
export const api = {
    // Auth endpoints
    register: (data: { username: string; email: string; password: string }) =>
        apiFetch('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    login: (data: { email: string; password: string }) =>
        apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    logout: () =>
        apiFetch('/auth/logout', {
            method: 'POST',
        }),

    // Create guest session
    createGuestSession: (data: { uuid: string }) =>
        apiFetch('/auth/guest', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    // Migrate guest to registered user
    migrateToRegistered: (data: { username: string; email: string; password: string }) =>
        apiFetch('/auth/migrate', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    // Get current authenticated user
    getCurrentUser: () => apiFetch('/auth/me', { method: 'GET' }),

    // URL endpoints
    getMyUrls: (params?: { offset?: number; with_history?: boolean; export?: boolean }) => {
        const queryParams = new URLSearchParams();
        if (params?.offset !== undefined) queryParams.append('offset', params.offset.toString());
        if (params?.with_history !== undefined) {
            queryParams.append('with_history', params.with_history.toString());
        }
        if (params?.export !== undefined) {
            queryParams.append('export', params.export.toString());
        }
        const queryString = queryParams.toString();
        
        // Si export=true, el backend retorna un archivo, no JSON
        if (params?.export) {
            const url = `${API_BASE_URL}/urls/me/all${queryString ? `?${queryString}` : ''}`;
            return fetch(url, {
                method: 'GET',
                credentials: 'include',
            }).then(async (response) => {
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(
                        errorData.detail || `API Error: ${response.status} ${response.statusText}`
                    );
                }
                return response.blob();
            });
        }
        
        return apiFetch(`/urls/me/all${queryString ? `?${queryString}` : ''}`, { method: 'GET' });
    },

    createUrl: (data: { original_url: string; is_private?: boolean }) =>
        apiFetch('/urls', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    createUrlsBulk: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const url = `${API_BASE_URL}/urls/bulk`;
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.detail || `API Error: ${response.status} ${response.statusText}`
            );
        }

        return response.json();
    },

    updateUrl: (
        urlId: number,
        data: { original_url?: string; is_active?: boolean; is_private?: boolean }
    ) =>
        apiFetch(`/urls/${urlId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    deleteUrl: (urlId: number) =>
        apiFetch(`/urls/${urlId}`, {
            method: 'DELETE',
        }),
};

export const API_BASE_URL_EXPORT = API_BASE_URL;