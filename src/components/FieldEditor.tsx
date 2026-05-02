'use client';

import { useMemo } from 'react';
import type { Practicante } from '@/lib/types';

interface FieldEditorProps {
  practicante: Practicante;
  onUpdate: (updates: Partial<Practicante>) => void;
  onReset: () => void;
}

export default function FieldEditor({ practicante, onUpdate, onReset }: FieldEditorProps) {
  const sections = useMemo(() => [
    {
      title: '1. Datos Personales',
      fields: [
        { key: 'nombre', label: 'Nombre' },
        { key: 'apellido1', label: 'Primer Apellido' },
        { key: 'apellido2', label: 'Segundo Apellido' },
        { key: 'dni', label: 'DNI / NIE' },
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
        { key: 'entidad', label: 'Entidad' },
        { key: 'lugar_practicas', label: 'Lugar' },
        { key: 'fecha_inicio', label: 'Fecha Inicio' },
        { key: 'fecha_final', label: 'Fecha Fin' },
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
        { key: 'coordinador_escuela', label: 'Coordinador Escuela' },
      ]
    }
  ], []);

  const handleChange = (key: string, value: string) => {
    onUpdate({ [key]: value });
  };

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
              {section.fields.map((field) => (
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
                    value={String(practicante[field.key] ?? '')}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-full bg-surface border border-border-card rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-accent transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
