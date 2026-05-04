'use client';

import Image from 'next/image';
import { useConfig } from '@/features/config/ConfigContext';
import { useStudents } from '@/features/students/StudentsContext';
import DemoModeToggle from '@/features/students/DemoModeToggle';
import GenerateButton from '@/features/generation/GenerateButton';
import StudentSelector from '@/features/students/StudentSelector';
import FichaPracticasTemplate from '@/features/fichas/FichaPracticasTemplate';
import ConfigManager from '@/features/config/ConfigManager';
import FieldEditor from '@/features/students/FieldEditor';
import FichaFileUploader from '@/features/students/FichaFileUploader';

export default function HomePage() {
  const { activeConfig } = useConfig();
  const {
    practicantes,
    editedPracticantes,
    selectedPracticantes,
    previewFichaIndex,
    fileName,
    isDemo,
    error: fichaError,
    previewFichas,
    selectedFichas,
    loadFromExcel,
    loadDemo,
    clearAll,
    updateEdition,
    resetEdition,
  } = useStudents();

  let effectivePreviewIdx: number | null = null;
  if (previewFichaIndex !== null && editedPracticantes[previewFichaIndex]) {
    effectivePreviewIdx = previewFichaIndex;
  } else if (selectedPracticantes.size > 0) {
    effectivePreviewIdx = Array.from(selectedPracticantes).sort((a, b) => a - b)[0];
  }

  const handleDemoToggle = (enabled: boolean) => {
    if (enabled) loadDemo();
    else clearAll();
  };

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
            <div className="animate-slide-up">
              <ConfigManager />
            </div>

            <div className="glass-card p-5 animate-slide-up delay-100">
              <DemoModeToggle isDemo={isDemo} onToggle={handleDemoToggle} />
              {isDemo && (
                <p className="text-xs mt-3 animate-fade-in" style={{ color: 'var(--text-muted)' }}>
                  Cargando alumnos de ejemplo para la configuración actual.
                </p>
              )}
            </div>

            {!isDemo && (
              <div className="glass-card p-5 animate-slide-up delay-200">
                <FichaFileUploader onFileLoaded={loadFromExcel} fileName={fileName} />
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
                <StudentSelector />
              </div>
            )}

            {selectedFichas.length > 0 && (
              <div className="glass-card p-5 animate-slide-up delay-400">
                <GenerateButton />
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
            {selectedPracticantes.size === 1 && effectivePreviewIdx !== null && (
              <div className="glass-card p-6 animate-slide-up">
                <FieldEditor
                  key={`editor-${effectivePreviewIdx}`}
                  practicante={editedPracticantes[effectivePreviewIdx]}
                  schoolConfig={activeConfig}
                  onUpdate={(updates) => updateEdition(effectivePreviewIdx!, updates)}
                  onReset={() => resetEdition(effectivePreviewIdx!)}
                />
              </div>
            )}

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
