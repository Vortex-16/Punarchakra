// Centralized authentication API calls

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

/**
 * Request a password reset email
 */
export async function requestPasswordReset(email: string): Promise<ApiResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        return {
            success: response.ok,
            ...data,
        };
    } catch (error) {
        return {
            success: false,
            error: 'Network error. Please try again.',
        };
    }
}

/**
 * Reset password with token
 */
export async function resetPassword(
    token: string,
    newPassword: string
): Promise<ApiResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, newPassword }),
        });

        const data = await response.json();
        return {
            success: response.ok,
            ...data,
        };
    } catch (error) {
        return {
            success: false,
            error: 'Network error. Please try again.',
        };
    }
}

/**
 * Verify email with token
 */
export async function verifyEmail(token: string): Promise<ApiResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        });

        const data = await response.json();
        return {
            success: response.ok,
            ...data,
        };
    } catch (error) {
        return {
            success: false,
            error: 'Network error. Please try again.',
        };
    }
}

/**
 * Resend verification email
 */
export async function resendVerificationEmail(email: string): Promise<ApiResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        return {
            success: response.ok,
            ...data,
        };
    } catch (error) {
        return {
            success: false,
            error: 'Network error. Please try again.',
        };
    }
}

/**
 * Check if email is already registered
 */
export async function checkEmailAvailability(email: string): Promise<ApiResponse<{ available: boolean }>> {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/check-email?email=${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        return {
            success: response.ok,
            ...data,
        };
    } catch (error) {
        return {
            success: false,
            error: 'Network error. Please try again.',
        };
    }
}
