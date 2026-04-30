// ============================================================
// Tipos compartidos para el Generador de Diplomas Multiescuela
// ============================================================

/** Estilos visuales configurables por escuela */
export interface SchoolStyles {
  colorPrimario: string;
  colorSecundario: string;
  colorFondo?: string;
  fuenteTitulo: string;
  fuenteCuerpo: string;
}

/** Textos fijos del diploma */
export interface FixedTexts {
  director: string;
  titulo: string;
  subtitulo: string;
  fecha: string;
  ciudad: string;
  [key: string]: string;
}

/** Configuración completa de una escuela */
export interface SchoolConfig {
  id: string;
  nombre: string;
  logo: string;
  estilos: SchoolStyles;
  mapeoColumnas: Record<string, string>;
  textosFijos: FixedTexts;
}

/** Fila genérica de un Excel (clave-valor) */
export type ExcelRow = Record<string, string | number | undefined>;

/** Datos del alumno ya mapeados */
export interface MappedStudent {
  nombre_alumno: string;
  nota?: string | number;
  curso?: string;
  [key: string]: string | number | undefined;
}

/** Datos completos para renderizar un diploma */
export interface DiplomaData {
  student: MappedStudent;
  school: SchoolConfig;
}

/** Resultado de validación */
export interface ValidationResult {
  isValid: boolean;
  missingColumns: string[];
  foundColumns: string[];
}

/** Estado de generación de PDF */
export type GenerationStatus =
  | 'idle'
  | 'processing'
  | 'complete'
  | 'error';

/** Progreso de generación */
export interface GenerationProgress {
  status: GenerationStatus;
  current: number;
  total: number;
  message: string;
}
