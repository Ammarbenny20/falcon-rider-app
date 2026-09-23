/**
 * Falcon Rider Admin Portal — Environment Configuration
 *
 * All environment variables are centralized here.
 * This ensures type safety and prevents scattered process.env access.
 */

export const env = {
  /** Backend API base URL */
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',

  /** Application name */
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Falcon Rider Command Center',

  /** Application version */
  APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',

  /** Mapbox access token (for maps) */
  MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '',

  /** Demo mode flag — when true, UI shows demo indicators */
  DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE === 'true',

  /** Current environment */
  NODE_ENV: process.env.NODE_ENV || 'development',

  /** Is production */
  IS_PRODUCTION: process.env.NODE_ENV === 'production',

  /** Is development */
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
} as const;

export type Env = typeof env;