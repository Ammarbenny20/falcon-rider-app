 // src/features/auth/utils/password.ts

export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

export type PasswordAnalysis = {
  strength: PasswordStrength;
  score: number; // 0–4
  checks: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
  suggestions: string[];
};

/**
 * Analyze password strength.
 *
 * This is a UX helper, not a security check. The backend enforces the real
 * policy. This function exists so the user gets immediate feedback while
 * typing, which reduces failed submissions.
 */
export function analyzePassword(password: string): PasswordAnalysis {
  const checks = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  // Score: 1 point per check, plus 1 bonus for special char OR length >= 12
  let score = 0;
  if (checks.minLength) score++;
  if (checks.hasUppercase) score++;
  if (checks.hasLowercase) score++;
  if (checks.hasNumber) score++;
  if (checks.hasSpecial || password.length >= 12) score++;

  let strength: PasswordStrength;
  if (score <= 2) strength = 'weak';
  else if (score === 3) strength = 'fair';
  else if (score === 4) strength = 'good';
  else strength = 'strong';

  const suggestions: string[] = [];
  if (!checks.minLength) suggestions.push('Use at least 8 characters');
  if (!checks.hasUppercase) suggestions.push('Add an uppercase letter');
  if (!checks.hasLowercase) suggestions.push('Add a lowercase letter');
  if (!checks.hasNumber) suggestions.push('Add a number');
  if (!checks.hasSpecial && password.length < 12)
    suggestions.push('Add a symbol (e.g., ! @ #)');

  return { strength, score, checks, suggestions };
}

/**
 * Human-readable label for a strength level.
 */
export function strengthLabel(strength: PasswordStrength): string {
  switch (strength) {
    case 'weak':
      return 'Weak';
    case 'fair':
      return 'Fair';
    case 'good':
      return 'Good';
    case 'strong':
      return 'Strong';
  }
}