'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import type { FichaSchoolConfig, FichaValoresFijos } from '@/lib/types';
import { validateSchoolConfig } from '@/lib/config-validator';

interface ConfigManagerProps {
  config: FichaSchoolConfig;
  onConfigChange: (newConfig: FichaSchoolConfig) => void;
}

export default function ConfigManager({ config, onConfigChange }: ConfigManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const firmaInputRef = useRef<HTMLInputElement>(null);
  const selloInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (field: 'firma_escuela' | 'sello_escuela') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateField(`valoresFijos.${field}`, ev.target?.result as string);
    };
    reader.readAsDataURL(file);
    // Reset input so the same file can be re-selected
    e.target.value = '';
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const validation = validateSchoolConfig(json);
        if (validation.valid) {
          onConfigChange(json as FichaSchoolConfig);
          setError(null);
          alert('Configuración cargada correctamente.');
        } else {
          setError(`Configuración inválida: ${validation.errors.join(', ')}`);
        }
      } catch (err) {
        setError('Error al leer el archivo JSON: ' + (err instanceof Error ? err.message : 'Desconocido'));
      }
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", `${config.id || 'config'}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const updateField = (path: string, value: any) => {
    const newConfig = { ...config };
    const parts = path.split('.');
    let current: any = newConfig;
    
    for (let i = 0; i < parts.length - 1; i++) {
      current[parts[i]] = { ...current[parts[i]] };
      current = current[parts[i]];
    }
    
    current[parts[parts.length - 1]] = value;
    onConfigChange(newConfig);
  };

  return (
    <div className="glass-card overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">⚙️</span>
          <div className="text-left">
            <h3 className="text-sm font-bold">Configuración de Escuela</h3>
            <p className="text-xs text-muted">{config.nombre}</p>
          </div>
        </div>
        <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="p-5 border-t border-white/10 space-y-6 animate-fade-in">
          {/* Acciones principales */}
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-lg bg-accent/20 hover:bg-accent/30 text-accent text-xs font-bold transition-all border border-accent/30"
            >
              📥 Cargar JSON
            </button>
            <button 
              onClick={handleExport}
              className="px-4 py-2 rounded-lg bg-success/20 hover:bg-success/30 text-success text-xs font-bold transition-all border border-success/30"
            >
              📤 Descargar JSON
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".json" 
              onChange={handleFileUpload} 
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-error/10 border border-error/20 text-error text-xs">
              {error}
            </div>
          )}

          {/* Editor de campos básicos */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted">Datos Básicos</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted">Nombre de la Escuela</label>
                <input 
                  type="text" 
                  value={config.nombre} 
                  onChange={(e) => updateField('nombre', e.target.value)}
                  className="w-full bg-surface border border-border-card rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted">ID (para el nombre del archivo)</label>
                <input 
                  type="text" 
                  value={config.id} 
                  onChange={(e) => updateField('id', e.target.value)}
                  className="w-full bg-surface border border-border-card rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted">Color Primario</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    value={config.estilos.colorPrimario} 
                    onChange={(e) => updateField('estilos.colorPrimario', e.target.value)}
                    className="h-9 w-12 bg-transparent border-none p-0 cursor-pointer"
                  />
                  <input 
                    type="text" 
                    value={config.estilos.colorPrimario} 
                    onChange={(e) => updateField('estilos.colorPrimario', e.target.value)}
                    className="flex-1 bg-surface border border-border-card rounded-lg px-3 py-2 text-sm font-mono"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted">Color Secundario</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    value={config.estilos.colorSecundario} 
                    onChange={(e) => updateField('estilos.colorSecundario', e.target.value)}
                    className="h-9 w-12 bg-transparent border-none p-0 cursor-pointer"
                  />
                  <input 
                    type="text" 
                    value={config.estilos.colorSecundario} 
                    onChange={(e) => updateField('estilos.colorSecundario', e.target.value)}
                    className="flex-1 bg-surface border border-border-card rounded-lg px-3 py-2 text-sm font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Editor de Valores Fijos */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted">Valores Fijos (Globales)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(config.valoresFijos).map(([key, value]) => (
                key !== 'firma_escuela' && key !== 'sello_escuela' && (
                  <div key={key} className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted">{key.replace(/_/g, ' ')}</label>
                    <input 
                      type="text" 
                      value={value as string} 
                      onChange={(e) => updateField(`valoresFijos.${key}`, e.target.value)}
                      className="w-full bg-surface border border-border-card rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
                    />
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Firma y Sello */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted">Firma y Sello</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(['firma_escuela', 'sello_escuela'] as const).map((field) => {
                const label = field === 'firma_escuela' ? 'Firma' : 'Sello';
                const ref = field === 'firma_escuela' ? firmaInputRef : selloInputRef;
                const src = config.valoresFijos[field] as string | undefined;
                return (
                  <div key={field} className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-muted">{label}</label>
                    <div className="border border-border-card rounded-lg p-3 bg-surface flex flex-col gap-3 items-center">
                      {src ? (
                        <div className="relative w-full h-20 bg-white rounded border border-border-card overflow-hidden">
                          <Image
                            src={src}
                            alt={label}
                            fill
                            unoptimized
                            style={{ objectFit: 'contain' }}
                          />
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
                            onClick={() => updateField(`valoresFijos.${field}`, '')}
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

          <p className="text-[10px] text-muted italic border-t border-white/5 pt-4">
            Nota: El mapeo de columnas del Excel se edita directamente en el fichero JSON para mayor precisión.
          </p>
        </div>
      )}
    </div>
  );
}
