'use client';

import { useState, useCallback, useMemo, type ReactNode, useEffect } from 'react';
import Image from 'next/image';
import type {
  ExcelRow,
  FichaData,
  Practicante,
  FichaSchoolConfig,
} from '@/lib/types';
import { mockFichaRows, fichaSchoolConfig as defaultSchoolConfig } from '@/mocks/mock-fichas';
import { validateExcelHeaders, filterEmptyPracticantes } from '@/lib/excel-parser';
import { mapExcelToPracticantes } from '@/lib/mapping-engine';
import DemoModeToggle from '@/components/DemoModeToggle';
import GenerateButton from '@/components/GenerateButton';
import StudentSelector from '@/components/StudentSelector';
import FichaPracticasTemplate from '@/components/FichaPracticasTemplate';
import ConfigManager from '@/components/ConfigManager';
import FieldEditor from '@/components/FieldEditor';

export default function HomePage() {
  // ─── Configuración activa ────────────────────────────────────────────────
  const [activeConfig, setActiveConfig] = useState<FichaSchoolConfig>(defaultSchoolConfig);

  // ─── Estado modo ficha ────────────────────────────────────────────────────
  const [isFichaDemo, setIsFichaDemo] = useState(false);
  const [fichaFileName, setFichaFileName] = useState<string>('');
  const [practicantes, setPracticantes] = useState<Practicante[]>([]);
  const [selectedPracticantes, setSelectedPracticantes] = useState<Set<number>>(new Set());
  const [fichaError, setFichaError] = useState<string | null>(null);
  const [previewFichaIndex, setPreviewFichaIndex] = useState<number | null>(null);

  // ─── Ediciones ───────────────────────────────────────────────────────────
  const [editions, setEditions] = useState<Record<number, Partial<Practicante>>>({});

  // Cargar configuración guardada si existe
  useEffect(() => {
    const saved = localStorage.getItem('last_school_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as FichaSchoolConfig;
        
        // Migración automática de rutas de firma y sello antiguas si se detectan
        if (parsed.id === 'escuela-recuerdo') {
          if (parsed.valoresFijos.firma_escuela === '/logos/firma-recuerdo-vinuesa.jpg') {
            parsed.valoresFijos.firma_escuela = '/logos/recuerdo/firma.jpg';
          }
          if (parsed.valoresFijos.sello_escuela === '/logos/sello-recuerdo-vinuesa.jpg') {
            parsed.valoresFijos.sello_escuela = '/logos/recuerdo/sello.jpg';
          }
          // Asegurar que las nuevas columnas de nacionalidad y NIF estén presentes si no lo estaban
          if (!parsed.mapeoColumnas['NACIONALIDAD']) {
            parsed.mapeoColumnas['NACIONALIDAD'] = 'nacionalidad';
            parsed.mapeoColumnas['PAÍS'] = 'nacionalidad';
            parsed.mapeoColumnas['NAC'] = 'nacionalidad';
            parsed.mapeoColumnas['NIF ENTIDAD'] = 'nif_entidad';
            parsed.mapeoColumnas['NIF'] = 'nif_entidad';
          }
        } else if (parsed.id === 'escuela-enforex') {
          if (parsed.valoresFijos.firma_escuela === '/logos/Firma Enforex Rubén.png') {
            parsed.valoresFijos.firma_escuela = '/logos/enforex/firmaysello.png';
            parsed.valoresFijos.sello_escuela = '';
            parsed.valoresFijos.firma_ancho_mm = '65';
            parsed.valoresFijos.firma_alto_mm = '25';
          }
          if (!parsed.mapeoColumnas['NACIONALIDAD']) {
            parsed.mapeoColumnas['NACIONALIDAD'] = 'nacionalidad';
            parsed.mapeoColumnas['PAÍS'] = 'nacionalidad';
            parsed.mapeoColumnas['NAC'] = 'nacionalidad';
            parsed.mapeoColumnas['NIF ENTIDAD'] = 'nif_entidad';
            parsed.mapeoColumnas['NIF'] = 'nif_entidad';
          }
        }
        
        setActiveConfig(parsed);
      } catch (e) {
        console.error('Error cargando config de localStorage', e);
      }
    }
  }, []);

  const handleConfigChange = useCallback((newConfig: FichaSchoolConfig) => {
    setActiveConfig(newConfig);
    localStorage.setItem('last_school_config', JSON.stringify(newConfig));
  }, []);

  // Practicantes con sus ediciones aplicadas
  const editedPracticantes = useMemo(() => {
    return practicantes.map((p, idx) => ({
      ...p,
      ...(editions[idx] || {})
    }));
  }, [practicantes, editions]);

  const selectedFichas: FichaData[] = useMemo(() => {
    return Array.from(selectedPracticantes)
      .sort((a, b) => a - b)
      .map((idx) => ({ 
        practicante: editedPracticantes[idx], 
        school: activeConfig 
      }));
  }, [selectedPracticantes, editedPracticantes, activeConfig]);

  // ─── Lógica modo ficha ────────────────────────────────────────────────────
  const processFichaData = useCallback((rows: ExcelRow[], config: FichaSchoolConfig) => {
    const validation = validateExcelHeaders(rows, config);
    if (!validation.isValid) {
      setFichaError(
        `Columnas esenciales no encontradas: ${validation.missingColumns.slice(0, 5).join(', ')}…`
      );
      setPracticantes([]);
      return;
    }
    setFichaError(null);
    const clean = filterEmptyPracticantes(rows);
    const mapped = mapExcelToPracticantes(clean, config);
    setPracticantes(mapped);
    setSelectedPracticantes(new Set());
    setEditions({}); // Limpiar ediciones al cargar nuevo archivo
    setPreviewFichaIndex(null);
  }, []);

  const handleFichaDemoToggle = useCallback((enabled: boolean) => {
    setIsFichaDemo(enabled);
    if (enabled) {
      setFichaFileName('datos-demo.xlsx');
      const mapped = mapExcelToPracticantes(mockFichaRows, activeConfig);
      setPracticantes(mapped);
      setFichaError(null);
    } else {
      setFichaFileName('');
      setPracticantes([]);
      setSelectedPracticantes(new Set());
      setEditions({});
      setFichaError(null);
      setPreviewFichaIndex(null);
    }
  }, [processFichaData, activeConfig]);

  const handleFichaFileLoaded = useCallback(async (rows: ExcelRow[], file: File) => {
    setFichaFileName(file.name);
    processFichaData(rows, activeConfig);
  }, [processFichaData, activeConfig]);

  const updateStudentEdition = (idx: number, updates: Partial<Practicante>) => {
    setEditions(prev => ({
      ...prev,
      [idx]: { ...(prev[idx] || {}), ...updates }
    }));
  };

  const resetStudentEdition = (idx: number) => {
    setEditions(prev => {
      const next = { ...prev };
      delete next[idx];
      return next;
    });
  };

  // Preview ficha: el índice seleccionado explícitamente o el primero de la selección
  let effectivePreviewIdx: number | null = null;
  if (previewFichaIndex !== null && editedPracticantes[previewFichaIndex]) {
    effectivePreviewIdx = previewFichaIndex;
  } else if (selectedPracticantes.size > 0) {
    effectivePreviewIdx = Array.from(selectedPracticantes).sort((a, b) => a - b)[0];
  }

  const previewFichas: FichaData[] = useMemo(() => {
    // Si hay seleccionados, mostramos todos los seleccionados
    if (selectedPracticantes.size > 0) {
      return Array.from(selectedPracticantes)
        .sort((a, b) => a - b)
        .map(idx => ({
          practicante: {
            ...practicantes[idx],
            ...(editions[idx] || {})
          },
          school: activeConfig
        }));
    }
    // Si no hay seleccionados pero hay uno clickeado (preview explicito)
    if (previewFichaIndex !== null && practicantes[previewFichaIndex]) {
      return [{
        practicante: {
          ...practicantes[previewFichaIndex],
          ...(editions[previewFichaIndex] || {})
        },
        school: activeConfig
      }];
    }
    return [];
  }, [selectedPracticantes, practicantes, editions, activeConfig, previewFichaIndex]);

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
              {activeConfig.nombre}
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
            <span
              style={{
                background: `linear-gradient(135deg, ${activeConfig.estilos.colorPrimario}, ${activeConfig.estilos.colorSecundario})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Fichas de Prácticas
            </span>
            </h1>
            <p className="text-base sm:text-lg max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
              Configura tu escuela, carga datos de alumnos y edita cada ficha antes de generar el PDF final.
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 px-4 sm:px-6 pb-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          <div className="lg:col-span-2 space-y-5">
            {/* GESTIÓN DE CONFIGURACIÓN */}
            <div className="animate-slide-up">
              <ConfigManager 
                config={activeConfig} 
                onConfigChange={handleConfigChange} 
              />
            </div>

            <div className="glass-card p-5 animate-slide-up delay-100">
              <DemoModeToggle isDemo={isFichaDemo} onToggle={handleFichaDemoToggle} />
              {isFichaDemo && (
                <p className="text-xs mt-3 animate-fade-in" style={{ color: 'var(--text-muted)' }}>
                  Cargando alumnos de ejemplo para la configuración actual.
                </p>
              )}
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
                  practicantes={editedPracticantes}
                  selected={selectedPracticantes}
                  onSelectionChange={setSelectedPracticantes}
                  onStudentClick={setPreviewFichaIndex}
                />
              </div>
            )}

            {selectedFichas.length > 0 && (
              <div className="glass-card p-5 animate-slide-up delay-400">
                <GenerateButton items={selectedFichas} />
              </div>
            )}

            <div className="glass-card p-5 animate-slide-up delay-500">
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                Firma activa
              </h3>
              <div className="rounded-xl p-3" style={{ background: '#ffffff', border: '1px solid #dbe3f0' }}>
                <div className="rounded-lg h-20 flex items-center justify-center" style={{ border: '1px dashed #9cb0cc' }}>
                  {activeConfig.valoresFijos.firma_escuela ? (
                    <Image
                      src={activeConfig.valoresFijos.firma_escuela}
                      alt="Firma"
                      width={220}
                      height={70}
                      unoptimized
                      style={{ objectFit: 'contain', maxHeight: '58px', width: 'auto' }}
                    />
                  ) : (
                    <span className="text-xs text-slate-400">Sin firma configurada</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {/* EDITOR DE CAMPOS */}
            {selectedPracticantes.size === 1 && effectivePreviewIdx !== null && (
              <div className="glass-card p-6 animate-slide-up">
                <FieldEditor 
                  key={`editor-${effectivePreviewIdx}`}
                  practicante={editedPracticantes[effectivePreviewIdx]}
                  schoolConfig={activeConfig}
                  onUpdate={(updates) => updateStudentEdition(effectivePreviewIdx!, updates)}
                  onReset={() => resetStudentEdition(effectivePreviewIdx!)}
                />
              </div>
            )}

            {/* VISTA PREVIA */}
            <div className="glass-card p-5 animate-slide-up delay-200 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Vista previa</h2>
                {previewFichas.length > 0 && (
                  <span
                    className="text-xs px-3 py-1 rounded-full"
                    style={{ background: 'rgba(15, 118, 110, 0.1)', color: activeConfig.estilos.colorPrimario, border: `1px solid ${activeConfig.estilos.colorPrimario}33` }}
                  >
                    {previewFichas.length === 1 
                      ? `${previewFichas[0].practicante.apellido1} ${previewFichas[0].practicante.nombre}`
                      : `${previewFichas.length} alumnos en vista previa`}
                  </span>
                )}
              </div>

              {previewFichas.length > 0 ? (
                <div className="overflow-auto rounded-xl p-4 space-y-8" style={{ background: 'linear-gradient(180deg, #edf3ff, #e5f6f4)', border: '1px solid var(--card-border)', maxHeight: '80vh' }}>
                  {previewFichas.map((ficha, fIdx) => (
                    <div key={`preview-container-${fIdx}`} className="relative">
                      {previewFichas.length > 1 && (
                        <div className="absolute -top-4 left-4 z-10 bg-white px-2 py-0.5 rounded shadow-sm border border-slate-200 text-[10px] font-bold text-slate-500">
                          FICHA {fIdx + 1}
                        </div>
                      )}
                      <div style={{ transform: 'scale(0.52)', transformOrigin: 'top center', width: '210mm', margin: '0 auto' }}>
                        <FichaPracticasTemplate 
                          key={`preview-${ficha.practicante.dni}-${activeConfig.id}`}
                          data={ficha} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center" style={{ color: 'var(--text-muted)' }}>
                  <div className="text-5xl mb-4 opacity-40">📋</div>
                  <p className="text-lg font-medium mb-1">Sin fichas que mostrar</p>
                  <p className="text-sm">
                    {practicantes.length > 0
                      ? 'Selecciona un alumno para editarlo y ver la vista previa'
                      : 'Carga una configuración y un archivo Excel'}
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <footer className="py-4 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
        <p>Generador de Fichas de Prácticas · {activeConfig.nombre} · {new Date().getFullYear()}</p>
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
