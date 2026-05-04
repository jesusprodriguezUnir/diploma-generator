'use client';

import React, { createContext, useContext, useState } from 'react';
import type { FichaSchoolConfig } from '@/lib/types';
import { fichaSchoolConfig as defaultConfig } from '@/mocks/mock-fichas';
import { loadStoredConfig, saveConfig } from '@/lib/config/storage';

interface ConfigContextValue {
  activeConfig: FichaSchoolConfig;
  replaceConfig: (config: FichaSchoolConfig) => void;
}

const ConfigContext = createContext<ConfigContextValue | null>(null);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [activeConfig, setActiveConfig] = useState<FichaSchoolConfig>(
    () => loadStoredConfig() ?? defaultConfig
  );

  const replaceConfig = (config: FichaSchoolConfig) => {
    setActiveConfig(config);
    saveConfig(config);
  };

  return (
    <ConfigContext.Provider value={{ activeConfig, replaceConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig(): ConfigContextValue {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error('useConfig must be used within ConfigProvider');
  return ctx;
}
