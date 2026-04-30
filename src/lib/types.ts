// ============================================================
// Tipos compartidos para el Generador de Diplomas Multiescuela
// ============================================================

/** Modo de la aplicación */
export type AppMode = 'diploma' | 'ficha';

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

/** Configuración completa de una escuela (modo diploma) */
export interface SchoolConfig {
  id: string;
  nombre: string;
  logo: string;
  modo?: AppMode;
  estilos: SchoolStyles;
  mapeoColumnas: Record<string, string>;
  textosFijos: FixedTexts;
}

/** Valores fijos para rellenar campos que no están en el Excel */
export interface FichaValoresFijos {
  nombre_curso: string;
  direccion_escuela: string;
  telefono_escuela: string;
  director: string;
  ciudad: string;
  calificacion_default: string;
  tipo_actividad_default: string;
  [key: string]: string;
}

/** Configuración de escuela para modo Ficha de Prácticas */
export interface FichaSchoolConfig extends Omit<SchoolConfig, 'textosFijos' | 'modo'> {
  modo: 'ficha';
  valoresFijos: FichaValoresFijos;
  textosFijos?: FixedTexts;
}

/** Datos de un practicante mapeados desde el Excel */
export interface Practicante {
  nombre?: string;
  apellido1?: string;
  apellido2?: string;
  dni?: string;
  genero?: string;
  fecha_nacimiento?: string;
  email?: string;
  telefono?: string;
  titulacion?: string;
  codigo_curso?: string;
  fechas_curso?: string;
  lugar_practicas?: string;
  n_participantes?: string;
  su_grupo?: string;
  fecha_inicio?: string;
  fecha_final?: string;
  edad_participantes?: string;
  caracteristicas?: string;
  entidad?: string;
  persona_contacto?: string;
  n_monitores_titulados?: string;
  n_monitores_practicas?: string;
  coordinador_practicas?: string;
  coordinador_escuela?: string;
  titulo_memoria?: string;
  fecha_entrega_memoria?: string;
  fecha_firma?: string;
  _sheet?: string;
  _rowIndex?: number;
  [key: string]: string | number | undefined;
}

/** Datos completos para renderizar una ficha de prácticas */
export interface FichaData {
  practicante: Practicante;
  school: FichaSchoolConfig;
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
