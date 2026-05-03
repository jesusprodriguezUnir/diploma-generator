import * as XLSX from 'xlsx';
import type { ExcelRow, ValidationResult, FichaSchoolConfig } from './types';

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
  const getVal = (row: ExcelRow, ...aliases: string[]) => {
    const entry = Object.entries(row).find(([k]) => aliases.includes(k.trim().toUpperCase()));
    return String(entry ? entry[1] ?? '' : '').trim();
  };

  return rows.filter((row) => {
    const nombre = getVal(row, 'NOMBRE');
    const apellido1 = getVal(row, 'PRIMER APELLIDO', 'APELLIDO 1', 'APELLIDO1');
    const dni = getVal(row, 'D.N.I.', 'DNI', 'NIF', 'NIE');
    return nombre !== '' || apellido1 !== '' || dni !== '';
  });
}

/**
 * Valida que las columnas del Excel coinciden con el mapeo de la escuela.
 * Para fichas de prácticas usa matcheo tolerante (trim de clave y valor).
 */
export function validateExcelHeaders(
  rows: ExcelRow[],
  config: FichaSchoolConfig
): ValidationResult {
  if (rows.length === 0) {
    return {
      isValid: false,
      missingColumns: Object.keys(config.mapeoColumnas),
      foundColumns: [],
    };
  }

  const excelHeaders = new Set(Object.keys(rows[0]).map((h) => h.trim().toUpperCase()));
  const requiredColumns = Object.keys(config.mapeoColumnas);

  const foundColumns = requiredColumns.filter((col) =>
    excelHeaders.has(col.trim().toUpperCase())
  );
  const missingColumns = requiredColumns.filter(
    (col) => !excelHeaders.has(col.trim().toUpperCase())
  );

  // Para fichas, solo requerimos las columnas "core" de identidad del alumno.
  const coreColumns = new Set(['PRIMER APELLIDO', 'NOMBRE', 'D.N.I.']);

  const coreMissing = missingColumns.filter((col) =>
    coreColumns.has(col.trim())
  );

  return {
    isValid: coreMissing.length === 0,
    missingColumns,
    foundColumns,
  };
}
