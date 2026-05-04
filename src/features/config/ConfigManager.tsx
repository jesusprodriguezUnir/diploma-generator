'use client';

import { useState } from 'react';
import type { FichaSchoolConfig } from '@/lib/types';
import { TIPO_ACTIVIDAD_OPTIONS } from '@/lib/constants/activities';
import { WEEK_DAYS } from '@/lib/constants/week';
import { useConfig } from './ConfigContext';
import ConfigUploader from './ConfigUploader';
import AssetUploader from './AssetUploader';
import escuelaRecuerdo from '@/configs/escuela-recuerdo.json';
import escuelaEnforex from '@/configs/escuela-enforex.json';

const AVAILABLE_CONFIGS = [
  { id: 'escuela-recuerdo', label: 'Escuela Recuerdo', config: escuelaRecuerdo as FichaSchoolConfig },
  { id: 'escuela-enforex', label: 'Enforex Camps', config: escuelaEnforex as FichaSchoolConfig },
];

export default function ConfigManager() {
  const { activeConfig: config, replaceConfig } = useConfig();
  const [isOpen, setIsOpen] = useState(false);
  const [resetConfirmTarget, setResetConfirmTarget] = useState<string | null>(null);

  const updateField = (path: string, value: unknown) => {
    const newConfig = structuredClone(config);
    const parts = path.split('.');
    let current: Record<string, unknown> = newConfig as unknown as Record<string, unknown>;
    for (let i = 0; i < parts.length - 1; i++) {
      current[parts[i]] = { ...(current[parts[i]] as Record<string, unknown>) };
      current = current[parts[i]] as Record<string, unknown>;
    }
    current[parts[parts.length - 1]] = value;
    replaceConfig(newConfig);
  };

  const handleReset = () => {
    const found = AVAILABLE_CONFIGS.find(c => c.id === resetConfirmTarget);
    if (found) replaceConfig(found.config);
    setResetConfirmTarget(null);
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

          {/* Plantilla + carga/descarga JSON */}
          <div className="flex flex-wrap gap-3 items-start">
            <div className="flex items-center gap-2 flex-wrap">
              <label className="text-[10px] uppercase font-bold text-muted">Plantilla:</label>
              <select
                value={config.id}
                onChange={(e) => {
                  const found = AVAILABLE_CONFIGS.find(c => c.id === e.target.value);
                  if (found) replaceConfig(found.config);
                }}
                className="bg-surface border border-border-card rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-accent"
              >
                <option value="" disabled>Selecciona una escuela</option>
                {AVAILABLE_CONFIGS.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
              {resetConfirmTarget === config.id ? (
                <span className="flex items-center gap-1">
                  <span className="text-[10px]" style={{ color: 'var(--warning)' }}>¿Seguro?</span>
                  <button
                    onClick={handleReset}
                    className="px-2 py-0.5 rounded bg-error/20 text-[10px] font-bold border border-error/30"
                    style={{ color: 'var(--error)' }}
                  >
                    Sí
                  </button>
                  <button
                    onClick={() => setResetConfirmTarget(null)}
                    className="px-2 py-0.5 rounded text-[10px] font-bold border border-border-card bg-surface"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    No
                  </button>
                </span>
              ) : (
                <button
                  onClick={() => setResetConfirmTarget(config.id)}
                  className="px-2 py-1 rounded bg-slate-200 hover:bg-slate-300 text-[10px] font-bold transition-all"
                  title="Restablecer valores por defecto"
                >
                  🔄
                </button>
              )}
            </div>
            <ConfigUploader />
          </div>

          {/* Datos básicos */}
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

          {/* Valores fijos */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted">Valores Fijos (Globales)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* tipo_actividad_default */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted">tipo actividad default</label>
                <select
                  value={config.valoresFijos.tipo_actividad_default as string}
                  onChange={(e) => updateField('valoresFijos.tipo_actividad_default', e.target.value)}
                  className="w-full bg-surface border border-border-card rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
                >
                  {TIPO_ACTIVIDAD_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* dias_semana_por_tipo - basado en tipo_actividad_default */}
              {((): React.ReactNode => {
                const diasPorTipo = config.valoresFijos.dias_semana_por_tipo as Record<string, string> | undefined;
                const tipoDefault = config.valoresFijos.tipo_actividad_default as string;
                const currentDays = tipoDefault ? (diasPorTipo?.[tipoDefault] || '') : '';
                return (
                  <div className="space-y-3 col-span-full">
                    <label className="text-[10px] uppercase font-bold text-muted">días de semana para {tipoDefault}</label>
                    <div className="flex gap-1 items-center flex-wrap">
                      {WEEK_DAYS.map((day) => {
                        const isChecked = currentDays.includes(day);
                        return (
                          <label key={day} className={`flex items-center gap-1 cursor-pointer select-none px-2 py-1 rounded border text-xs font-bold transition-colors ${isChecked ? 'bg-accent/20 border-accent/60 text-accent' : 'bg-surface border-border-card text-muted'}`}>
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={isChecked}
                              onChange={(e) => {
                                let daysArray = currentDays.split(',').map(d => d.trim()).filter(Boolean);
                                if (e.target.checked) {
                                  if (!daysArray.includes(day)) {
                                    daysArray.push(day);
                                  }
                                } else {
                                  daysArray = daysArray.filter(d => d !== day);
                                }
                                daysArray.sort((a, b) => WEEK_DAYS.indexOf(a as typeof WEEK_DAYS[number]) - WEEK_DAYS.indexOf(b as typeof WEEK_DAYS[number]));
                                const newDias = { ...(diasPorTipo || {}), [tipoDefault]: daysArray.join(',') };
                                updateField('valoresFijos.dias_semana_por_tipo', newDias);
                              }}
                            />
                            {day}
                          </label>
                        );
                      })}
                      <button
                        onClick={() => {
                          const newDias = { ...(diasPorTipo || {}), [tipoDefault]: '' };
                          updateField('valoresFijos.dias_semana_por_tipo', newDias);
                        }}
                        className="text-[10px] uppercase text-error/70 hover:text-error ml-1"
                      >
                        Limpiar
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Resto de valores fijos */}
              {Object.entries(config.valoresFijos).map(([key, value]) => {
                if (key === 'firma_escuela' || key === 'sello_escuela') return null;
                if (key === 'dias_semana_por_tipo' || key === 'tipo_actividad_default') return null;
                return (
                  <div key={key} className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted">{key.replace(/_/g, ' ')}</label>
                    <input
                      type="text"
                      value={value as string}
                      onChange={(e) => updateField(`valoresFijos.${key}`, e.target.value)}
                      className="w-full bg-surface border border-border-card rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <AssetUploader />

          <p className="text-[10px] text-muted italic border-t border-white/5 pt-4">
            Nota: El mapeo de columnas del Excel se edita directamente en el fichero JSON para mayor precisión.
          </p>
        </div>
      )}
    </div>
  );
}
