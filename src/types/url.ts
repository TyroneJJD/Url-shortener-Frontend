export interface URLResponse {
    id: number;
    original_url: string;
    short_code: string;
    is_private: boolean;
    is_active: boolean;
    created_at: string;
    user_id: number;
    expires_at: string | null; // Fecha de expiración (solo para guest users)
    access_history?: AccessHistory[]; // Historial de accesos (opcional)
}

export interface AccessHistory {
    id: number;
    accessed_at: string;
    ip_address?: string;
    referer?: string;
}

export interface PaginatedURLResponse {
    urls: URLResponse[];
    total: number;
    offset: number;
}

export interface URLCreate {
    original_url: string;
    is_private?: boolean;
}

export interface URLUpdate {
    original_url?: string;
    is_active?: boolean;
    is_private?: boolean;
}

export interface BulkURLCreate {
    urls: URLCreate[];
}

export interface BulkURLResponse {
    urls: URLResponse[];
}
