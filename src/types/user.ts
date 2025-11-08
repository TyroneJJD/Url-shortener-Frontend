export interface UserResponse {
    id: number;
    username: string;
    email: string;
    is_active: boolean;
    created_at: string;
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
