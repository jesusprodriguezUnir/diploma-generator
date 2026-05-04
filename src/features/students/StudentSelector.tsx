'use client';

import { useState, useMemo } from 'react';
import type { Practicante } from '@/lib/types';
import { useStudents } from '@/features/students/StudentsContext';

export default function StudentSelector() {
  const { editedPracticantes: practicantes, selectedPracticantes: selected, setSelectedPracticantes: onSelectionChange, setPreviewFichaIndex: onStudentClick } = useStudents();
  const [search, setSearch] = useState('');

  const hasPracticas = (p: Practicante) =>
    Boolean(p.lugar_practicas && String(p.lugar_practicas).trim() !== '');

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return practicantes.filter((p) => {
      if (!q) return true;
      const nombre = `${p.apellido1 ?? ''} ${p.apellido2 ?? ''} ${p.nombre ?? ''}`.toLowerCase();
      const dni = (p.dni ?? '').toLowerCase();
      const sheet = (p._sheet ?? '').toLowerCase();
      return nombre.includes(q) || dni.includes(q) || sheet.includes(q);
    });
  }, [practicantes, search]);

  const selectAll = () => {
    const next = new Set(selected);
    filtered.forEach((_, localIdx) => {
      const globalIdx = practicantes.indexOf(filtered[localIdx]);
      if (globalIdx !== -1) next.add(globalIdx);
    });
    onSelectionChange(next);
  };

  const deselectAll = () => {
    const next = new Set(selected);
    filtered.forEach((p) => {
      const globalIdx = practicantes.indexOf(p);
      if (globalIdx !== -1) next.delete(globalIdx);
    });
    onSelectionChange(next);
  };

  const selectWithPracticas = () => {
    const next = new Set<number>();
    practicantes.forEach((p, i) => {
      if (hasPracticas(p)) next.add(i);
    });
    onSelectionChange(next);
  };

  const toggle = (globalIdx: number) => {
    const next = new Set(selected);
    if (next.has(globalIdx)) {
      next.delete(globalIdx);
    } else {
      next.add(globalIdx);
    }
    onSelectionChange(next);
  };

  const conPracticas = practicantes.filter(hasPracticas).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
          {practicantes.length} alumnos · {selected.size} seleccionados
        </span>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {conPracticas} con prácticas completas
        </span>
      </div>

      {/* Búsqueda */}
      <input
        type="text"
        placeholder="Buscar por nombre, DNI o curso..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-3 py-2 rounded-lg text-sm"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--card-border)',
          color: 'var(--text-primary)',
          outline: 'none',
        }}
      />

      {/* Botones rápidos */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={selectAll}
          className="text-xs px-2 py-1 rounded transition-colors"
          style={{ background: 'var(--surface-hover)', color: 'var(--text-secondary)' }}
        >
          Marcar todos
        </button>
        <button
          onClick={deselectAll}
          className="text-xs px-2 py-1 rounded transition-colors"
          style={{ background: 'var(--surface-hover)', color: 'var(--text-secondary)' }}
        >
          Desmarcar todos
        </button>
        <button
          onClick={selectWithPracticas}
          className="text-xs px-2 py-1 rounded transition-colors"
          style={{ background: 'rgba(52,211,153,0.12)', color: 'var(--success)', border: '1px solid rgba(52,211,153,0.3)' }}
        >
          Solo con prácticas ({conPracticas})
        </button>
      </div>

      {/* Lista */}
      <div
        className="overflow-y-auto space-y-1 pr-1"
        style={{ maxHeight: '320px' }}
      >
        {filtered.map((p) => {
          const globalIdx = practicantes.indexOf(p);
          const isChecked = selected.has(globalIdx);
          const tieneP = hasPracticas(p);
          const nombreCompleto = `${p.apellido1 ?? ''} ${p.apellido2 ? p.apellido2 + ' ' : ''}${p.nombre ?? ''}`.trim();

          return (
            <label
              key={`${p._sheet}-${p._rowIndex}`}
              aria-label={`Seleccionar ${nombreCompleto || 'alumno'}`}
              className="student-row flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors"
              onClick={() => onStudentClick?.(globalIdx)}
              style={{
                background: isChecked ? 'rgba(108,140,255,0.08)' : 'var(--surface)',
                border: `1px solid ${isChecked ? 'rgba(108,140,255,0.3)' : 'var(--card-border)'}`,
              }}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => {
                  e.stopPropagation();
                  toggle(globalIdx);
                }}
                onClick={(e) => e.stopPropagation()}
                className="w-4 h-4 cursor-pointer"
                style={{ accentColor: 'var(--accent)' }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="text-sm font-medium truncate"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {nombreCompleto || '—'}
                  </span>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{ background: 'var(--surface-hover)', color: 'var(--text-muted)' }}
                  >
                    {p._sheet ?? ''}
                  </span>
                  {tieneP ? (
                    <span
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{ background: 'rgba(52,211,153,0.12)', color: 'var(--success)' }}
                    >
                      ✓ con prácticas
                    </span>
                  ) : (
                    <span
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{ background: 'rgba(251,191,36,0.12)', color: 'var(--warning)' }}
                    >
                      sin prácticas
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  {p.dni && (
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      DNI: {p.dni}
                    </span>
                  )}
                  {p.lugar_practicas && (
                    <span className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                      {p.lugar_practicas}
                    </span>
                  )}
                </div>
              </div>
            </label>
          );
        })}

        {filtered.length === 0 && (
          <div
            className="text-center py-6 text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            No se encontraron alumnos con esos criterios.
          </div>
        )}
      </div>
    </div>
  );
}
