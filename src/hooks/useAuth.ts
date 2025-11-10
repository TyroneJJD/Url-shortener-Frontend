import { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import type { UserResponse } from '@/types/user';
import { hasLoggedOut } from '@/utils/guestSession';

interface UseAuthReturn {
    user: UserResponse | null;
    loading: boolean;
    setUser: (user: UserResponse | null) => void;
    checkAuth: () => Promise<void>;
}

/**
 * Custom hook to manage authentication state
 * Automatically checks for valid session on mount
 * Does NOT create guest session automatically - this should be done explicitly
 */
export function useAuth(): UseAuthReturn {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            setLoading(true);

            // Si el usuario hizo logout explícitamente, no intentar revalidar la sesión
            if (hasLoggedOut()) {
                console.log('User logged out - skipping session check');
                setUser(null);
                setLoading(false);
                return;
            }

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
        } catch {
            // No valid session - just set user to null
            // Guest session creation should be handled explicitly by the component
            console.log('No active session found');
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
