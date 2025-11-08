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
    getMyUrls: () => apiFetch('/urls/me/all', { method: 'GET' }),

    createUrl: (data: { original_url: string; is_private?: boolean }) =>
        apiFetch('/urls', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

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