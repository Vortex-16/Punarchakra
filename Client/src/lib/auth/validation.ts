// Client-side validation utilities for authentication

export interface PasswordStrengthResult {
    isValid: boolean;
    strength: 'weak' | 'medium' | 'strong';
    score: number;
}

/**
 * Validates email format using a comprehensive regex pattern
 */
export function validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
}

/**
 * Validates password strength
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export function validatePasswordStrength(password: string): PasswordStrengthResult {
    const requirements = {
        minLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /\d/.test(password),
        hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };

    const metRequirements = Object.values(requirements).filter(Boolean).length;

    let strength: 'weak' | 'medium' | 'strong' = 'weak';
    if (metRequirements >= 5) strength = 'strong';
    else if (metRequirements >= 3) strength = 'medium';

    return {
        isValid: metRequirements >= 5,
        strength,
        score: metRequirements,
    };
}

/**
 * Checks if password and confirm password match
 */
export function checkPasswordMatch(password: string, confirm: string): boolean {
    return password === confirm && password.length > 0;
}

/**
 * Validates name field
 * Requirements:
 * - Minimum 2 characters
 * - Only letters, spaces, hyphens, and apostrophes
 */
export function validateName(name: string): boolean {
    const trimmedName = name.trim();
    if (trimmedName.length < 2) return false;
    
    // Allow letters, spaces, hyphens, apostrophes
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    return nameRegex.test(trimmedName);
}

/**
 * Sanitizes user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
    return input
        .trim()
        .replace(/[<>]/g, ''); // Remove < and >
}
