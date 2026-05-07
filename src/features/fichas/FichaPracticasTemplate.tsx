'use client';

import { forwardRef } from 'react';
import type { CSSProperties } from 'react';
import type { FichaData } from '@/lib/types';
import { tableStyle, labelCell, valueCell, sectionTitle } from '@/features/fichas/ficha-styles';
import FichaHeader from '@/features/fichas/sections/FichaHeader';
import ParticipantesTable from '@/features/fichas/sections/ParticipantesTable';
import ActividadesTable from '@/features/fichas/sections/ActividadesTable';
import FirmasFooter from '@/features/fichas/sections/FirmasFooter';

interface FichaPracticasTemplateProps {
  data: FichaData;
  scale?: number;
}

const FichaPracticasTemplate = forwardRef<HTMLDivElement, FichaPracticasTemplateProps>(
  function FichaPracticasTemplate({ data, scale = 1 }, ref) {
    const { practicante: p, school } = data;
    const fijos = school.valoresFijos;

    const [fechaInicioCurso, fechaFinTeorica] = (p.fechas_curso ?? '')
      .split('-')
      .map((s) => s.trim());

    const containerStyle: CSSProperties = {
      width: '210mm',
      boxSizing: 'border-box',
      padding: '20mm 12.7mm 15mm 12.7mm',
      fontFamily: 'Arial, sans-serif',
      fontSize: '9pt',
      color: '#000',
      background: '#fff',
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
    };

    return (
      <div ref={ref} style={containerStyle} className="ficha-page">
        <FichaHeader school={school} />

        <div style={sectionTitle}>1.- Datos del/la alumno/a:</div>
        <ParticipantesTable practicante={p} />

        <div style={sectionTitle}>2.- Datos de la escuela de tiempo libre y del curso:</div>
        <table style={tableStyle}>
          <colgroup>
            <col style={{ width: '25.4%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '14.6%' }} />
          </colgroup>
          <tbody>
            <tr>
              <td style={labelCell}>Nombre de la escuela</td>
              <td colSpan={5} style={valueCell}>{school.nombre}</td>
            </tr>
            <tr>
              <td style={labelCell}>Nombre del curso</td>
              <td colSpan={2} style={valueCell}>{fijos.nombre_curso}</td>
              <td colSpan={2} style={labelCell}>Código del curso</td>
              <td style={valueCell}>{p.codigo_curso ?? ''}</td>
            </tr>
            <tr>
              <td style={labelCell}>Fecha inicio del curso</td>
              <td colSpan={5} style={valueCell}>{fechaInicioCurso ?? ''}</td>
            </tr>
            <tr>
              <td style={labelCell}>Fecha finalización fase teórica</td>
              <td style={valueCell}>{fechaFinTeorica ?? ''}</td>
              <td colSpan={2} style={labelCell}>Fecha finalización fase práctica</td>
              <td colSpan={2} style={valueCell}>{p.fecha_final ?? ''}</td>
            </tr>
          </tbody>
        </table>

        <div style={sectionTitle}>3.- Información de las prácticas (rellenar la/s actividad/es que se hayan realizado):</div>
        <ActividadesTable actividad={1} practicante={p} fijos={fijos} />

        <div style={{ breakBefore: 'page', pageBreakBefore: 'always', paddingTop: '4mm' }}>
          <ActividadesTable actividad={2} practicante={p} fijos={fijos} />
        </div>

        <table style={{ ...tableStyle, width: '40%', marginTop: '4mm' }}>
          <colgroup>
            <col style={{ width: '40%' }} />
            <col style={{ width: '60%' }} />
          </colgroup>
          <tbody>
            <tr>
              <td style={labelCell}>Nº total de horas realizadas (actividad 1 + actividad 2)</td>
              <td style={valueCell}>{p.horas_realizadas || '160'}</td>
            </tr>
          </tbody>
        </table>

        <div style={sectionTitle}>4.- Datos de monitores/as:</div>
        <table style={tableStyle}>
          <colgroup>
            <col style={{ width: '25%' }} />
            <col style={{ width: '25%' }} />
            <col style={{ width: '25%' }} />
            <col style={{ width: '25%' }} />
          </colgroup>
          <tbody>
            <tr>
              <td colSpan={2} style={{ ...labelCell, textAlign: 'center' }}>Nº de monitores/as y coordinadores/as titulados/as</td>
              <td colSpan={2} style={{ ...labelCell, textAlign: 'center' }}>Nº de monitores/as y coordinadores/as en prácticas</td>
            </tr>
            <tr>
              <td style={labelCell}>Actividad 1</td>
              <td style={{ ...valueCell, minHeight: '6mm' }}>{p.n_monitores_titulados ?? ''}</td>
              <td style={labelCell}>Actividad 1</td>
              <td style={{ ...valueCell, minHeight: '6mm' }}>{p.n_monitores_practicas ?? ''}</td>
            </tr>
            <tr>
              <td style={labelCell}>Actividad 2</td>
              <td style={{ ...valueCell, minHeight: '6mm' }}></td>
              <td style={labelCell}>Actividad 2</td>
              <td style={{ ...valueCell, minHeight: '6mm' }}></td>
            </tr>
            <tr>
              <td style={labelCell}>Actividad 3</td>
              <td style={{ ...valueCell, minHeight: '6mm' }}></td>
              <td style={labelCell}>Actividad 3</td>
              <td style={{ ...valueCell, minHeight: '6mm' }}></td>
            </tr>
          </tbody>
        </table>

        <div style={sectionTitle}>
          5.- Datos del tutor/a de prácticas<sup style={{ fontSize: '7pt' }}>[1]</sup>:
        </div>
        <table style={tableStyle}>
          <colgroup>
            <col style={{ width: '23.1%' }} />
            <col style={{ width: '76.9%' }} />
          </colgroup>
          <tbody>
            <tr>
              <td style={labelCell}>Nombre</td>
              <td style={{ ...valueCell, minHeight: '6mm' }}>{p.coordinador_practicas ?? ''}</td>
            </tr>
            <tr>
              <td style={labelCell}>Tipo de titulación</td>
              <td style={{ ...valueCell, minHeight: '6mm' }}>{p.titulacion_tutor || (fijos.titulacion_tutor_default as string) || 'Coordinador/a de Tiempo Libre'}</td>
            </tr>
          </tbody>
        </table>

        <div style={{ ...sectionTitle, breakBefore: 'page', pageBreakBefore: 'always', marginTop: 0, paddingTop: '4mm' }}>
          6.- Memoria de prácticas:
        </div>
        <table style={tableStyle}>
          <colgroup>
            <col style={{ width: '35.3%' }} />
            <col style={{ width: '64.7%' }} />
          </colgroup>
          <tbody>
            <tr>
              <td style={labelCell}>Título</td>
              <td style={valueCell}>{p.titulo_memoria ?? ''}</td>
            </tr>
            <tr>
              <td style={labelCell}>Fecha de entrega en la escuela</td>
              <td style={valueCell}>{p.fecha_entrega_memoria ?? ''}</td>
            </tr>
            <tr>
              <td style={labelCell}>Coordinador/a de prácticas de la escuela</td>
              <td style={valueCell}>{p.coordinador_escuela ?? ''}</td>
            </tr>
          </tbody>
        </table>

        <table style={{ ...tableStyle, width: '40%', marginTop: '4mm' }}>
          <colgroup>
            <col style={{ width: '40%' }} />
            <col style={{ width: '60%' }} />
          </colgroup>
          <tbody>
            <tr>
              <td style={labelCell}>Calificación</td>
              <td style={{ ...valueCell, fontWeight: 'bold', fontSize: '11pt', textAlign: 'center' }}>
                {fijos.calificacion_default}
              </td>
            </tr>
          </tbody>
        </table>

        <FirmasFooter fijos={fijos} />
      </div>
    );
  }
);

export default FichaPracticasTemplate;
