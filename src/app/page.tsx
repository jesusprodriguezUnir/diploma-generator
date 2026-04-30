'use client';

import { useState, useCallback, type ReactNode } from 'react';
import Image from 'next/image';
import type {
  ExcelRow,
  FichaData,
  Practicante,
} from '@/lib/types';
import { mockFichaRows, fichaSchoolConfig } from '@/mocks/mock-fichas';
import { validateExcelHeaders, filterEmptyPracticantes } from '@/lib/excel-parser';
import { mapExcelToPracticantes } from '@/lib/mapping-engine';
import DemoModeToggle from '@/components/DemoModeToggle';
import GenerateButton from '@/components/GenerateButton';
import StudentSelector from '@/components/StudentSelector';
import FichaPracticasTemplate from '@/components/FichaPracticasTemplate';

export default function HomePage() {
  // ─── Estado modo ficha ────────────────────────────────────────────────────
  const [isFichaDemo, setIsFichaDemo] = useState(false);
  const [fichaFileName, setFichaFileName] = useState<string>('');
  const [practicantes, setPracticantes] = useState<Practicante[]>([]);
  const [selectedPracticantes, setSelectedPracticantes] = useState<Set<number>>(new Set());
  const [fichaError, setFichaError] = useState<string | null>(null);
  const [previewFichaIndex, setPreviewFichaIndex] = useState<number | null>(null);

  const selectedFichas: FichaData[] = Array.from(selectedPracticantes)
    .sort((a, b) => a - b)
    .map((idx) => ({ practicante: practicantes[idx], school: fichaSchoolConfig }));

  // ─── Lógica modo ficha ────────────────────────────────────────────────────
  const processFichaData = useCallback((rows: ExcelRow[]) => {
    const validation = validateExcelHeaders(rows, fichaSchoolConfig);
    if (!validation.isValid) {
      setFichaError(
        `Columnas esenciales no encontradas: ${validation.missingColumns.slice(0, 5).join(', ')}…`
      );
      setPracticantes([]);
      return;
    }
    setFichaError(null);
    const clean = filterEmptyPracticantes(rows);
    const mapped = mapExcelToPracticantes(clean, fichaSchoolConfig);
    setPracticantes(mapped);
    setSelectedPracticantes(new Set());
    setPreviewFichaIndex(null);
  }, []);

  const handleFichaDemoToggle = useCallback((enabled: boolean) => {
    setIsFichaDemo(enabled);
    if (enabled) {
      setFichaFileName('datos-demo.xlsx');
      processFichaData(mockFichaRows);
    } else {
      setFichaFileName('');
      setPracticantes([]);
      setSelectedPracticantes(new Set());
      setFichaError(null);
      setPreviewFichaIndex(null);
    }
  }, [processFichaData]);

  const handleFichaFileLoaded = useCallback(async (rows: ExcelRow[], file: File) => {
    setFichaFileName(file.name);
    processFichaData(rows);
  }, [processFichaData]);

  // Preview ficha: primer seleccionado, o null
  let previewFicha: FichaData | null = null;
  if (previewFichaIndex !== null && practicantes[previewFichaIndex]) {
    previewFicha = { practicante: practicantes[previewFichaIndex], school: fichaSchoolConfig };
  } else if (selectedFichas.length > 0) {
    previewFicha = selectedFichas[0];
  }

  const signatureSamples = [
    { label: 'Firma demo PNG', src: '/logos/firma-recuerdo-demo.png' },
    { label: 'Firma demo SVG', src: '/logos/firma-recuerdo-demo.svg' },
  ];

  return (
    <main className="flex-1 flex flex-col">
      <header className="pt-8 pb-6 px-5 sm:px-8 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card px-6 py-6 sm:px-8 sm:py-7">
            <p className="text-xs uppercase tracking-[0.22em] mb-3" style={{ color: 'var(--text-secondary)' }}>
              Escuela Nuestra Señora del Recuerdo
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
            <span
              style={{
                background: 'linear-gradient(135deg, #0f766e, #1d4ed8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Fichas de Prácticas
            </span>
            </h1>
            <p className="text-base sm:text-lg max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
              Flujo optimizado para cargar Excel, seleccionar alumnos y generar fichas individuales en PDF o ZIP.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 text-sm">
              <div className="rounded-xl px-4 py-3" style={{ background: 'var(--surface)', border: '1px solid var(--card-border)' }}>
                <p style={{ color: 'var(--text-muted)' }}>Código escuela</p>
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>6382 / 6490 · Madrid</p>
              </div>
              <div className="rounded-xl px-4 py-3" style={{ background: 'var(--surface)', border: '1px solid var(--card-border)' }}>
                <p style={{ color: 'var(--text-muted)' }}>Cabecera Excel</p>
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Fila 4 (headerRowIndex: 3)</p>
              </div>
              <div className="rounded-xl px-4 py-3" style={{ background: 'var(--surface)', border: '1px solid var(--card-border)' }}>
                <p style={{ color: 'var(--text-muted)' }}>Salida</p>
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>PDF único o ZIP individual</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 px-4 sm:px-6 pb-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          <div className="lg:col-span-2 space-y-5">
            <div className="glass-card p-5 animate-slide-up">
              <DemoModeToggle isDemo={isFichaDemo} onToggle={handleFichaDemoToggle} />
              {isFichaDemo && (
                <p className="text-xs mt-3 animate-fade-in" style={{ color: 'var(--text-muted)' }}>
                  Datos de ejemplo: Eduardo Cobián y Marina León (con prácticas completas) + Ana García (sin prácticas).
                </p>
              )}
            </div>

            <div className="glass-card p-5 animate-slide-up delay-100">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ background: 'linear-gradient(135deg, #0f766e, #1d4ed8)' }}
                >
                  R
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Escuela Nuestra Señora del Recuerdo
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Código: 6382 / 6490 · Madrid
                  </p>
                </div>
              </div>
            </div>

            {!isFichaDemo && (
              <div className="glass-card p-5 animate-slide-up delay-200">
                <FichaFileUploader
                  onFileLoaded={handleFichaFileLoaded}
                  fileName={fichaFileName}
                />
              </div>
            )}

            {fichaError && (
              <div className="glass-card p-4 animate-scale-in" style={{ borderColor: 'rgba(248, 113, 113, 0.3)' }}>
                <div className="flex items-start gap-2">
                  <span>⚠️</span>
                  <p className="text-xs" style={{ color: 'var(--warning)' }}>{fichaError}</p>
                </div>
              </div>
            )}

            {practicantes.length > 0 && (
              <div className="glass-card p-5 animate-slide-up delay-300">
                <StudentSelector
                  practicantes={practicantes}
                  selected={selectedPracticantes}
                  onSelectionChange={setSelectedPracticantes}
                />
              </div>
            )}

            {selectedFichas.length > 0 && (
              <div className="glass-card p-5 animate-slide-up delay-400">
                <GenerateButton items={selectedFichas} />
              </div>
            )}

            <div className="glass-card p-5 animate-slide-up delay-400" style={{ borderColor: 'rgba(15, 118, 110, 0.2)' }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--accent-secondary)' }}>
                ℹ️ ¿Cómo funciona?
              </h3>
              <ol className="text-xs space-y-2 list-decimal list-inside" style={{ color: 'var(--text-muted)' }}>
                <li>Sube el Excel de alumnos MTL (todas las hojas se leen juntas)</li>
                <li>Selecciona los alumnos para los que generar la ficha</li>
                <li>Genera PDF único o ZIP con una ficha por alumno</li>
              </ol>
            </div>

            <div className="glass-card p-5 animate-slide-up delay-500">
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                Firma de prueba en app
              </h3>
              <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                Comparativa visual de assets en public para validar nitidez, trazo y fondo antes de decidir firma final.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {signatureSamples.map((sample) => (
                  <div
                    key={sample.src}
                    className="rounded-xl p-3"
                    style={{ background: '#ffffff', border: '1px solid #dbe3f0' }}
                  >
                    <p className="text-xs font-semibold mb-2" style={{ color: '#1f3a60' }}>{sample.label}</p>
                    <div className="rounded-lg h-20 flex items-center justify-center" style={{ border: '1px dashed #9cb0cc' }}>
                      <Image
                        src={sample.src}
                        alt={sample.label}
                        width={220}
                        height={70}
                        unoptimized
                        style={{ objectFit: 'contain', maxHeight: '58px', width: 'auto' }}
                      />
                    </div>
                    <p className="text-[11px] mt-2 break-all" style={{ color: '#5d7091' }}>{sample.src}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="glass-card p-5 animate-slide-up delay-200 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Vista previa</h2>
                {previewFicha && (
                  <span
                    className="text-xs px-3 py-1 rounded-full"
                    style={{ background: '#0f766e20', color: '#0f766e', border: '1px solid #0f766e33' }}
                  >
                    {previewFicha.practicante.apellido1} {previewFicha.practicante.apellido2} {previewFicha.practicante.nombre}
                  </span>
                )}
              </div>

              {previewFicha ? (
                <div className="overflow-auto rounded-xl p-4" style={{ background: 'linear-gradient(180deg, #edf3ff, #e5f6f4)', border: '1px solid var(--card-border)' }}>
                  <div style={{ transform: 'scale(0.52)', transformOrigin: 'top center', width: '210mm', margin: '0 auto' }}>
                    <FichaPracticasTemplate data={previewFicha} />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center" style={{ color: 'var(--text-muted)' }}>
                  <div className="text-5xl mb-4 opacity-40">📋</div>
                  <p className="text-lg font-medium mb-1">Sin fichas que mostrar</p>
                  <p className="text-sm">
                    {practicantes.length > 0
                      ? 'Selecciona al menos un alumno para ver la vista previa'
                      : 'Sube el Excel de alumnos o activa el modo Demo'}
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <footer className="py-4 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
        <p>Generador de Fichas de Prácticas · Escuela Nuestra Señora del Recuerdo · {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}

/* ── Subcomponente: FileUploader para modo ficha (multi-hoja) ── */
function FichaFileUploader({
  onFileLoaded,
  fileName,
}: Readonly<{
  onFileLoaded: (rows: import('@/lib/types').ExcelRow[], file: File) => void;
  fileName: string;
}>) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = async (file: File) => {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setError('Solo se admiten archivos .xlsx o .xls');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const { parseExcelFileMultiSheet } = await import('@/lib/excel-parser');
      const rows = await parseExcelFileMultiSheet(file, { headerRowIndex: 3 });
      onFileLoaded(rows, file);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al leer el archivo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  let uploaderContent: ReactNode;
  if (isLoading) {
    uploaderContent = (
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        Leyendo Excel (todas las hojas)…
      </p>
    );
  } else if (fileName) {
    uploaderContent = (
      <div>
        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>📊 {fileName}</p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Haz clic para cambiar el archivo</p>
      </div>
    );
  } else {
    uploaderContent = (
      <div>
        <p className="text-2xl mb-2">📊</p>
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          Arrastra el Excel aquí o haz clic
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          Lee todas las hojas · Cabeceras en fila 4
        </p>
      </div>
    );
  }

  return (
    <div>
      <label
        className="block"
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        <div
          className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all"
          style={{
            borderColor: isDragOver ? 'var(--accent)' : 'var(--card-border)',
            background: isDragOver ? 'rgba(108,140,255,0.05)' : 'transparent',
          }}
        >
          {uploaderContent}
        </div>
        <input type="file" accept=".xlsx,.xls" className="hidden" onChange={handleChange} />
      </label>
      {error && (
        <p className="text-xs mt-2" style={{ color: 'var(--error)' }}>{error}</p>
      )}
    </div>
  );
}
