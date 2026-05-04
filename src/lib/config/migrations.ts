import type { FichaSchoolConfig } from '../types';

const ESCUELA_RECUERDO_COLS = {
  NACIONALIDAD: 'nacionalidad',
  'PAÍS': 'nacionalidad',
  NAC: 'nacionalidad',
  'NIF ENTIDAD': 'nif_entidad',
  NIF: 'nif_entidad',
};

/**
 * Aplica migraciones automáticas a configs guardados en versiones anteriores.
 * Opera por mutación sobre una copia del objeto — siempre pasar un objeto nuevo.
 */
export function migrateLegacyConfig(config: FichaSchoolConfig): FichaSchoolConfig {
  const c = structuredClone(config);

  if (c.id === 'escuela-recuerdo') {
    if (c.valoresFijos.firma_escuela === '/logos/firma-recuerdo-vinuesa.jpg') {
      c.valoresFijos.firma_escuela = '/logos/recuerdo/firma.jpg';
    }
    if (c.valoresFijos.sello_escuela === '/logos/sello-recuerdo-vinuesa.jpg') {
      c.valoresFijos.sello_escuela = '/logos/recuerdo/sello.jpg';
    }
    if (c.valoresFijos.nif_entidad_default !== 'G84510585') {
      c.valoresFijos.nif_entidad_default = 'G84510585';
    }
    if (!c.valoresFijos.entidad_organizadora_default) {
      c.valoresFijos.entidad_organizadora_default = 'Escuela Nuestra Señora del Recuerdo';
    }
    if (!c.mapeoColumnas['NACIONALIDAD']) {
      Object.assign(c.mapeoColumnas, ESCUELA_RECUERDO_COLS);
    }
  } else if (c.id === 'escuela-enforex') {
    if (c.valoresFijos.firma_escuela === '/logos/Firma Enforex Rubén.png') {
      c.valoresFijos.firma_escuela = '/logos/enforex/firmaysello.png';
      c.valoresFijos.sello_escuela = '';
      c.valoresFijos.firma_ancho_mm = '65';
      c.valoresFijos.firma_alto_mm = '25';
    }
    if (c.valoresFijos.nif_entidad_default !== 'B83695742') {
      c.valoresFijos.nif_entidad_default = 'B83695742';
    }
    if (!c.valoresFijos.entidad_organizadora_default) {
      c.valoresFijos.entidad_organizadora_default = 'Enforex Camps';
    }
    if (!c.mapeoColumnas['NACIONALIDAD']) {
      Object.assign(c.mapeoColumnas, ESCUELA_RECUERDO_COLS);
    }
  }

  return c;
}
