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

/** Metadatos de origen Excel inyectados por el parser */
export interface ExcelMeta {
  _sheet?: string;
  _rowIndex?: number;
}

/** Datos de un practicante mapeados desde el Excel */
export interface Practicante extends ExcelMeta {
  nombre?: string;
  apellido1?: string;
  apellido2?: string;
  dni?: string;
  genero?: string;
  fecha_nacimiento?: string;
  email?: string;
  telefono?: string;
  titulacion?: string;
  nacionalidad?: string;
  codigo_curso?: string;
  fechas_curso?: string;
  lugar_practicas?: string;
  entidad?: string;
  nif_entidad?: string;
  n_participantes?: string;
  su_grupo?: string;
  fecha_inicio?: string;
  fecha_final?: string;
  edad_participantes?: string;
  caracteristicas?: string;
  persona_contacto?: string;
  dias_semana?: string;
  horario?: string;
  horas_realizadas?: string;
  horas_planificadas?: string;
  n_monitores_titulados?: string;
  n_monitores_practicas?: string;
  coordinador_practicas?: string;
  coordinador_escuela?: string;
  titulacion_tutor?: string;
  titulo_memoria?: string;
  fecha_entrega_memoria?: string;
  fecha_firma?: string;
  tipo_actividad?: string;
}

/** Datos completos para renderizar una ficha de prácticas */
export interface FichaData {
  practicante: Practicante;
  school: FichaSchoolConfig;
}

/** Fila genérica de un Excel (clave-valor) */
export type ExcelRow = Record<string, string | number | undefined>;

/** Resultado de validación de cabeceras Excel */
export interface ExcelHeaderValidation {
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
