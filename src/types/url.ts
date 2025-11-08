export interface URLResponse {
    id: number;
    original_url: string;
    short_code: string;
    is_private: boolean;
    is_active: boolean;
    created_at: string;
    user_id: number;
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
