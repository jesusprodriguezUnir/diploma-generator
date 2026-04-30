import * as XLSX from 'xlsx';
import type { ExcelRow, SchoolConfig, ValidationResult } from './types';

/**
 * Lee un archivo .xlsx y devuelve un array de objetos clave-valor.
 * Cada objeto representa una fila del Excel, usando los headers como claves.
 */
export async function parseExcelFile(file: File): Promise<ExcelRow[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });

  // Usamos la primera hoja
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    throw new Error('El archivo Excel no contiene hojas de cálculo.');
  }

  const worksheet = workbook.Sheets[firstSheetName];
  if (!worksheet) {
    throw new Error('No se pudo leer la hoja de cálculo.');
  }

  const rows: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet, {
    defval: '',
    raw: false,
  });

  if (rows.length === 0) {
    throw new Error('El archivo Excel está vacío o no contiene datos.');
  }

  return rows;
}

/**
 * Valida que las columnas del Excel coinciden con el mapeo de la escuela.
 * Devuelve las columnas encontradas y las faltantes.
 */
export function validateExcelHeaders(
  rows: ExcelRow[],
  config: SchoolConfig
): ValidationResult {
  if (rows.length === 0) {
    return {
      isValid: false,
      missingColumns: Object.keys(config.mapeoColumnas),
      foundColumns: [],
    };
  }

  const excelHeaders = Object.keys(rows[0]);
  const requiredColumns = Object.keys(config.mapeoColumnas);

  const foundColumns = requiredColumns.filter((col) =>
    excelHeaders.includes(col)
  );
  const missingColumns = requiredColumns.filter(
    (col) => !excelHeaders.includes(col)
  );

  return {
    isValid: missingColumns.length === 0,
    missingColumns,
    foundColumns,
  };
}

/**
 * Devuelve las primeras N filas para preview.
 */
export function getPreviewRows(rows: ExcelRow[], count: number = 3): ExcelRow[] {
  return rows.slice(0, count);
}
