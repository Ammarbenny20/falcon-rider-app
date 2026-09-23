/**
 * Falcon Rider Admin Portal — Site Configuration
 *
 * Central metadata about the application.
 * Used in SEO, page titles, navigation, footer.
 */

export const siteConfig = {
  name: 'Falcon Rider',
  fullName: 'Falcon Rider Global Mobility Operations Command Center',
  shortName: 'FR Command Center',
  description:
    'Operations command center for the Falcon Rider mobility marketplace — monitor live operations, manage providers, verify identities, control finances, and ensure safety.',
  version: '1.0.0',
  url: 'https://command.falconrider.com',
  keywords: [
    'Falcon Rider',
    'Mobility Operations',
    'Command Center',
    'Ride Sharing',
    'Community Journeys',
    'Provider Management',
    'Trust & Safety',
  ],
  author: 'Falcon Rider Engineering',
  locale: 'en-US',
  timezone: 'Africa/Dar_es_Salaam',
  currency: 'TZS',
} as const;

export type SiteConfig = typeof siteConfig;