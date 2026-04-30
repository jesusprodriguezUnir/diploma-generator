'use client';

import { useCallback, useState, useRef } from 'react';
import type { ExcelRow } from '@/lib/types';

interface FileUploaderProps {
  onFileLoaded: (rows: ExcelRow[], file: File) => void;
  previewRows: ExcelRow[];
  disabled?: boolean;
  fileName?: string;
}

export default function FileUploader({
  onFileLoaded,
  previewRows,
  disabled = false,
  fileName,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    async (file: File) => {
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        setError('Solo se aceptan archivos Excel (.xlsx o .xls)');
        return;
      }

      setError(null);
      setIsLoading(true);

      try {
        const { parseExcelFile } = await import('@/lib/excel-parser');
        const rows = await parseExcelFile(file);
        onFileLoaded(rows, file);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Error desconocido al leer el archivo'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [onFileLoaded]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;

      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [disabled, processFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const hasFile = fileName && previewRows.length > 0;

  return (
    <div className="space-y-3">
      <label
        className="block text-sm font-medium"
        style={{ color: 'var(--text-secondary)' }}
      >
        Archivo de datos Excel
      </label>

      <div
        className={`drop-zone p-8 text-center cursor-pointer transition-all ${
          isDragging ? 'drag-over' : ''
        } ${hasFile ? 'has-file' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Zona de carga de archivos Excel"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={handleFileSelect}
          disabled={disabled}
        />

        {isLoading ? (
          <div className="flex flex-col items-center gap-3 animate-fade-in">
            <div className="w-10 h-10 border-3 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
            />
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Leyendo archivo Excel...
            </p>
          </div>
        ) : hasFile ? (
          <div className="flex flex-col items-center gap-3 animate-scale-in">
            <div className="text-3xl">📊</div>
            <div>
              <p className="font-medium" style={{ color: 'var(--success)' }}>
                {fileName}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                {previewRows.length > 0 &&
                  `Vista previa disponible · Click para cambiar archivo`}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="text-4xl opacity-60">
              {isDragging ? '📥' : '📁'}
            </div>
            <div>
              <p className="font-medium">
                {isDragging
                  ? 'Suelta el archivo aquí'
                  : 'Arrastra tu archivo Excel aquí'}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                o haz click para seleccionarlo · .xlsx
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div
          className="flex items-center gap-2 p-3 rounded-lg text-sm animate-scale-in"
          style={{
            background: 'rgba(248, 113, 113, 0.1)',
            border: '1px solid rgba(248, 113, 113, 0.2)',
            color: 'var(--error)',
          }}
        >
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Preview table */}
      {hasFile && previewRows.length > 0 && (
        <div className="animate-slide-up delay-200">
          <p
            className="text-xs font-medium mb-2 uppercase tracking-wide"
            style={{ color: 'var(--text-muted)' }}
          >
            Vista previa (primeras {previewRows.length} filas)
          </p>
          <div className="overflow-x-auto rounded-lg" style={{ border: '1px solid var(--card-border)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'rgba(108, 140, 255, 0.08)' }}>
                  {Object.keys(previewRows[0]).map((header) => (
                    <th
                      key={header}
                      className="px-3 py-2 text-left font-medium text-xs"
                      style={{ color: 'var(--accent)' }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row, i) => (
                  <tr
                    key={i}
                    style={{
                      borderTop: '1px solid var(--card-border)',
                    }}
                  >
                    {Object.values(row).map((val, j) => (
                      <td
                        key={j}
                        className="px-3 py-2 text-xs"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {String(val ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
