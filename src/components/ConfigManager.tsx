'use client';

import { useState, useRef } from 'react';
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
                key !== 'firma_escuela' && (
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

          <p className="text-[10px] text-muted italic border-t border-white/5 pt-4">
            Nota: El mapeo de columnas del Excel se edita directamente en el fichero JSON para mayor precisión.
          </p>
        </div>
      )}
    </div>
  );
}
