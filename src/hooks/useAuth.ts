import { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import type { UserResponse } from '@/types/user';

interface UseAuthReturn {
    user: UserResponse | null;
    loading: boolean;
    setUser: (user: UserResponse | null) => void;
    checkAuth: () => Promise<void>;
}

/**
 * Custom hook to manage authentication state
 * Automatically checks for valid session on mount
 */
export function useAuth(): UseAuthReturn {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            setLoading(true);

            // Try to get current user info from the backend
            const data: any = await api.getCurrentUser();

            // The backend returns { user: UserResponse }
            // Extract the user object from the response
            if (data && data.user) {
                setUser(data.user);
            } else {
                // Fallback in case the structure changes
                setUser(data);
            }
        } catch (error) {
            // No valid session or error
            console.error('Auth check failed:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Check auth status on mount
        checkAuth();
    }, []);

    return {
        user,
        loading,
        setUser,
        checkAuth,
    };
}
