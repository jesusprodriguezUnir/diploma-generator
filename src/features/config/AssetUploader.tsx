'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { useConfig } from '@/features/config/ConfigContext';

export default function AssetUploader() {
  const { activeConfig: config, replaceConfig } = useConfig();
  const firmaInputRef = useRef<HTMLInputElement>(null);
  const selloInputRef = useRef<HTMLInputElement>(null);

  const updateAsset = (field: 'firma_escuela' | 'sello_escuela', value: string) => {
    const newConfig = structuredClone(config);
    newConfig.valoresFijos[field] = value;
    replaceConfig(newConfig);
  };

  const handleImageUpload = (field: 'firma_escuela' | 'sello_escuela') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => updateAsset(field, ev.target?.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-bold uppercase tracking-widest text-muted">Firma y Sello</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(['firma_escuela', 'sello_escuela'] as const).map((field) => {
          const label = field === 'firma_escuela' ? 'Firma' : 'Sello';
          const ref = field === 'firma_escuela' ? firmaInputRef : selloInputRef;
          const src = config.valoresFijos[field];
          return (
            <div key={field} className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-muted">{label}</label>
              <div className="border border-border-card rounded-lg p-3 bg-surface flex flex-col gap-3 items-center">
                {src ? (
                  <div className="relative w-full h-20 bg-white rounded border border-border-card overflow-hidden">
                    <Image src={src} alt={label} fill unoptimized style={{ objectFit: 'contain' }} />
                  </div>
                ) : (
                  <div className="w-full h-20 flex items-center justify-center text-muted text-xs border border-dashed border-border-card rounded">
                    Sin imagen
                  </div>
                )}
                <div className="flex gap-2 w-full">
                  <button
                    onClick={() => ref.current?.click()}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-accent/20 hover:bg-accent/30 text-accent text-xs font-bold border border-accent/30 transition-all"
                  >
                    📁 Cargar JPG/PNG
                  </button>
                  {src && (
                    <button
                      onClick={() => updateAsset(field, '')}
                      className="px-3 py-1.5 rounded-lg bg-error/20 hover:bg-error/30 text-error text-xs font-bold border border-error/30 transition-all"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <input
                  type="file"
                  ref={ref}
                  className="hidden"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleImageUpload(field)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
