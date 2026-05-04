'use client';

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import type { ExcelRow, Practicante, FichaData } from '@/lib/types';
import { filterEmptyPracticantes, validateExcelHeaders } from '@/lib/excel/parser';
import { mapExcelToPracticantes } from '@/lib/mapping/engine';
import { mockFichaRows } from '@/mocks/mock-fichas';
import { useConfig } from '@/features/config/ConfigContext';

interface StudentsContextValue {
  rows: ExcelRow[];
  practicantes: Practicante[];
  editedPracticantes: Practicante[];
  editions: Record<number, Partial<Practicante>>;
  selectedPracticantes: Set<number>;
  previewFichaIndex: number | null;
  fileName: string;
  isDemo: boolean;
  error: string | null;
  selectedFichas: FichaData[];
  previewFichas: FichaData[];
  loadFromExcel: (rows: ExcelRow[], file: File) => void;
  loadDemo: () => void;
  clearAll: () => void;
  updateEdition: (idx: number, updates: Partial<Practicante>) => void;
  resetEdition: (idx: number) => void;
  setSelectedPracticantes: React.Dispatch<React.SetStateAction<Set<number>>>;
  setPreviewFichaIndex: React.Dispatch<React.SetStateAction<number | null>>;
}

export const StudentsContext = createContext<StudentsContextValue | null>(null);

export function StudentsProvider({ children }: { children: React.ReactNode }) {
  const { activeConfig } = useConfig();

  const [rows, setRows] = useState<ExcelRow[]>([]);
  const [editions, setEditions] = useState<Record<number, Partial<Practicante>>>({});
  const [selectedPracticantes, setSelectedPracticantes] = useState<Set<number>>(new Set());
  const [previewFichaIndex, setPreviewFichaIndex] = useState<number | null>(null);
  const [fileName, setFileName] = useState('');
  const [isDemo, setIsDemo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Derived: re-maps automatically when rows or activeConfig change
  const practicantes = useMemo(
    () => (rows.length > 0 ? mapExcelToPracticantes(rows, activeConfig) : []),
    [rows, activeConfig]
  );

  const editedPracticantes = useMemo(
    () => practicantes.map((p, idx) => ({ ...p, ...(editions[idx] || {}) })),
    [practicantes, editions]
  );

  const selectedFichas: FichaData[] = useMemo(
    () =>
      Array.from(selectedPracticantes)
        .sort((a, b) => a - b)
        .map((idx) => ({ practicante: editedPracticantes[idx], school: activeConfig })),
    [selectedPracticantes, editedPracticantes, activeConfig]
  );

  const previewFichas: FichaData[] = useMemo(() => {
    if (selectedPracticantes.size > 0) {
      return Array.from(selectedPracticantes)
        .sort((a, b) => a - b)
        .map((idx) => ({ practicante: editedPracticantes[idx], school: activeConfig }));
    }
    if (previewFichaIndex !== null && practicantes[previewFichaIndex]) {
      return [{ practicante: editedPracticantes[previewFichaIndex], school: activeConfig }];
    }
    return [];
  }, [selectedPracticantes, editedPracticantes, practicantes, activeConfig, previewFichaIndex]);

  const loadFromExcel = useCallback((excelRows: ExcelRow[], file: File) => {
    const validation = validateExcelHeaders(excelRows, activeConfig);
    if (!validation.isValid) {
      setError(`Columnas esenciales no encontradas: ${validation.missingColumns.slice(0, 5).join(', ')}…`);
      setRows([]);
      return;
    }
    setError(null);
    const clean = filterEmptyPracticantes(excelRows);
    setRows(clean);
    setFileName(file.name);
    setIsDemo(false);
    setSelectedPracticantes(new Set());
    setEditions({});
    setPreviewFichaIndex(null);
  }, [activeConfig]);

  const loadDemo = useCallback(() => {
    setRows(mockFichaRows);
    setFileName('datos-demo.xlsx');
    setIsDemo(true);
    setError(null);
    setSelectedPracticantes(new Set());
    setEditions({});
    setPreviewFichaIndex(null);
  }, []);

  const clearAll = useCallback(() => {
    setRows([]);
    setFileName('');
    setIsDemo(false);
    setError(null);
    setSelectedPracticantes(new Set());
    setEditions({});
    setPreviewFichaIndex(null);
  }, []);

  const updateEdition = useCallback((idx: number, updates: Partial<Practicante>) => {
    setEditions((prev) => ({ ...prev, [idx]: { ...(prev[idx] || {}), ...updates } }));
  }, []);

  const resetEdition = useCallback((idx: number) => {
    setEditions((prev) => {
      const next = { ...prev };
      delete next[idx];
      return next;
    });
  }, []);

  return (
    <StudentsContext.Provider
      value={{
        rows, practicantes, editedPracticantes, editions,
        selectedPracticantes, previewFichaIndex, fileName, isDemo, error,
        selectedFichas, previewFichas,
        loadFromExcel, loadDemo, clearAll,
        updateEdition, resetEdition,
        setSelectedPracticantes, setPreviewFichaIndex,
      }}
    >
      {children}
    </StudentsContext.Provider>
  );
}

export function useStudents(): StudentsContextValue {
  const ctx = useContext(StudentsContext);
  if (!ctx) throw new Error('useStudents must be used within StudentsProvider');
  return ctx;
}
