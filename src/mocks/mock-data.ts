import type { ExcelRow, SchoolConfig } from '@/lib/types';
import escuelaCentral from '@/configs/escuela-central.json';
import escuelaMontessori from '@/configs/escuela-montessori.json';

// ============================================================
// Datos mock para modo demo
// ============================================================

/** Lista de todas las escuelas configuradas */
export const schoolConfigs: SchoolConfig[] = [
  escuelaCentral as SchoolConfig,
  escuelaMontessori as SchoolConfig,
];

/** Datos mock del Excel para Instituto Central */
export const mockDataCentral: ExcelRow[] = [
  { 'Nombre Completo': 'Alejandra Ruiz Martín', 'Calificación': 9.5, 'Curso': '4º ESO A' },
  { 'Nombre Completo': 'Carlos Fernández López', 'Calificación': 8.7, 'Curso': '4º ESO A' },
  { 'Nombre Completo': 'María del Carmen Sánchez', 'Calificación': 9.8, 'Curso': '4º ESO B' },
  { 'Nombre Completo': 'Pablo García Navarro', 'Calificación': 7.9, 'Curso': '4º ESO B' },
  { 'Nombre Completo': 'Lucía Hernández Gómez', 'Calificación': 9.2, 'Curso': '4º ESO A' },
  { 'Nombre Completo': 'Diego Torres Ramírez', 'Calificación': 8.4, 'Curso': '4º ESO C' },
  { 'Nombre Completo': 'Elena Moreno Castro', 'Calificación': 9.1, 'Curso': '4º ESO B' },
  { 'Nombre Completo': 'Javier Díaz Ortega', 'Calificación': 8.9, 'Curso': '4º ESO A' },
  { 'Nombre Completo': 'Sara López Jiménez', 'Calificación': 9.6, 'Curso': '4º ESO C' },
  { 'Nombre Completo': 'Andrés Martín Vega', 'Calificación': 8.1, 'Curso': '4º ESO C' },
];

/** Datos mock del Excel para Colegio Montessori */
export const mockDataMontessori: ExcelRow[] = [
  { 'Alumno': 'Valentina Rossi Pérez', 'Nota Final': 9.3, 'Nivel': 'Secundaria 4' },
  { 'Alumno': 'Mateo Blanco Rivera', 'Nota Final': 8.8, 'Nivel': 'Secundaria 4' },
  { 'Alumno': 'Isabella Cruz Santos', 'Nota Final': 9.7, 'Nivel': 'Secundaria 3' },
  { 'Alumno': 'Sebastián Mora Aguilar', 'Nota Final': 7.5, 'Nivel': 'Secundaria 3' },
  { 'Alumno': 'Camila Delgado Flores', 'Nota Final': 9.0, 'Nivel': 'Secundaria 4' },
  { 'Alumno': 'Nicolás Vargas Mendoza', 'Nota Final': 8.6, 'Nivel': 'Secundaria 3' },
  { 'Alumno': 'Sofía Reyes Luna', 'Nota Final': 9.4, 'Nivel': 'Secundaria 4' },
  { 'Alumno': 'Daniel Castillo Herrera', 'Nota Final': 8.2, 'Nivel': 'Secundaria 3' },
  { 'Alumno': 'Martina Prado Silva', 'Nota Final': 9.9, 'Nivel': 'Secundaria 4' },
  { 'Alumno': 'Lucas Romero Arias', 'Nota Final': 8.0, 'Nivel': 'Secundaria 3' },
];

/**
 * Devuelve los datos mock del Excel según la escuela seleccionada.
 * Simula la salida del parser de Excel.
 */
export function getMockExcelData(schoolId: string): ExcelRow[] {
  switch (schoolId) {
    case 'escuela-central':
      return mockDataCentral;
    case 'escuela-montessori':
      return mockDataMontessori;
    default:
      return mockDataCentral;
  }
}
