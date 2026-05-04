'use client';

import { ConfigProvider } from '@/features/config/ConfigContext';
import { StudentsProvider } from '@/features/students/StudentsContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider>
      <StudentsProvider>
        {children}
      </StudentsProvider>
    </ConfigProvider>
  );
}
