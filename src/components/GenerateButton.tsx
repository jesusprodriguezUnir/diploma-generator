'use client';

import { useState, useRef, useCallback } from 'react';
import type { DiplomaData, GenerationProgress } from '@/lib/types';
import DiplomaTemplate from './DiplomaTemplate';

interface GenerateButtonProps {
  diplomas: DiplomaData[];
  disabled?: boolean;
}

type OutputMode = 'single' | 'zip';

export default function GenerateButton({
  diplomas,
  disabled = false,
}: GenerateButtonProps) {
  const [progress, setProgress] = useState<GenerationProgress>({
    status: 'idle',
    current: 0,
    total: 0,
    message: '',
  });
  const [outputMode, setOutputMode] = useState<OutputMode>('single');
  const renderContainerRef = useRef<HTMLDivElement>(null);

  const handleGenerate = useCallback(async () => {
    if (diplomas.length === 0) return;

    setProgress({
      status: 'processing',
      current: 0,
      total: diplomas.length,
      message: 'Preparando diplomas para renderizado...',
    });

    try {
      // Wait for next frame to ensure render container is populated
      await new Promise((r) => setTimeout(r, 500));

      const container = renderContainerRef.current;
      if (!container) throw new Error('No se encontró el contenedor de renderizado');

      const diplomaElements = container.querySelectorAll<HTMLElement>('.diploma-page');
      if (diplomaElements.length === 0) throw new Error('No se encontraron diplomas renderizados');

      const elements = Array.from(diplomaElements);

      const {
        generateAllPDFs,
        generateZipPDFs,
        downloadBlob,
      } = await import('@/lib/pdf-generator-client');

      if (outputMode === 'zip') {
        const studentNames = diplomas.map((d) => String(d.student.nombre_alumno));
        const blob = await generateZipPDFs(elements, studentNames, setProgress);
        downloadBlob(blob, `diplomas-${diplomas[0].school.id}.zip`);
      } else {
        const blob = await generateAllPDFs(elements, setProgress);
        downloadBlob(blob, `diplomas-${diplomas[0].school.id}.pdf`);
      }
    } catch (err) {
      setProgress({
        status: 'error',
        current: 0,
        total: diplomas.length,
        message:
          err instanceof Error ? err.message : 'Error desconocido al generar PDFs',
      });
    }
  }, [diplomas, outputMode]);

  const progressPercent =
    progress.total > 0
      ? Math.round((progress.current / progress.total) * 100)
      : 0;

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
              background:
                outputMode === 'single'
                  ? 'var(--accent)'
                  : 'transparent',
              color:
                outputMode === 'single' ? 'white' : 'var(--text-secondary)',
            }}
            onClick={() => setOutputMode('single')}
          >
            📄 PDF único
          </button>
          <button
            className="px-3 py-1.5 text-xs font-medium transition-colors"
            style={{
              background:
                outputMode === 'zip'
                  ? 'var(--accent)'
                  : 'transparent',
              color:
                outputMode === 'zip' ? 'white' : 'var(--text-secondary)',
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
        disabled={disabled || diplomas.length === 0 || progress.status === 'processing'}
      >
        {progress.status === 'processing' ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Generando...
          </span>
        ) : progress.status === 'complete' ? (
          <span className="flex items-center justify-center gap-2">
            ✅ ¡Descarga completada!
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            🎓 Generar {diplomas.length} diploma{diplomas.length !== 1 ? 's' : ''}{' '}
            {outputMode === 'zip' ? '(ZIP)' : '(PDF)'}
          </span>
        )}
      </button>

      {/* Progress bar */}
      {progress.status === 'processing' && (
        <div className="space-y-2 animate-fade-in">
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <p
              className="text-xs"
              style={{ color: 'var(--text-muted)' }}
            >
              {progress.message}
            </p>
            <p
              className="text-xs font-medium"
              style={{ color: 'var(--accent)' }}
            >
              {progressPercent}%
            </p>
          </div>
        </div>
      )}

      {/* Error message */}
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

      {/* Success message */}
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

      {/* Hidden render container for PDF generation */}
      <div ref={renderContainerRef} className="diploma-render-container">
        {diplomas.map((diploma, index) => (
          <DiplomaTemplate key={index} data={diploma} />
        ))}
      </div>
    </div>
  );
}
