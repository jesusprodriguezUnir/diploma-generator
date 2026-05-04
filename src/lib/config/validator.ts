export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Valida que un objeto JSON cumpla con la estructura mínima de FichaSchoolConfig.
 */
export function validateSchoolConfig(data: unknown): ValidationResult {
  const errors: string[] = [];

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { valid: false, errors: ['El archivo no es un objeto JSON válido.'] };
  }

  const obj = data as Record<string, unknown>;

  const requiredFields = ['id', 'nombre', 'modo', 'estilos', 'mapeoColumnas', 'valoresFijos'];
  for (const field of requiredFields) {
    if (!(field in obj)) {
      errors.push(`Falta el campo obligatorio: "${field}"`);
    }
  }

  if (obj['modo'] !== 'ficha') {
    errors.push('El campo "modo" debe ser "ficha".');
  }

  if (obj['estilos'] && typeof obj['estilos'] === 'object' && !Array.isArray(obj['estilos'])) {
    const estilos = obj['estilos'] as Record<string, unknown>;
    for (const style of ['colorPrimario', 'colorSecundario', 'fuenteTitulo', 'fuenteCuerpo']) {
      if (!(style in estilos)) {
        errors.push(`Falta el estilo: "estilos.${style}"`);
      }
    }
  }

  if (obj['mapeoColumnas'] && (typeof obj['mapeoColumnas'] !== 'object' || Array.isArray(obj['mapeoColumnas']))) {
    errors.push('El campo "mapeoColumnas" debe ser un objeto.');
  }

  if (obj['valoresFijos'] && (typeof obj['valoresFijos'] !== 'object' || Array.isArray(obj['valoresFijos']))) {
    errors.push('El campo "valoresFijos" debe ser un objeto.');
  }

  return { valid: errors.length === 0, errors };
}
