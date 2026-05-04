import type { FichaSchoolConfig } from '../types';
import { migrateLegacyConfig } from './migrations';

const STORAGE_KEY = 'last_school_config';

export function loadStoredConfig(): FichaSchoolConfig | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    const parsed = JSON.parse(saved) as FichaSchoolConfig;
    return migrateLegacyConfig(parsed);
  } catch {
    return null;
  }
}

export function saveConfig(config: FichaSchoolConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}
