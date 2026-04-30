'use client';

import { useState } from 'react';
import type { DiplomaData } from '@/lib/types';
import DiplomaTemplate from './DiplomaTemplate';

interface DiplomaPreviewProps {
  diplomas: DiplomaData[];
}

export default function DiplomaPreview({ diplomas }: DiplomaPreviewProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (diplomas.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 text-center"
        style={{ color: 'var(--text-muted)' }}
      >
        <div className="text-5xl mb-4 opacity-40">📜</div>
        <p className="text-lg font-medium mb-1">Sin diplomas que mostrar</p>
        <p className="text-sm">
          Selecciona una escuela y sube un archivo Excel para generar la vista previa
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          {diplomas.length} diploma{diplomas.length !== 1 ? 's' : ''} generado
          {diplomas.length !== 1 ? 's' : ''}
        </p>
        {selectedIndex !== null && (
          <button
            className="text-xs font-medium px-3 py-1 rounded-lg transition-colors"
            style={{
              color: 'var(--accent)',
              background: 'var(--surface-hover)',
            }}
            onClick={() => setSelectedIndex(null)}
          >
            ← Volver al grid
          </button>
        )}
      </div>

      {selectedIndex !== null ? (
        /* Full preview of a single diploma */
        <div className="animate-scale-in">
          <div
            className="overflow-auto rounded-xl p-4"
            style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--card-border)',
            }}
          >
            <div style={{ transform: 'scale(0.65)', transformOrigin: 'top center', width: '297mm', margin: '0 auto' }}>
              <DiplomaTemplate data={diplomas[selectedIndex]} />
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <button
              className="text-sm px-3 py-1 rounded-lg transition-opacity hover:opacity-80"
              style={{ color: 'var(--text-secondary)' }}
              onClick={() =>
                setSelectedIndex(Math.max(0, selectedIndex - 1))
              }
              disabled={selectedIndex === 0}
            >
              ← Anterior
            </button>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {selectedIndex + 1} / {diplomas.length}
            </span>
            <button
              className="text-sm px-3 py-1 rounded-lg transition-opacity hover:opacity-80"
              style={{ color: 'var(--text-secondary)' }}
              onClick={() =>
                setSelectedIndex(
                  Math.min(diplomas.length - 1, selectedIndex + 1)
                )
              }
              disabled={selectedIndex === diplomas.length - 1}
            >
              Siguiente →
            </button>
          </div>
        </div>
      ) : (
        /* Grid of miniature diplomas */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
          {diplomas.map((diploma, index) => (
            <button
              key={index}
              className="group relative rounded-xl overflow-hidden cursor-pointer transition-all hover:ring-2"
              style={{
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--card-border)',
                '--tw-ring-color': 'var(--accent)',
              } as React.CSSProperties}
              onClick={() => setSelectedIndex(index)}
            >
              <div
                className="overflow-hidden"
                style={{
                  transform: 'scale(0.22)',
                  transformOrigin: 'top left',
                  width: '297mm',
                  height: '210mm',
                  pointerEvents: 'none',
                }}
              >
                <DiplomaTemplate data={diploma} />
              </div>

              {/* Overlay with student name */}
              <div
                className="absolute inset-0 flex items-end p-3 transition-opacity group-hover:opacity-100 opacity-0"
                style={{
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)',
                }}
              >
                <div>
                  <p className="text-sm font-medium text-white">
                    {diploma.student.nombre_alumno}
                  </p>
                  {diploma.student.nota && (
                    <p className="text-xs" style={{ color: 'var(--accent)' }}>
                      Nota: {diploma.student.nota}
                    </p>
                  )}
                </div>
              </div>

              {/* Index badge */}
              <div
                className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: 'rgba(0,0,0,0.6)',
                  color: 'var(--text-secondary)',
                }}
              >
                {index + 1}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
