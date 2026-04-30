import { describe, expect, it } from 'vitest';
import { buildFichaData, mapExcelToPracticantes } from '@/lib/mapping-engine';
import type { ExcelRow, FichaSchoolConfig } from '@/lib/types';

const schoolConfig: FichaSchoolConfig = {
  id: 'recuerdo-test',
  modo: 'ficha',
  nombre: 'Recuerdo Test',
  logo: '/logos/escuela-recuerdo.png',
  estilos: {
    colorPrimario: '#1A2E5C',
    colorSecundario: '#8B6F2A',
    fuenteTitulo: 'Arial',
    fuenteCuerpo: 'Arial',
  },
  mapeoColumnas: {
    'PRIMER APELLIDO': 'apellido1',
    'SEGUNDO APELLIDO': 'apellido2',
    NOMBRE: 'nombre',
    'D.N.I.': 'dni',
    'CÓDIGO CURSO': 'codigo_curso',
  },
  valoresFijos: {
    nombre_curso: 'MTL',
    direccion_escuela: 'Pza. Test',
    telefono_escuela: '913022640',
    director: 'Director Test',
    ciudad: 'Madrid',
    calificacion_default: 'APTO',
    tipo_actividad_default: 'Campamento con pernocta',
  },
};

describe('mapping-engine', () => {
  it('mapea columnas excel a practicante y preserva metadatos', () => {
    const rows: ExcelRow[] = [
      {
        'PRIMER APELLIDO ': ' Cobian ',
        'SEGUNDO APELLIDO': 'Quirantes',
        NOMBRE: 'Eduardo',
        'D.N.I.': '54697996V',
        'CÓDIGO CURSO': '6490',
        _sheet: 'CURSO 53',
        _rowIndex: 4,
      },
    ];

    const practicantes = mapExcelToPracticantes(rows, schoolConfig);

    expect(practicantes).toHaveLength(1);
    expect(practicantes[0]).toMatchObject({
      apellido1: 'Cobian',
      apellido2: 'Quirantes',
      nombre: 'Eduardo',
      dni: '54697996V',
      codigo_curso: '6490',
      _sheet: 'CURSO 53',
      _rowIndex: 4,
    });
  });

  it('construye FichaData por cada practicante', () => {
    const rows: ExcelRow[] = [
      {
        'PRIMER APELLIDO': 'León',
        'SEGUNDO APELLIDO': 'Mesa',
        NOMBRE: 'Marina',
        'D.N.I.': '51544615M',
      },
    ];

    const practicantes = mapExcelToPracticantes(rows, schoolConfig);
    const fichas = buildFichaData(practicantes, schoolConfig);

    expect(fichas).toHaveLength(1);
    expect(fichas[0].school.id).toBe('recuerdo-test');
    expect(fichas[0].practicante.nombre).toBe('Marina');
  });
});
