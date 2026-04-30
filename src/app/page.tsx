'use client';

import { useState, useCallback } from 'react';
import type { SchoolConfig, ExcelRow, DiplomaData } from '@/lib/types';
import { schoolConfigs, getMockExcelData } from '@/mocks/mock-data';
import { validateExcelHeaders, getPreviewRows } from '@/lib/excel-parser';
import { mapExcelToStudents, buildDiplomaData } from '@/lib/mapping-engine';
import SchoolSelector from '@/components/SchoolSelector';
import FileUploader from '@/components/FileUploader';
import DemoModeToggle from '@/components/DemoModeToggle';
import DiplomaPreview from '@/components/DiplomaPreview';
import GenerateButton from '@/components/GenerateButton';

export default function HomePage() {
  const [isDemo, setIsDemo] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<SchoolConfig | null>(null);
  const [excelRows, setExcelRows] = useState<ExcelRow[]>([]);
  const [previewRows, setPreviewRows] = useState<ExcelRow[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [diplomas, setDiplomas] = useState<DiplomaData[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Process data whenever school or rows change
  const processData = useCallback(
    (rows: ExcelRow[], school: SchoolConfig) => {
      const validation = validateExcelHeaders(rows, school);
      if (!validation.isValid) {
        setValidationError(
          `Columnas faltantes en el Excel: ${validation.missingColumns.join(', ')}. ` +
            `Se esperaban las columnas: ${Object.keys(school.mapeoColumnas).join(', ')}`
        );
        setDiplomas([]);
        return;
      }

      setValidationError(null);
      const students = mapExcelToStudents(rows, school);
      const diplomaData = buildDiplomaData(students, school);
      setDiplomas(diplomaData);
    },
    []
  );

  // Handle demo mode toggle
  const handleDemoToggle = useCallback(
    (enabled: boolean) => {
      setIsDemo(enabled);
      if (enabled) {
        const defaultSchool = schoolConfigs[0];
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
    },
    [processData]
  );

  // Handle school selection
  const handleSchoolSelect = useCallback(
    (school: SchoolConfig) => {
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
    },
    [isDemo, excelRows, processData]
  );

  // Handle file upload
  const handleFileLoaded = useCallback(
    (rows: ExcelRow[], file: File) => {
      setExcelRows(rows);
      setPreviewRows(getPreviewRows(rows, 3));
      setFileName(file.name);
      if (selectedSchool) {
        processData(rows, selectedSchool);
      }
    },
    [selectedSchool, processData]
  );

  return (
    <main className="flex-1 flex flex-col">
      {/* ============================================================
          Header
          ============================================================ */}
      <header className="py-8 px-6 text-center animate-fade-in">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
            <span
              style={{
                background: 'linear-gradient(135deg, #6C8CFF, #A78BFA, #C084FC)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Generador de Diplomas
            </span>
          </h1>
          <p
            className="text-base sm:text-lg max-w-2xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            Selecciona una escuela, sube los datos de tus alumnos y genera
            diplomas personalizados en segundos
          </p>
        </div>
      </header>

      {/* ============================================================
          Main Content
          ============================================================ */}
      <div className="flex-1 px-4 sm:px-6 pb-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* --------------------------------------------------------
              Left Panel: Controls
              -------------------------------------------------------- */}
          <div className="lg:col-span-2 space-y-5">
            {/* Demo Mode Card */}
            <div className="glass-card p-5 animate-slide-up">
              <DemoModeToggle isDemo={isDemo} onToggle={handleDemoToggle} />
              {isDemo && (
                <p
                  className="text-xs mt-3 animate-fade-in"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Los datos de prueba se cargan automáticamente.
                  Puedes cambiar de escuela para ver diferentes configuraciones.
                </p>
              )}
            </div>

            {/* School Selector Card */}
            <div className="glass-card p-5 animate-slide-up delay-100">
              <SchoolSelector
                schools={schoolConfigs}
                selectedSchool={selectedSchool}
                onSelect={handleSchoolSelect}
              />
            </div>

            {/* File Uploader Card */}
            {!isDemo && (
              <div className="glass-card p-5 animate-slide-up delay-200">
                <FileUploader
                  onFileLoaded={handleFileLoaded}
                  previewRows={previewRows}
                  fileName={fileName}
                  disabled={!selectedSchool}
                />
                {!selectedSchool && (
                  <p
                    className="text-xs mt-3 text-center"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Selecciona primero una escuela para habilitar la carga
                  </p>
                )}
              </div>
            )}

            {/* Validation Error */}
            {validationError && (
              <div
                className="glass-card p-4 animate-scale-in"
                style={{
                  borderColor: 'rgba(248, 113, 113, 0.3)',
                }}
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg">⚠️</span>
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: 'var(--warning)' }}
                    >
                      Error de validación
                    </p>
                    <p
                      className="text-xs mt-1"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {validationError}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Generate Button Card */}
            {diplomas.length > 0 && (
              <div className="glass-card p-5 animate-slide-up delay-300">
                <GenerateButton diplomas={diplomas} />
              </div>
            )}

            {/* Info Card */}
            <div
              className="glass-card p-5 animate-slide-up delay-400"
              style={{ borderColor: 'rgba(108, 140, 255, 0.08)' }}
            >
              <h3
                className="text-sm font-semibold mb-3"
                style={{ color: 'var(--accent)' }}
              >
                ℹ️ ¿Cómo funciona?
              </h3>
              <ol
                className="text-xs space-y-2 list-decimal list-inside"
                style={{ color: 'var(--text-muted)' }}
              >
                <li>Selecciona la escuela para la que quieres generar diplomas</li>
                <li>
                  Sube un archivo Excel (.xlsx) con los datos de los alumnos
                  <br />
                  <span className="ml-4 opacity-70">
                    o activa el Modo Demo para probar con datos de ejemplo
                  </span>
                </li>
                <li>
                  El sistema cruza las columnas del Excel con la configuración
                  de la escuela
                </li>
                <li>
                  Elige el formato de salida (PDF único o ZIP individual) y
                  descarga tus diplomas
                </li>
              </ol>
            </div>
          </div>

          {/* --------------------------------------------------------
              Right Panel: Preview
              -------------------------------------------------------- */}
          <div className="lg:col-span-3">
            <div className="glass-card p-5 animate-slide-up delay-200 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Vista previa</h2>
                {selectedSchool && (
                  <span
                    className="text-xs px-3 py-1 rounded-full"
                    style={{
                      background: `${selectedSchool.estilos.colorPrimario}20`,
                      color: selectedSchool.estilos.colorPrimario,
                      border: `1px solid ${selectedSchool.estilos.colorPrimario}30`,
                    }}
                  >
                    {selectedSchool.nombre}
                  </span>
                )}
              </div>
              <DiplomaPreview diplomas={diplomas} />
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          Footer
          ============================================================ */}
      <footer
        className="py-4 text-center text-xs"
        style={{ color: 'var(--text-muted)' }}
      >
        <p>
          Generador de Diplomas Multiescuela · Construido con Next.js ·{' '}
          {new Date().getFullYear()}
        </p>
      </footer>
    </main>
  );
}
