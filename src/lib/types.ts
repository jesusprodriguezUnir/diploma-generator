// ============================================================
// Tipos compartidos para el Generador de Fichas de Prácticas
// ============================================================

/** Estilos visuales configurables por escuela */
export interface SchoolStyles {
  colorPrimario: string;
  colorSecundario: string;
  colorFondo?: string;
  fuenteTitulo: string;
  fuenteCuerpo: string;
}

/** Configuración de escuela para modo Ficha de Prácticas */
export interface FichaSchoolConfig {
  id: string;
  nombre: string;
  logo: string;
  modo: 'ficha';
  estilos: SchoolStyles;
  mapeoColumnas: Record<string, string>;
  valoresFijos: FichaValoresFijos;
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
  nif_entidad_default?: string;
  entidad_organizadora_default?: string;
  firma_escuela?: string;
  sello_escuela?: string;
  [key: string]: string | undefined;
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
  tipo_actividad?: string;
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
