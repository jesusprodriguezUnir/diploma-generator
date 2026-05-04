import type { ExcelRow, FichaSchoolConfig, ExcelHeaderValidation } from '../types';

export function normalizeHeader(s: string): string {
  return s.trim().toUpperCase();
}

export const CORE_COLUMNS = ['PRIMER APELLIDO', 'NOMBRE', 'D.N.I.'] as const;

export const IDENTITY_ALIASES: Record<string, string[]> = {
  NOMBRE: ['NOMBRE'],
  'PRIMER APELLIDO': ['PRIMER APELLIDO', 'APELLIDO 1', 'APELLIDO1'],
  'D.N.I.': ['D.N.I.', 'DNI', 'NIF', 'NIE'],
};

export function validateExcelHeaders(
  rows: ExcelRow[],
  config: FichaSchoolConfig
): ExcelHeaderValidation {
  if (rows.length === 0) {
    return {
      isValid: false,
      missingColumns: Object.keys(config.mapeoColumnas),
      foundColumns: [],
    };
  }

  const excelHeaders = new Set(Object.keys(rows[0]).map(normalizeHeader));
  const requiredColumns = Object.keys(config.mapeoColumnas);

  const foundColumns = requiredColumns.filter((col) => excelHeaders.has(normalizeHeader(col)));
  const missingColumns = requiredColumns.filter((col) => !excelHeaders.has(normalizeHeader(col)));

  const coreSet = new Set(CORE_COLUMNS as readonly string[]);
  const coreMissing = missingColumns.filter((col) => coreSet.has(col.trim()));

  return { isValid: coreMissing.length === 0, missingColumns, foundColumns };
}
