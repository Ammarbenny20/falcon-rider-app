// src/i18n/index.ts

import { usePreferencesStore } from '@/store/preferences.store';
import { TRANSLATIONS, type TranslationKey } from '@/i18n/translations';

export type { TranslationKey } from '@/i18n/translations';

/**
 * Translate a key using the current language preference.
 *
 * Usage:
 *   import { useTranslation } from '@/i18n';
 *   const t = useTranslation();
 *   <Text>{t('home.search.placeholder')}</Text>
 */
export function useTranslation() {
  const language = usePreferencesStore((s) => s.language);

  return (key: TranslationKey): string => {
    return TRANSLATIONS[language][key] ?? key;
  };
}