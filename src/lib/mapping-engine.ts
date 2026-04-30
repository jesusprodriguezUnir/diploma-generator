import type {
  ExcelRow,
  MappedStudent,
  SchoolConfig,
  DiplomaData,
  Practicante,
  FichaSchoolConfig,
  FichaData,
} from './types';

/**
 * Transforma las filas del Excel usando el mapeoColumnas de la escuela.
 * Convierte las claves del Excel a las claves internas del sistema.
 */
export function mapExcelToStudents(
  rows: ExcelRow[],
  config: SchoolConfig
): MappedStudent[] {
  const { mapeoColumnas } = config;

  return rows
    .map((row, index) => {
      const mapped: Record<string, string | number | undefined> = {};

      for (const [excelCol, internalKey] of Object.entries(mapeoColumnas)) {
        const value = row[excelCol];
        if (value === undefined || value === '') {
          console.warn(
            `Fila ${index + 1}: columna "${excelCol}" vacía o no encontrada.`
          );
        }
        mapped[internalKey] = value;
      }

      return mapped as MappedStudent;
    })
    .filter((student) => {
      return student.nombre_alumno && String(student.nombre_alumno).trim() !== '';
    });
}

/**
 * Combina los datos mapeados del alumno con la configuración de la escuela
 * para crear los objetos finales listos para renderizar diplomas.
 */
export function buildDiplomaData(
  students: MappedStudent[],
  config: SchoolConfig
): DiplomaData[] {
  return students.map((student) => ({
    student,
    school: config,
  }));
}

/**
 * Transforma filas del Excel (multi-hoja) al tipo Practicante.
 * Usa matcheo tolerante de claves (trim) para cabeceras con espacios finales.
 * Preserva metadatos _sheet y _rowIndex.
 */
export function mapExcelToPracticantes(
  rows: ExcelRow[],
  config: FichaSchoolConfig
): Practicante[] {
  const { mapeoColumnas } = config;

  // Construir índice de alias: clave normalizada → clave interna
  const aliasMap: Record<string, string> = {};
  for (const [excelCol, internalKey] of Object.entries(mapeoColumnas)) {
    aliasMap[excelCol.trim()] = internalKey;
  }

  return rows
    .map((row) => {
      const mapped: Practicante = {};

      // Copiar metadatos primero
      if (row['_sheet'] !== undefined) mapped._sheet = String(row['_sheet']);
      if (row['_rowIndex'] !== undefined) mapped._rowIndex = Number(row['_rowIndex']);

      for (const [rawKey, value] of Object.entries(row)) {
        const trimmedKey = rawKey.trim();
        // Saltar metadatos internos
        if (trimmedKey.startsWith('_')) continue;

        // Buscar clave en aliasMap con tolerancia de espacios en el valor Excel también
        const internalKey = aliasMap[trimmedKey];
        if (internalKey) {
          const strVal = value !== undefined && value !== null ? String(value).trim() : '';
          (mapped as Record<string, string | number | undefined>)[internalKey] = strVal;
        }
      }

      return mapped;
    })
    .filter((p) => {
      const nombre = (p.nombre ?? '').trim();
      const apellido1 = (p.apellido1 ?? '').trim();
      const dni = (p.dni ?? '').trim();
      return nombre !== '' || apellido1 !== '' || dni !== '';
    });
}

/**
 * Combina los practicantes mapeados con la config de escuela para
 * crear los objetos FichaData listos para renderizar.
 */
export function buildFichaData(
  practicantes: Practicante[],
  school: FichaSchoolConfig
): FichaData[] {
  return practicantes.map((practicante) => ({
    practicante,
    school,
  }));
}
