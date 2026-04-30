import { describe, expect, it } from 'vitest';
import { filterEmptyPracticantes, validateExcelHeaders } from '@/lib/excel-parser';
import type { ExcelRow, FichaSchoolConfig } from '@/lib/types';

const schoolConfig: FichaSchoolConfig = {
  id: 'test-school',
  modo: 'ficha',
  nombre: 'Escuela Test',
  logo: '/logos/test.png',
  estilos: {
    colorPrimario: '#000000',
    colorSecundario: '#ffffff',
    fuenteTitulo: 'Arial',
    fuenteCuerpo: 'Arial',
  },
  mapeoColumnas: {
    'PRIMER APELLIDO': 'apellido1',
    NOMBRE: 'nombre',
    'D.N.I.': 'dni',
    'CÓDIGO CURSO': 'codigo_curso',
  },
  valoresFijos: {
    nombre_curso: 'Curso test',
    direccion_escuela: 'Calle Test',
    telefono_escuela: '000',
    director: 'Director Test',
    ciudad: 'Madrid',
    calificacion_default: 'APTO',
    tipo_actividad_default: 'Campamento con pernocta',
  },
};

describe('excel-parser', () => {
  it('filtra filas completamente vacias de identidad', () => {
    const rows: ExcelRow[] = [
      { NOMBRE: '', 'PRIMER APELLIDO': '', 'D.N.I.': '' },
      { NOMBRE: 'Eduardo', 'PRIMER APELLIDO': '', 'D.N.I.': '' },
      { NOMBRE: '', 'PRIMER APELLIDO': 'Cobian', 'D.N.I.': '' },
      { NOMBRE: '', 'PRIMER APELLIDO': '', 'D.N.I.': '123' },
    ];

    const filtered = filterEmptyPracticantes(rows);
    expect(filtered).toHaveLength(3);
  });

  it('valida cabeceras core con trim en claves', () => {
    const rows: ExcelRow[] = [
      {
        'PRIMER APELLIDO ': 'Cobian',
        NOMBRE: 'Eduardo',
        'D.N.I. ': '54697996V',
      },
    ];

    const result = validateExcelHeaders(rows, schoolConfig);

    expect(result.isValid).toBe(true);
    expect(result.foundColumns).toEqual(
      expect.arrayContaining(['PRIMER APELLIDO', 'NOMBRE', 'D.N.I.'])
    );
  });

  it('marca invalido si falta una cabecera core', () => {
    const rows: ExcelRow[] = [
      {
        'PRIMER APELLIDO': 'Cobian',
        NOMBRE: 'Eduardo',
      },
    ];

    const result = validateExcelHeaders(rows, schoolConfig);

    expect(result.isValid).toBe(false);
    expect(result.missingColumns).toContain('D.N.I.');
  });
});
