'use client';

import { useState, useCallback } from 'react';
import type {
  AppMode,
  SchoolConfig,
  FichaSchoolConfig,
  ExcelRow,
  DiplomaData,
  FichaData,
  Practicante,
} from '@/lib/types';
import { diplomaSchoolConfigs, getMockExcelData } from '@/mocks/mock-data';
import { mockFichaRows, fichaSchoolConfig } from '@/mocks/mock-fichas';
import { validateExcelHeaders, getPreviewRows, filterEmptyPracticantes } from '@/lib/excel-parser';
import { mapExcelToStudents, buildDiplomaData, mapExcelToPracticantes } from '@/lib/mapping-engine';
import SchoolSelector from '@/components/SchoolSelector';
import FileUploader from '@/components/FileUploader';
import DemoModeToggle from '@/components/DemoModeToggle';
import DiplomaPreview from '@/components/DiplomaPreview';
import GenerateButton from '@/components/GenerateButton';
import StudentSelector from '@/components/StudentSelector';
import FichaPracticasTemplate from '@/components/FichaPracticasTemplate';

export default function HomePage() {
  // ─── Modo de la app ───────────────────────────────────────────────────────
  const [mode, setMode] = useState<AppMode>('diploma');

  // ─── Estado modo diploma ──────────────────────────────────────────────────
  const [isDemo, setIsDemo] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<SchoolConfig | null>(null);
  const [excelRows, setExcelRows] = useState<ExcelRow[]>([]);
  const [previewRows, setPreviewRows] = useState<ExcelRow[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [diplomas, setDiplomas] = useState<DiplomaData[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

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

  // ─── Lógica modo diploma ──────────────────────────────────────────────────
  const processData = useCallback((rows: ExcelRow[], school: SchoolConfig) => {
    const validation = validateExcelHeaders(rows, school);
    if (!validation.isValid) {
      setValidationError(
        `Columnas faltantes: ${validation.missingColumns.join(', ')}. ` +
        `Se esperaban: ${Object.keys(school.mapeoColumnas).join(', ')}`
      );
      setDiplomas([]);
      return;
    }
    setValidationError(null);
    const students = mapExcelToStudents(rows, school);
    setDiplomas(buildDiplomaData(students, school));
  }, []);

  const handleDemoToggle = useCallback((enabled: boolean) => {
    setIsDemo(enabled);
    if (enabled) {
      const defaultSchool = diplomaSchoolConfigs[0];
      setSelectedSchool(defaultSchool);
      const mockRows = getMockExcelData(defaultSchool.id);
      setExcelRows(mockRows);
      setPreviewRows(getPreviewRows(mockRows, 3));
      setFileName('datos-demo.xlsx');
      processData(mockRows, defaultSchool);
    } else {
      setSelectedSchool(null);
      setExcelRows([]);
      setPreviewRows([]);
      setFileName('');
      setDiplomas([]);
      setValidationError(null);
    }
  }, [processData]);

  const handleSchoolSelect = useCallback((school: SchoolConfig) => {
    setSelectedSchool(school);
    if (isDemo) {
      const mockRows = getMockExcelData(school.id);
      setExcelRows(mockRows);
      setPreviewRows(getPreviewRows(mockRows, 3));
      setFileName('datos-demo.xlsx');
      processData(mockRows, school);
    } else if (excelRows.length > 0) {
      processData(excelRows, school);
    }
  }, [isDemo, excelRows, processData]);

  const handleFileLoaded = useCallback((rows: ExcelRow[], file: File) => {
    setExcelRows(rows);
    setPreviewRows(getPreviewRows(rows, 3));
    setFileName(file.name);
    if (selectedSchool) processData(rows, selectedSchool);
  }, [selectedSchool, processData]);

  // ─── Lógica modo ficha ────────────────────────────────────────────────────
  const processFichaData = useCallback((rows: ExcelRow[]) => {
    const school = fichaSchoolConfig as FichaSchoolConfig;
    const validation = validateExcelHeaders(rows, school);
    if (!validation.isValid) {
      setFichaError(
        `Columnas esenciales no encontradas: ${validation.missingColumns.slice(0, 5).join(', ')}…`
      );
      setPracticantes([]);
      return;
    }
    setFichaError(null);
    const clean = filterEmptyPracticantes(rows);
    const mapped = mapExcelToPracticantes(clean, school);
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

  const handleModeSwitch = (newMode: AppMode) => {
    setMode(newMode);
    // Reset ficha state when switching away
    if (newMode === 'diploma') {
      setIsFichaDemo(false);
      setPracticantes([]);
      setSelectedPracticantes(new Set());
      setFichaError(null);
      setPreviewFichaIndex(null);
    }
  };

  // Preview ficha: primer seleccionado, o null
  const previewFicha: FichaData | null =
    previewFichaIndex !== null && practicantes[previewFichaIndex]
      ? { practicante: practicantes[previewFichaIndex], school: fichaSchoolConfig }
      : selectedFichas.length > 0
      ? selectedFichas[0]
      : null;

  return (
    <main className="flex-1 flex flex-col">
      {/* ── Header ── */}
      <header className="py-8 px-6 text-center animate-fade-in">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
            <span
              style={{
                background:
                  mode === 'ficha'
                    ? 'linear-gradient(135deg, #1A2E5C, #8B6F2A)'
                    : 'linear-gradient(135deg, #6C8CFF, #A78BFA, #C084FC)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {mode === 'ficha'
                ? 'Fichas de Prácticas'
                : 'Generador de Diplomas'}
            </span>
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            {mode === 'ficha'
              ? 'Escuela Nuestra Señora del Recuerdo · Ficha Individual de Prácticas (Nuevo Modelo)'
              : 'Selecciona una escuela, sube los datos de tus alumnos y genera diplomas personalizados'}
          </p>

          {/* Mode toggle */}
          <div className="flex justify-center mt-4">
            <div
              className="flex rounded-xl overflow-hidden"
              style={{ border: '1px solid var(--card-border)', background: 'var(--surface)' }}
            >
              <button
                className="px-5 py-2 text-sm font-medium transition-all"
                style={{
                  background: mode === 'diploma' ? 'var(--accent)' : 'transparent',
                  color: mode === 'diploma' ? 'white' : 'var(--text-secondary)',
                }}
                onClick={() => handleModeSwitch('diploma')}
              >
                🎓 Diplomas
              </button>
              <button
                className="px-5 py-2 text-sm font-medium transition-all"
                style={{
                  background: mode === 'ficha' ? '#1A2E5C' : 'transparent',
                  color: mode === 'ficha' ? 'white' : 'var(--text-secondary)',
                  borderLeft: '1px solid var(--card-border)',
                }}
                onClick={() => handleModeSwitch('ficha')}
              >
                📋 Ficha de Prácticas
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <div className="flex-1 px-4 sm:px-6 pb-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── Panel izquierdo ── */}
          <div className="lg:col-span-2 space-y-5">

            {mode === 'diploma' ? (
              /* ── MODO DIPLOMA ── */
              <>
                <div className="glass-card p-5 animate-slide-up">
                  <DemoModeToggle isDemo={isDemo} onToggle={handleDemoToggle} />
                  {isDemo && (
                    <p className="text-xs mt-3 animate-fade-in" style={{ color: 'var(--text-muted)' }}>
                      Los datos de prueba se cargan automáticamente.
                    </p>
                  )}
                </div>

                <div className="glass-card p-5 animate-slide-up delay-100">
                  <SchoolSelector
                    schools={diplomaSchoolConfigs}
                    selectedSchool={selectedSchool}
                    onSelect={handleSchoolSelect}
                  />
                </div>

                {!isDemo && (
                  <div className="glass-card p-5 animate-slide-up delay-200">
                    <FileUploader
                      onFileLoaded={handleFileLoaded}
                      previewRows={previewRows}
                      fileName={fileName}
                      disabled={!selectedSchool}
                    />
                    {!selectedSchool && (
                      <p className="text-xs mt-3 text-center" style={{ color: 'var(--text-muted)' }}>
                        Selecciona primero una escuela
                      </p>
                    )}
                  </div>
                )}

                {validationError && (
                  <div className="glass-card p-4 animate-scale-in" style={{ borderColor: 'rgba(248, 113, 113, 0.3)' }}>
                    <div className="flex items-start gap-2">
                      <span className="text-lg">⚠️</span>
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--warning)' }}>Error de validación</p>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{validationError}</p>
                      </div>
                    </div>
                  </div>
                )}

                {diplomas.length > 0 && (
                  <div className="glass-card p-5 animate-slide-up delay-300">
                    <GenerateButton mode="diploma" items={diplomas} />
                  </div>
                )}
              </>
            ) : (
              /* ── MODO FICHA ── */
              <>
                {/* Demo toggle */}
                <div className="glass-card p-5 animate-slide-up">
                  <DemoModeToggle isDemo={isFichaDemo} onToggle={handleFichaDemoToggle} />
                  {isFichaDemo && (
                    <p className="text-xs mt-3 animate-fade-in" style={{ color: 'var(--text-muted)' }}>
                      Datos de ejemplo: Eduardo Cobián y Marina León (con prácticas completas) + Ana García (sin prácticas).
                    </p>
                  )}
                </div>

                {/* Escuela fija */}
                <div className="glass-card p-5 animate-slide-up delay-100">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ background: '#1A2E5C' }}
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

                {/* File uploader (multi-hoja, headerRowIndex: 3) */}
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
                    <GenerateButton mode="ficha" items={selectedFichas} />
                  </div>
                )}
              </>
            )}

            {/* Info card */}
            <div className="glass-card p-5 animate-slide-up delay-400" style={{ borderColor: 'rgba(108, 140, 255, 0.08)' }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--accent)' }}>
                ℹ️ ¿Cómo funciona?
              </h3>
              <ol className="text-xs space-y-2 list-decimal list-inside" style={{ color: 'var(--text-muted)' }}>
                {mode === 'diploma' ? (
                  <>
                    <li>Selecciona la escuela</li>
                    <li>Sube el Excel con los datos de alumnos o activa Demo</li>
                    <li>Genera el PDF único o ZIP individual</li>
                  </>
                ) : (
                  <>
                    <li>Sube el Excel de alumnos MTL (todas las hojas se leen juntas)</li>
                    <li>Selecciona los alumnos para los que generar la ficha</li>
                    <li>Genera PDF único o ZIP con una ficha por alumno</li>
                  </>
                )}
              </ol>
            </div>
          </div>

          {/* ── Panel derecho (preview) ── */}
          <div className="lg:col-span-3">
            <div className="glass-card p-5 animate-slide-up delay-200 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Vista previa</h2>
                {mode === 'ficha' && previewFicha && (
                  <span
                    className="text-xs px-3 py-1 rounded-full"
                    style={{ background: '#1A2E5C20', color: '#1A2E5C', border: '1px solid #1A2E5C30' }}
                  >
                    {previewFicha.practicante.apellido1} {previewFicha.practicante.apellido2} {previewFicha.practicante.nombre}
                  </span>
                )}
              </div>

              {mode === 'diploma' ? (
                <DiplomaPreview diplomas={diplomas} />
              ) : previewFicha ? (
                <div className="overflow-auto rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--card-border)' }}>
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
        <p>Generador de Diplomas & Fichas de Prácticas · Escuela Nuestra Señora del Recuerdo · {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}

/* ── Subcomponente: FileUploader para modo ficha (multi-hoja) ── */
function FichaFileUploader({
  onFileLoaded,
  fileName,
}: {
  onFileLoaded: (rows: import('@/lib/types').ExcelRow[], file: File) => void;
  fileName: string;
}) {
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
          {isLoading ? (
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Leyendo Excel (todas las hojas)…</p>
          ) : fileName ? (
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>📊 {fileName}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Haz clic para cambiar el archivo</p>
            </div>
          ) : (
            <div>
              <p className="text-2xl mb-2">📊</p>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Arrastra el Excel aquí o haz clic
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                Lee todas las hojas · Cabeceras en fila 4
              </p>
            </div>
          )}
        </div>
        <input type="file" accept=".xlsx,.xls" className="hidden" onChange={handleChange} />
      </label>
      {error && (
        <p className="text-xs mt-2" style={{ color: 'var(--error)' }}>{error}</p>
      )}
    </div>
  );
}
