import * as XLSX from 'xlsx';
import type { ExcelRow, SchoolConfig, ValidationResult, FichaSchoolConfig } from './types';

/**
 * Lee un archivo .xlsx y devuelve un array de objetos clave-valor.
 * Cada objeto representa una fila del Excel, usando los headers como claves.
 */
export async function parseExcelFile(file: File): Promise<ExcelRow[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });

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
 * Lee todas las hojas de un .xlsx y las concatena en un único array.
 * Las cabeceras deben estar en headerRowIndex (0-based). Las filas
 * anteriores se descartan. Añade _sheet y _rowIndex como metadatos.
 * Normaliza las claves (trim) para tolerar espacios finales inconsistentes.
 */
export async function parseExcelFileMultiSheet(
  file: File,
  opts: { headerRowIndex?: number } = {}
): Promise<ExcelRow[]> {
  const { headerRowIndex = 0 } = opts;
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });

  if (workbook.SheetNames.length === 0) {
    throw new Error('El archivo Excel no contiene hojas de cálculo.');
  }

  const allRows: ExcelRow[] = [];

  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) continue;

    const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
      range: headerRowIndex,
      defval: '',
      raw: false,
    });

    for (let i = 0; i < rawRows.length; i++) {
      const raw = rawRows[i];
      // Normalizar claves (trim) para tolerar espacios finales en cabeceras
      const row: ExcelRow = {};
      for (const [key, val] of Object.entries(raw)) {
        const trimmedKey = key.trim();
        // Convertir fechas de JS Date a string dd/mm/yyyy
        if (val instanceof Date) {
          row[trimmedKey] = formatDateToString(val);
        } else {
          row[trimmedKey] = val as string | number | undefined;
        }
      }
      row['_sheet'] = sheetName;
      row['_rowIndex'] = i;
      allRows.push(row);
    }
  }

  if (allRows.length === 0) {
    throw new Error('El archivo Excel está vacío o no contiene datos tras las cabeceras.');
  }

  return allRows;
}

function formatDateToString(date: Date): string {
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

/**
 * Filtra filas vacías para modo Ficha: descarta filas donde los campos
 * clave (nombre, apellido1, dni) están todos vacíos.
 */
export function filterEmptyPracticantes(rows: ExcelRow[]): ExcelRow[] {
  return rows.filter((row) => {
    const nombre = String(row['NOMBRE'] ?? '').trim();
    const apellido1 = String(row['PRIMER APELLIDO'] ?? '').trim();
    const dni = String(row['D.N.I.'] ?? '').trim();
    return nombre !== '' || apellido1 !== '' || dni !== '';
  });
}

/**
 * Valida que las columnas del Excel coinciden con el mapeo de la escuela.
 * Para fichas de prácticas usa matcheo tolerante (trim de clave y valor).
 */
export function validateExcelHeaders(
  rows: ExcelRow[],
  config: SchoolConfig | FichaSchoolConfig
): ValidationResult {
  if (rows.length === 0) {
    return {
      isValid: false,
      missingColumns: Object.keys(config.mapeoColumnas),
      foundColumns: [],
    };
  }

  const excelHeaders = Object.keys(rows[0]).map((h) => h.trim());
  const requiredColumns = Object.keys(config.mapeoColumnas);

  const foundColumns = requiredColumns.filter((col) =>
    excelHeaders.includes(col.trim())
  );
  const missingColumns = requiredColumns.filter(
    (col) => !excelHeaders.includes(col.trim())
  );

  // Para fichas, solo requerimos las columnas "core" de identidad del alumno
  const isFicha = (config as FichaSchoolConfig).modo === 'ficha';
  const coreColumns = isFicha
    ? ['PRIMER APELLIDO', 'NOMBRE', 'D.N.I.']
    : requiredColumns;

  const coreMissing = missingColumns.filter((col) =>
    coreColumns.includes(col.trim())
  );

  return {
    isValid: coreMissing.length === 0,
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
