export interface UserResponse {
    id: number;
    username: string;
    email: string | null; // Nullable para guests
    is_active: boolean;
    created_at: string;
    user_type: 'guest' | 'registered'; // Tipo de usuario
    guest_uuid?: string; // UUID único para guests
}

export interface LoginResponse {
    user: UserResponse;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

// Datos para crear sesión guest
export interface GuestSessionData {
    uuid: string;
}

// Datos para migrar guest a registrado
export interface MigrateData {
    username: string;
    email: string;
    password: string;
}
