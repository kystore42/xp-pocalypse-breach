import { useGameStore } from '../store/gameStore';
import { getTranslation } from '../i18n/translations';

/**
 * Hook that returns a translation function `t(key, params?)` 
 * bound to the current language from the game store.
 */
export function useTranslation() {
  const language = useGameStore(s => s.language);

  const t = (key: string, params?: Record<string, string | number>): string => {
    return getTranslation(language, key, params);
  };

  return { t, language };
}
