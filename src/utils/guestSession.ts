/**
 * Gestión de sesiones de usuarios invitados (guest users)
 * UUID almacenado en localStorage para identificación persistente
 */

const GUEST_UUID_KEY = 'guest_uuid';
const LOGOUT_FLAG_KEY = 'user_logged_out';

/**
 * Genera un UUID v4 simple
 */
function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Obtiene el UUID del guest desde localStorage, o crea uno nuevo si no existe
 */
export function getOrCreateGuestUUID(): string {
    if (typeof window === 'undefined') return '';

    let uuid = localStorage.getItem(GUEST_UUID_KEY);

    if (!uuid) {
        uuid = generateUUID();
        localStorage.setItem(GUEST_UUID_KEY, uuid);
    }

    return uuid;
}

/**
 * Limpia la sesión guest del localStorage
 * Usar cuando el usuario migra a registrado
 */
export function clearGuestSession(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(GUEST_UUID_KEY);
}

/**
 * Verifica si existe un UUID guest en localStorage
 */
export function hasGuestSession(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(GUEST_UUID_KEY) !== null;
}

/**
 * Marca que el usuario hizo logout explícitamente
 */
export function setLogoutFlag(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LOGOUT_FLAG_KEY, 'true');
}

/**
 * Limpia la bandera de logout (cuando el usuario inicia sesión o crea sesión guest)
 */
export function clearLogoutFlag(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(LOGOUT_FLAG_KEY);
}

/**
 * Verifica si el usuario hizo logout recientemente
 */
export function hasLoggedOut(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(LOGOUT_FLAG_KEY) === 'true';
}
