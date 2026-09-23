// src/i18n/index.ts

import { TRANSLATIONS, type TranslationKey } from '@/i18n/translations';
import { usePreferencesStore } from '@/store/preferences.store';

export type { TranslationKey } from '@/i18n/translations';

/**
 * Translate a key using the current language preference.
 *
 * Usage:
 *   const t = useTranslation();
 *   <Text>{t('tabs.home')}</Text>
 */
export function useTranslation() {
  const language = usePreferencesStore((s) => s.language);

  return (key: TranslationKey): string => {
    return TRANSLATIONS[language][key] ?? key;
  };
}