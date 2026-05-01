import type { FichaSchoolConfig } from './types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Valida que un objeto JSON cumpla con la estructura mínima de FichaSchoolConfig.
 */
export function validateSchoolConfig(data: any): ValidationResult {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['El archivo no es un objeto JSON válido.'] };
  }

  // Campos obligatorios
  const requiredFields = ['id', 'nombre', 'modo', 'estilos', 'mapeoColumnas', 'valoresFijos'];
  requiredFields.forEach(field => {
    if (!(field in data)) {
      errors.push(`Falta el campo obligatorio: "${field}"`);
    }
  });

  if (data.modo !== 'ficha') {
    errors.push('El campo "modo" debe ser "ficha".');
  }

  // Validar estilos
  if (data.estilos) {
    const requiredStyles = ['colorPrimario', 'colorSecundario', 'fuenteTitulo', 'fuenteCuerpo'];
    requiredStyles.forEach(style => {
      if (!(style in data.estilos)) {
        errors.push(`Falta el estilo: "estilos.${style}"`);
      }
    });
  }

  // Validar mapeoColumnas
  if (data.mapeoColumnas && (typeof data.mapeoColumnas !== 'object' || Array.isArray(data.mapeoColumnas))) {
    errors.push('El campo "mapeoColumnas" debe ser un objeto.');
  }

  // Validar valoresFijos
  if (data.valoresFijos && (typeof data.valoresFijos !== 'object' || Array.isArray(data.valoresFijos))) {
    errors.push('El campo "valoresFijos" debe ser un objeto.');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
