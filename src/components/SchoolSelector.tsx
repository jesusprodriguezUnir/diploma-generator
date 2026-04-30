'use client';

import { type SchoolConfig } from '@/lib/types';

interface SchoolSelectorProps {
  schools: SchoolConfig[];
  selectedSchool: SchoolConfig | null;
  onSelect: (school: SchoolConfig) => void;
  disabled?: boolean;
}

export default function SchoolSelector({
  schools,
  selectedSchool,
  onSelect,
  disabled = false,
}: SchoolSelectorProps) {
  return (
    <div className="space-y-3">
      <label
        htmlFor="school-selector"
        className="block text-sm font-medium"
        style={{ color: 'var(--text-secondary)' }}
      >
        Selecciona una escuela
      </label>

      <select
        id="school-selector"
        className="custom-select w-full"
        value={selectedSchool?.id || ''}
        onChange={(e) => {
          const school = schools.find((s) => s.id === e.target.value);
          if (school) onSelect(school);
        }}
        disabled={disabled}
      >
        <option value="" disabled>
          — Elige una escuela —
        </option>
        {schools.map((school) => (
          <option key={school.id} value={school.id}>
            {school.nombre}
          </option>
        ))}
      </select>

      {/* Color preview */}
      {selectedSchool && (
        <div className="flex items-center gap-3 mt-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full ring-2 ring-white/10"
              style={{ backgroundColor: selectedSchool.estilos.colorPrimario }}
            />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Primario
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full ring-2 ring-white/10"
              style={{ backgroundColor: selectedSchool.estilos.colorSecundario }}
            />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Secundario
            </span>
          </div>
          <span
            className="ml-auto text-xs px-2 py-1 rounded-md"
            style={{
              color: selectedSchool.estilos.colorPrimario,
              background: `${selectedSchool.estilos.colorPrimario}15`,
            }}
          >
            {Object.keys(selectedSchool.mapeoColumnas).length} columnas mapeadas
          </span>
        </div>
      )}
    </div>
  );
}
