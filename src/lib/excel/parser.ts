import * as XLSX from 'xlsx';
import type { ExcelRow } from '../types';
import { normalizeHeader, IDENTITY_ALIASES } from './headers';

export { validateExcelHeaders, normalizeHeader } from './headers';
export type { ExcelHeaderValidation } from '../types';

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
      const row: ExcelRow = {};
      for (const [key, val] of Object.entries(raw)) {
        const trimmedKey = key.trim();
        row[trimmedKey] = val instanceof Date ? formatDateToString(val) : (val as string | number | undefined);
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
 * Filtra filas vacías: descarta filas donde nombre, apellido1 y dni están vacíos.
 */
export function filterEmptyPracticantes(rows: ExcelRow[]): ExcelRow[] {
  const getVal = (row: ExcelRow, ...aliases: string[]) => {
    const entry = Object.entries(row).find(([k]) => aliases.includes(normalizeHeader(k)));
    return String(entry ? entry[1] ?? '' : '').trim();
  };

  return rows.filter((row) => {
    const nombre = getVal(row, ...IDENTITY_ALIASES['NOMBRE']);
    const apellido1 = getVal(row, ...IDENTITY_ALIASES['PRIMER APELLIDO']);
    const dni = getVal(row, ...IDENTITY_ALIASES['D.N.I.']);
    return nombre !== '' || apellido1 !== '' || dni !== '';
  });
}
