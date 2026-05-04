'use client';

import { useRef, useState } from 'react';
import type { FichaSchoolConfig } from '@/lib/types';
import { validateSchoolConfig } from '@/lib/config-validator';
import { useConfig } from '@/features/config/ConfigContext';

export default function ConfigUploader() {
  const { activeConfig: config, replaceConfig } = useConfig();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const validation = validateSchoolConfig(json);
        if (validation.valid) {
          replaceConfig(json as FichaSchoolConfig);
          setError(null);
          setSuccessMsg('Configuración cargada correctamente.');
          setTimeout(() => setSuccessMsg(null), 3000);
        } else {
          setError(`Configuración inválida: ${validation.errors.join(', ')}`);
          setSuccessMsg(null);
        }
      } catch (err) {
        setError('Error al leer el archivo JSON: ' + (err instanceof Error ? err.message : 'Desconocido'));
        setSuccessMsg(null);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `${config.id || 'config'}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
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
        <div className="p-2 rounded-lg bg-error/10 border border-error/20 text-error text-xs">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="p-2 rounded-lg bg-success/10 border border-success/20 text-success text-xs">
          {successMsg}
        </div>
      )}
    </div>
  );
}
