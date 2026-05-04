'use client';

import { useMemo } from 'react';
import type { Practicante, FichaSchoolConfig } from '@/lib/types';
import { TIPO_ACTIVIDAD_OPTIONS } from '@/lib/constants/activities';
import { WEEK_DAYS } from '@/lib/constants/week';

interface FieldEditorProps {
  practicante: Practicante;
  schoolConfig?: FichaSchoolConfig;
  onUpdate: (updates: Partial<Practicante>) => void;
  onReset: () => void;
}

export default function FieldEditor({ practicante, schoolConfig, onUpdate, onReset }: FieldEditorProps) {
  const sections = useMemo(() => [
    {
      title: '1. Datos Personales',
      fields: [
        { key: 'nombre', label: 'Nombre' },
        { key: 'apellido1', label: 'Primer Apellido' },
        { key: 'apellido2', label: 'Segundo Apellido' },
        { key: 'dni', label: 'DNI / NIE' },
        { key: 'nacionalidad', label: 'Nacionalidad' },
        { key: 'email', label: 'Email' },
        { key: 'telefono', label: 'Teléfono' },
      ]
    },
    {
      title: '2. Datos del Curso',
      fields: [
        { key: 'codigo_curso', label: 'Código Curso' },
        { key: 'fechas_curso', label: 'Fechas Curso (ej: 01/01 - 02/02)' },
        { key: 'titulacion', label: 'Titulación' },
      ]
    },
    {
      title: '3. Prácticas',
      fields: [
        { key: 'tipo_actividad', label: 'Tipo de Actividad' },
        { key: 'entidad', label: 'Entidad' },
        { key: 'nif_entidad', label: 'NIF Entidad' },
        { key: 'lugar_practicas', label: 'Lugar' },
        { key: 'fecha_inicio', label: 'Fecha Inicio' },
        { key: 'fecha_final', label: 'Fecha Fin' },
        { key: 'dias_semana', label: 'Días Semana' },
        { key: 'horario', label: 'Horario' },
        { key: 'horas_planificadas', label: 'Horas Planificadas' },
        { key: 'horas_realizadas', label: 'Horas Realizadas' },
        { key: 'persona_contacto', label: 'Contacto' },
        { key: 'n_participantes', label: 'Nº Participantes' },
        { key: 'su_grupo', label: 'Su Grupo' },
      ]
    },
    {
      title: '4. Memoria y Otros',
      fields: [
        { key: 'titulo_memoria', label: 'Título Memoria' },
        { key: 'fecha_entrega_memoria', label: 'Fecha Entrega' },
        { key: 'coordinador_practicas', label: 'Coordinador Prácticas' },
        { key: 'titulacion_tutor', label: 'Titulación Tutor' },
        { key: 'coordinador_escuela', label: 'Coordinador Escuela' },
      ]
    }
  ], []);

  const handleChange = (key: keyof Practicante, value: string) => {
    onUpdate({ [key]: value } as Partial<Practicante>);
  };

  const handleDayToggle = (day: string) => {
    const current = String(practicante.dias_semana || '');
    let daysArray = current.split(',').map(d => d.trim()).filter(Boolean);
    if (daysArray.includes(day)) {
      daysArray = daysArray.filter(d => d !== day);
    } else {
      daysArray.push(day);
    }
    // Sort logic to maintain L M X J V S D order
    const days = WEEK_DAYS as readonly string[];
    daysArray.sort((a, b) => days.indexOf(a) - days.indexOf(b));
    handleChange('dias_semana', daysArray.join(','));
  };

  const tipoActividadActual = practicante.tipo_actividad || schoolConfig?.valoresFijos.tipo_actividad_default || '';

  return (
    <div className="space-y-4 animate-slide-up">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <span>✏️</span> Editor de Ficha
        </h3>
        <button 
          onClick={onReset}
          className="text-[10px] uppercase font-bold text-accent hover:underline"
        >
          Resetear a original del Excel
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 overflow-y-auto pr-2 max-h-[500px]">
        {sections.map((section) => (
          <div key={section.title} className="space-y-3">
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-muted border-b border-white/5 pb-1">
              {section.title}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {section.fields.map((field) => {
                if (field.key === 'tipo_actividad') {
                  return (
                    <div key={field.key} className="space-y-1 sm:col-span-2">
                      <label 
                        htmlFor={`field-${field.key}`}
                        className="text-[10px] font-medium text-muted"
                      >
                        {field.label}
                      </label>
                      <select
                        id={`field-${field.key}`}
                        value={tipoActividadActual}
onChange={(e) => handleChange(field.key as keyof Practicante, e.target.value)}
                        className="w-full bg-surface border border-border-card rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-accent transition-all"
                      >
                        {TIPO_ACTIVIDAD_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  );
                }

                if (field.key === 'dias_semana') {
                  const currentDays = String(practicante.dias_semana || '');
                  const isPernocta = tipoActividadActual === 'Campamento con pernocta';
                  
                  return (
                    <div key={field.key} className="space-y-1 sm:col-span-2">
                      <label className="text-[10px] font-medium text-muted">
                        {field.label} {isPernocta && <span className="text-accent/80 ml-1">(Se marcan todos por pernocta)</span>}
                      </label>
                      <div className="flex gap-2 items-center flex-wrap">
                        {WEEK_DAYS.map((day) => {
                          const isChecked = isPernocta || currentDays.includes(day);
                          return (
                            <label key={day} className={`flex items-center gap-1 cursor-pointer select-none px-2 py-1 rounded border transition-colors ${isChecked ? 'bg-accent/10 border-accent/50 text-accent' : 'bg-surface border-border-card text-muted hover:border-accent/30'} ${isPernocta ? 'opacity-70 cursor-not-allowed' : ''}`}>
                              <input
                                type="checkbox"
                                className="hidden"
                                checked={isChecked}
                                disabled={isPernocta}
                                onChange={() => handleDayToggle(day)}
                              />
                              <span className="text-xs font-bold">{day}</span>
                            </label>
                          );
                        })}
                        {!isPernocta && (
                          <button
                            onClick={() => handleChange('dias_semana', '')}
                            className="text-[10px] uppercase text-error/80 hover:text-error ml-2"
                          >
                            Limpiar
                          </button>
                        )}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={field.key} className="space-y-1">
                    <label 
                      htmlFor={`field-${field.key}`}
                      className="text-[10px] font-medium text-muted"
                    >
                      {field.label}
                    </label>
                    <input
                      id={`field-${field.key}`}
                      type="text"
                      value={String(practicante[field.key as keyof Practicante] ?? '')}
                      placeholder={
                        field.key === 'nif_entidad'
                          ? (schoolConfig?.valoresFijos.nif_entidad_default ?? '')
                          : field.key === 'entidad'
                            ? (schoolConfig?.valoresFijos.entidad_organizadora_default ?? '')
                            : ''
                      }
                      onChange={(e) => handleChange(field.key as keyof Practicante, e.target.value)}
                      className="w-full bg-surface border border-border-card rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-accent transition-all"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

