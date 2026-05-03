'use client';

import { useState, useRef, useCallback, type ReactNode } from 'react';
import type { FichaData, GenerationProgress } from '@/lib/types';
import FichaPracticasTemplate from './FichaPracticasTemplate';

type OutputMode = 'single' | 'zip';

interface GenerateButtonProps {
  readonly items: FichaData[];
  disabled?: boolean;
}

const RECOMMENDED_BATCH_SIZE = 10;
const MAX_BATCH_SIZE = 25;

export default function GenerateButton(props: Readonly<GenerateButtonProps>) {
  const { items, disabled = false } = props;
  const [progress, setProgress] = useState<GenerationProgress>({
    status: 'idle',
    current: 0,
    total: 0,
    message: '',
  });
  const [outputMode, setOutputMode] = useState<OutputMode>('single');
  const renderContainerRef = useRef<HTMLDivElement>(null);

  const orientation = 'portrait';
  const pageSelector = '.ficha-page';
  const label = 'fichas';

  const getItemName = (item: FichaData): string => {
    const p = item.practicante;
    const full = [p.nombre, p.apellido1, p.apellido2]
      .filter(Boolean)
      .join(' ');
    return full.trim().replaceAll(/\s+/g, '-');
  };

  const getSchoolId = (): string => {
    if (items.length === 0) return 'output';
    return items[0].school.id;
  };

  const handleGenerate = useCallback(async () => {
    if (items.length === 0) return;
    if (items.length > MAX_BATCH_SIZE) {
      setProgress({
        status: 'error',
        current: 0,
        total: items.length,
        message: `Lote demasiado grande (${items.length}). Divide en grupos de hasta ${MAX_BATCH_SIZE}.`,
      });
      return;
    }

    setProgress({
      status: 'processing',
      current: 0,
      total: items.length,
      message: `Preparando ${label} para renderizado...`,
    });

    try {
      await new Promise((r) => setTimeout(r, 500));

      const container = renderContainerRef.current;
      if (!container) throw new Error('No se encontró el contenedor de renderizado');

      const elements = Array.from(
        container.querySelectorAll<HTMLElement>(pageSelector)
      );
      if (elements.length === 0)
        throw new Error(`No se encontraron ${label} renderizados`);

      const {
        generateAllPDFs,
        generateZipPDFs,
        downloadBlob,
      } = await import('@/lib/pdf-generator-client');

      const schoolId = getSchoolId();

      if (outputMode === 'zip') {
        const names = items.map(getItemName);
        const blob = await generateZipPDFs(elements, names, setProgress, orientation);
        downloadBlob(blob, `${label}-${schoolId}.zip`);
      } else {
        const blob = await generateAllPDFs(elements, setProgress, orientation);
        const filename = items.length === 1 
          ? `${getItemName(items[0])}.pdf` 
          : `${label}-${schoolId}.pdf`;
        downloadBlob(blob, filename);
      }
    } catch (err) {
      setProgress({
        status: 'error',
        current: 0,
        total: items.length,
        message:
          err instanceof Error ? err.message : 'Error desconocido al generar PDFs',
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, outputMode, orientation, pageSelector, label]);

  const progressPercent =
    progress.total > 0
      ? Math.round((progress.current / progress.total) * 100)
      : 0;

  let buttonContent: ReactNode;
  if (progress.status === 'processing') {
    buttonContent = (
      <span className="flex items-center justify-center gap-2">
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Generando...
      </span>
    );
  } else if (progress.status === 'complete') {
    buttonContent = (
      <span className="flex items-center justify-center gap-2">
        ✅ ¡Descarga completada!
      </span>
    );
  } else {
    buttonContent = (
      <span className="flex items-center justify-center gap-2">
        📋 Generar {items.length} {label}{' '}
        {outputMode === 'zip' ? '(ZIP)' : '(PDF)'}
      </span>
    );
  }

  return (
    <div className="space-y-4">
      {/* Output mode selector */}
      <div className="flex items-center gap-3">
        <span
          className="text-xs font-medium"
          style={{ color: 'var(--text-muted)' }}
        >
          Formato de salida:
        </span>
        <div
          className="flex rounded-lg overflow-hidden"
          style={{ border: '1px solid var(--card-border)' }}
        >
          <button
            className="px-3 py-1.5 text-xs font-medium transition-colors"
            style={{
              background: outputMode === 'single' ? 'var(--accent)' : 'transparent',
              color: outputMode === 'single' ? 'white' : 'var(--text-secondary)',
            }}
            onClick={() => setOutputMode('single')}
          >
            📄 PDF único
          </button>
          <button
            className="px-3 py-1.5 text-xs font-medium transition-colors"
            style={{
              background: outputMode === 'zip' ? 'var(--accent)' : 'transparent',
              color: outputMode === 'zip' ? 'white' : 'var(--text-secondary)',
              borderLeft: '1px solid var(--card-border)',
            }}
            onClick={() => setOutputMode('zip')}
          >
            📦 ZIP individual
          </button>
        </div>
      </div>

      {/* Generate button */}
      <button
        id="generate-pdf-button"
        className="btn-glow w-full text-base py-3.5"
        onClick={handleGenerate}
        disabled={disabled || items.length === 0 || progress.status === 'processing'}
      >
        {buttonContent}
      </button>

      {items.length > RECOMMENDED_BATCH_SIZE && items.length <= MAX_BATCH_SIZE && (
        <div
          className="p-3 rounded-lg text-xs"
          style={{
            background: 'rgba(251, 191, 36, 0.1)',
            border: '1px solid rgba(251, 191, 36, 0.25)',
            color: 'var(--warning)',
          }}
        >
          Este lote tiene {items.length} {label}. Para mejor rendimiento,
          recomendamos generar en bloques de hasta {RECOMMENDED_BATCH_SIZE}.
        </div>
      )}

      {/* Progress bar */}
      {progress.status === 'processing' && (
        <div className="space-y-2 animate-fade-in">
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {progress.message}
            </p>
            <p className="text-xs font-medium" style={{ color: 'var(--accent)' }}>
              {progressPercent}%
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {progress.status === 'error' && (
        <div
          className="flex items-center gap-2 p-3 rounded-lg text-sm animate-scale-in"
          style={{
            background: 'rgba(248, 113, 113, 0.1)',
            border: '1px solid rgba(248, 113, 113, 0.2)',
            color: 'var(--error)',
          }}
        >
          <span>❌</span>
          <span>{progress.message}</span>
        </div>
      )}

      {/* Success */}
      {progress.status === 'complete' && (
        <div
          className="flex items-center gap-2 p-3 rounded-lg text-sm animate-scale-in"
          style={{
            background: 'rgba(52, 211, 153, 0.1)',
            border: '1px solid rgba(52, 211, 153, 0.2)',
            color: 'var(--success)',
          }}
        >
          <span>🎉</span>
          <span>{progress.message}</span>
          <button
            className="ml-auto text-xs underline hover:no-underline"
            onClick={handleGenerate}
          >
            Generar de nuevo
          </button>
        </div>
      )}

      {/* Hidden render container */}
      <div ref={renderContainerRef} className="pdf-render-container">
        {items.map((ficha) => (
          <FichaPracticasTemplate
            key={`${ficha.practicante.dni ?? 'sin-dni'}-${ficha.practicante._sheet ?? 'sheet'}-${ficha.practicante._rowIndex ?? 0}`}
            data={ficha}
          />
        ))}
      </div>
    </div>
  );
}
