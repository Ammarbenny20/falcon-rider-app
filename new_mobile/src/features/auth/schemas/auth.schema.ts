// src/features/auth/schemas/auth.schema.ts

import { z } from 'zod';

// ============================================================================
// Shared Validators
// ============================================================================

/**
 * Tanzanian phone number: +255 followed by 9 digits.
 * Adjust if you support multiple countries later.
 */
const TANZANIA_PHONE_REGEX = /^\+255\d{9}$/;

/**
 * Email: standard format. Kept strict but not overly restrictive.
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Password policy: min 8 chars, 1 uppercase, 1 lowercase, 1 number.
 */
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const passwordField = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(
    PASSWORD_REGEX,
    'Password must include uppercase, lowercase, and a number',
  );

const identifierField = z
  .string()
  .trim()
  .min(1, 'Enter your phone number or email')
  .refine(
    (value) => {
      const v = value.trim();
      return TANZANIA_PHONE_REGEX.test(v) || EMAIL_REGEX.test(v);
    },
    { message: 'Enter a valid phone (+255...) or email' },
  );

// ============================================================================
// Login
// ============================================================================

export const loginSchema = z.object({
  identifier: identifierField,
  password: z.string().min(1, 'Enter your password'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// ============================================================================
// Sign Up
// ============================================================================

export const signupSchema = z
  .object({
    full_name: z
      .string()
      .trim()
      .min(2, 'Enter your full name')
      .max(150, 'Name is too long'),
    identifier: identifierField,
    password: passwordField,
    password_confirm: z.string(),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: 'Passwords do not match',
    path: ['password_confirm'],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;

// ============================================================================
// Password Reset — Request
// ============================================================================

export const forgotPasswordSchema = z.object({
  identifier: identifierField,
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

// ============================================================================
// Password Reset — Confirm
// ============================================================================

export const resetPasswordSchema = z
  .object({
    otp: z
      .string()
      .trim()
      .regex(/^\d{6}$/, 'Enter the 6-digit code'),
    new_password: passwordField,
    new_password_confirm: z.string(),
  })
  .refine((data) => data.new_password === data.new_password_confirm, {
    message: 'Passwords do not match',
    path: ['new_password_confirm'],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

// ============================================================================
// OTP (verification only — kept for phone/email verification)
// ============================================================================

export const otpSchema = z.object({
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Enter the 6-digit code'),
});

export type OtpFormValues = z.infer<typeof otpSchema>;

// ============================================================================
// Legacy exports (kept during transition; safe to remove after refactor)
// ============================================================================

/** @deprecated Use signupSchema instead. */
export const registrationSchema = signupSchema;
export type RegistrationFormValues = SignupFormValues;

/** @deprecated Use signupSchema instead. */
export const phoneSchema = signupSchema;
export type PhoneFormValues = SignupFormValues;