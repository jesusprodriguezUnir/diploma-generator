import type { ExcelRow, MappedStudent, SchoolConfig, DiplomaData } from './types';

/**
 * Transforma las filas del Excel usando el mapeoColumnas de la escuela.
 * Convierte las claves del Excel a las claves internas del sistema.
 *
 * Ejemplo:
 *   Excel: { "Nombre Completo": "Ana", "Calificación": 9.5 }
 *   Mapeo: { "Nombre Completo": "nombre_alumno", "Calificación": "nota" }
 *   Resultado: { nombre_alumno: "Ana", nota: 9.5 }
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
      // Filtrar filas donde el nombre del alumno está vacío
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
