'use client';

import { forwardRef, useState } from 'react';
import type { FichaData } from '@/lib/types';

interface FichaPracticasTemplateProps {
  data: FichaData;
  scale?: number;
}

const cell: React.CSSProperties = {
  border: '1px solid #000',
  padding: '2mm',
  fontSize: '9pt',
  lineHeight: '1.3',
  verticalAlign: 'middle',
  fontFamily: 'Arial, sans-serif',
  color: '#000',
  background: '#fff',
};

const labelCell: React.CSSProperties = {
  ...cell,
  fontWeight: 'bold',
};

const valueCell: React.CSSProperties = {
  ...cell,
  minHeight: '6mm',
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  tableLayout: 'fixed',
  marginTop: '2mm',
};

const sectionTitle: React.CSSProperties = {
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'bold',
  fontSize: '10pt',
  marginTop: '4mm',
  marginBottom: '1mm',
  color: '#000',
};

const activityTitle: React.CSSProperties = {
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'bold',
  fontSize: '9pt',
  marginTop: '2mm',
  marginBottom: '0.8mm',
  color: '#000',
};

function Checkbox({ checked = false }: { checked?: boolean }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '3.5mm',
        height: '3.5mm',
        border: '1px solid #000',
        verticalAlign: 'middle',
        background: '#fff',
        flexShrink: 0,
      }}
    >
      {checked && (
        <svg
          viewBox="0 0 10 10"
          style={{ width: '70%', height: '70%', stroke: '#000', strokeWidth: 1.5, strokeLinecap: 'round' }}
        >
          <line x1="1" y1="1" x2="9" y2="9" />
          <line x1="9" y1="1" x2="1" y2="9" />
        </svg>
      )}
    </div>
  );
}

function parsePositiveMm(value: string | undefined, fallback: number): number {
  const parsed = Number.parseFloat(value ?? '');
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const FichaPracticasTemplate = forwardRef<HTMLDivElement, FichaPracticasTemplateProps>(
  function FichaPracticasTemplate({ data, scale = 1 }, ref) {
    const { practicante: p, school } = data;
    const fijos = school.valoresFijos;

    const [failedSignatureSrc, setFailedSignatureSrc] = useState<string | null>(null);
    const [failedSealSrc, setFailedSealSrc] = useState<string | null>(null);

    const signatureSrc = fijos.firma_escuela;
    const sealSrc = fijos.sello_escuela;

    const showSignature = Boolean(signatureSrc) && failedSignatureSrc !== signatureSrc;
    const showSeal = Boolean(sealSrc) && failedSealSrc !== sealSrc;

    const signatureWidthMm = parsePositiveMm(fijos.firma_ancho_mm, 46);
    const signatureHeightMm = parsePositiveMm(fijos.firma_alto_mm, 12);
    const sealWidthMm = parsePositiveMm(fijos.sello_ancho_mm, 20);
    const sealHeightMm = parsePositiveMm(fijos.sello_alto_mm, 20);

    const [fechaInicioCurso, fechaFinTeorica] = (p.fechas_curso ?? '')
      .split('-')
      .map((s) => s.trim());

    const fechaFirmaTexto = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

    const containerStyle: React.CSSProperties = {
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

    const renderWeekDays = (isPernocta: boolean, isActividad1: boolean) => {
      const dias = (p.dias_semana as string || '').toUpperCase();
      const check = (dia: string) => isActividad1 && (isPernocta || dias.includes(dia));
      
      const renderDia = (letra: string) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1mm', flexShrink: 0 }}>
          <span style={{ fontFamily: 'Arial, sans-serif', fontSize: '8pt', lineHeight: 1.2 }}>{letra}</span>
          <Checkbox checked={check(letra)} />
        </div>
      );

      return (
        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '0.8mm', padding: 0 }}>
          {renderDia('L')}
          {renderDia('M')}
          {renderDia('X')}
          {renderDia('J')}
          {renderDia('V')}
          {renderDia('S')}
          {renderDia('D')}
        </div>
      );
    };

    const renderActivityTable = (actividad: 1 | 2) => {
      const isActividad1 = actividad === 1;
      const tipoActividadActual = p.tipo_actividad || fijos.tipo_actividad_default || '';
      const isPernocta = isActividad1 && tipoActividadActual === 'Campamento con pernocta';

      const entidad = isActividad1 ? (p.entidad || fijos.entidad_organizadora_default || '') : '';
      const nifEntidad = isActividad1 ? (p.nif_entidad || fijos.nif_entidad_default || '') : '';
      const direccion = isActividad1 ? (p.lugar_practicas ?? '') : '';
      const telefono = isActividad1 ? (p.persona_contacto ?? '') : '';
      const fechaInicio = isActividad1 ? (p.fecha_inicio ?? '') : '';
      const fechaFin = isActividad1 ? (p.fecha_final ?? '') : '';
      const horario = isActividad1 ? (isPernocta ? 'Completo' : (p.horario ?? '')) : '';
      const horasRealizadas = isActividad1 ? (p.horas_realizadas ?? '160') : '';
      const horasPlanificadas = isActividad1 ? (p.horas_planificadas ?? '160') : '';
      const nParticipantes = isActividad1 ? (p.n_participantes ?? '') : '';
      const edades = isActividad1 ? (p.edad_participantes ?? '') : '';
      const denominacion = isActividad1 ? (p.titulo_memoria ?? '') : '';
      const descripcion = isActividad1 ? (p.caracteristicas ?? '') : '';

      return (
        <table style={tableStyle}>
          <colgroup>
            <col style={{ width: '19%' }} />
            <col style={{ width: '19%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '15.1%' }} />
            <col style={{ width: '4.1%' }} />
            <col style={{ width: '1.4%' }} />
            <col style={{ width: '6.8%' }} />
            <col style={{ width: '2.7%' }} />
            <col style={{ width: '20%' }} />
          </colgroup>
          <tbody>
            <tr>
              <td colSpan={9} style={{ ...labelCell, padding: '2mm' }}>Actividad {actividad}</td>
            </tr>
            <tr>
              <td style={labelCell}>Tipo de actividad</td>
              <td colSpan={8} style={{ ...valueCell, padding: '2mm' }}>
                <div style={{ marginBottom: '1mm', display: 'flex', alignItems: 'center' }}>
                  <Checkbox checked={isPernocta} />
                  <span style={{ marginLeft: '2mm' }}>Campamento con pernocta</span>
                </div>
                <div style={{ marginBottom: '1mm', display: 'flex', alignItems: 'center' }}>
                  <Checkbox checked={isActividad1 && tipoActividadActual === 'Campamento urbano'} />
                  <span style={{ marginLeft: '2mm' }}>Campamento urbano</span>
                </div>
                <div style={{ marginBottom: '1mm', display: 'flex', alignItems: 'center' }}>
                  <Checkbox checked={isActividad1 && tipoActividadActual === 'Intervención socioeducativa en entidades'} />
                  <span style={{ marginLeft: '2mm' }}>Intervención socioeducativa en entidades</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox checked={isActividad1 && tipoActividadActual === 'Otra'}/>
                  <span style={{ marginLeft: '2mm' }}>Otra (.......................................................................................................)</span>
                </div>
              </td>
            </tr>
            <tr>
              <td style={labelCell}>Entidad organizadora</td>
              <td colSpan={5} style={valueCell}>{entidad}</td>
              <td style={labelCell}>NIF</td>
              <td colSpan={2} style={valueCell}>{nifEntidad}</td>
            </tr>
            <tr>
              <td style={labelCell}>Dirección</td>
              <td colSpan={5} style={valueCell}>{direccion}</td>
              <td colSpan={2} style={labelCell}>Teléfono</td>
              <td style={valueCell}>{telefono}</td>
            </tr>
            <tr>
              <td style={labelCell}>Fecha inicio</td>
              <td colSpan={2} style={valueCell}>{fechaInicio}</td>
              <td style={labelCell}>Fecha fin</td>
              <td colSpan={5} style={valueCell}>{fechaFin}</td>
            </tr>
            <tr>
              <td style={labelCell}>Días de la semana</td>
              <td style={{ ...valueCell, padding: '2mm 1mm' }}>{renderWeekDays(isPernocta, isActividad1)}</td>
              <td style={labelCell}>Horario</td>
              <td colSpan={6} style={valueCell}>{horario}</td>
            </tr>
            <tr>
              <td style={labelCell}>Nº horas totales realizadas</td>
              <td colSpan={2} style={valueCell}>{horasRealizadas}</td>
              <td colSpan={2} style={labelCell}>Nº horas planificadas</td>
              <td colSpan={4} style={valueCell}>{horasPlanificadas}</td>
            </tr>
            <tr>
              <td style={labelCell}>Nº de participantes</td>
              <td colSpan={2} style={valueCell}>{nParticipantes}</td>
              <td style={labelCell}>Edades</td>
              <td colSpan={5} style={valueCell}>{edades}</td>
            </tr>
            <tr>
              <td style={labelCell}>Denominación del proyecto</td>
              <td colSpan={8} style={valueCell}>{denominacion}</td>
            </tr>
            <tr>
              <td style={labelCell}>Descripción de la actividad principal y objetivos</td>
              <td colSpan={8} style={{ ...valueCell, minHeight: '18mm' }}>{descripcion}</td>
            </tr>
            <tr>
              <td style={labelCell}>Observaciones</td>
              <td colSpan={8} style={{ ...valueCell, minHeight: '8mm' }}></td>
            </tr>
          </tbody>
        </table>
      );
    };

    return (
      <div ref={ref} style={containerStyle} className="ficha-page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8mm' }}>
          <div style={{ width: '45mm', minHeight: '15mm' }}>
            {school.logo ? (
              <img src={school.logo} alt="Logo" style={{ maxWidth: '100%', maxHeight: '15mm', objectFit: 'contain' }} />
            ) : null}
          </div>
          <div style={{ textAlign: 'center', flex: 1, alignSelf: 'center' }}>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11pt', fontWeight: 'bold' }}>
              FICHA INDIVIDUAL DE PRÁCTICAS
            </div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', marginTop: '1mm' }}>
              (A rellenar por la escuela)
            </div>
          </div>
          <div style={{ width: '45mm', textAlign: 'right', fontFamily: 'Arial, sans-serif', fontSize: '8pt', fontWeight: 'bold', alignSelf: 'center' }}>
            {school.nombre}
          </div>
        </div>

        <div style={sectionTitle}>1.- Datos del/la alumno/a:</div>
        <table style={tableStyle}>
          <colgroup>
            <col style={{ width: '10%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '30%' }} />
          </colgroup>
          <tbody>
            <tr>
              <td style={labelCell}>NIF / NIE</td>
              <td style={valueCell}>{p.dni ?? ''}</td>
              <td colSpan={2} style={labelCell}>Nacionalidad</td>
              <td colSpan={2} style={valueCell}>{p.nacionalidad ?? ''}</td>
            </tr>
            <tr>
              <td style={labelCell}>Nombre</td>
              <td style={valueCell}>{p.nombre ?? ''}</td>
              <td style={labelCell}>Apellido 1</td>
              <td style={valueCell}>{p.apellido1 ?? ''}</td>
              <td style={labelCell}>Apellido 2</td>
              <td style={valueCell}>{p.apellido2 ?? ''}</td>
            </tr>
            <tr>
              <td style={labelCell}>Email</td>
              <td colSpan={3} style={valueCell}>{p.email ?? ''}</td>
              <td style={labelCell}>Teléfono</td>
              <td style={valueCell}>{p.telefono ?? ''}</td>
            </tr>
          </tbody>
        </table>

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
        {renderActivityTable(1)}

        <div style={{ breakBefore: 'page', pageBreakBefore: 'always', paddingTop: '4mm' }}>
          {renderActivityTable(2)}
        </div>

        <table style={tableStyle}>
          <colgroup>
            <col style={{ width: '33.8%' }} />
            <col style={{ width: '66.2%' }} />
          </colgroup>
          <tbody>
            <tr>
              <td style={labelCell}>Nº total de horas realizadas (actividad 1 + actividad 2)</td>
              <td style={valueCell}>{p.horas_realizadas ?? '160'}</td>
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
              <td style={{ ...valueCell, minHeight: '6mm' }}>{p.titulacion_tutor ?? 'Coordinador/a de Tiempo Libre'}</td>
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

        <div style={{ marginTop: '7.5mm', fontSize: '9pt', fontFamily: 'Arial, sans-serif' }}>
          <div>
            En {fijos.ciudad || 'Madrid'}, a {fechaFirmaTexto}
          </div>
          <div style={{ marginTop: '1.8mm', fontWeight: 'bold', textTransform: 'uppercase' }}>
            LA ESCUELA DE TIEMPO LIBRE
          </div>
          <div style={{ marginTop: '1mm' }}>El director o coordinador de la escuela</div>
          <div style={{ marginTop: '11mm' }}>
            <div
              style={{
                position: 'relative',
                display: 'inline-block',
                width: `${Math.max(signatureWidthMm + 2, 40)}mm`,
                height: `${Math.max(signatureHeightMm + 3, 16)}mm`,
                marginBottom: '1mm',
              }}
            >
              {showSignature && fijos.firma_escuela && (
                <img
                  src={fijos.firma_escuela}
                  alt="Firma escuela"
                  onError={() => setFailedSignatureSrc(signatureSrc ?? null)}
                  style={{
                    position: 'absolute',
                    left: '0',
                    bottom: showSeal ? '2mm' : '0',
                    width: `${signatureWidthMm}mm`,
                    height: `${signatureHeightMm}mm`,
                    objectFit: 'contain',
                  }}
                />
              )}
              {showSeal && fijos.sello_escuela && (
                <img
                  src={fijos.sello_escuela}
                  alt="Sello escuela"
                  onError={() => setFailedSealSrc(sealSrc ?? null)}
                  style={{
                    position: 'absolute',
                    right: '-6mm',
                    bottom: '0',
                    width: `${sealWidthMm}mm`,
                    height: `${sealHeightMm}mm`,
                    objectFit: 'contain',
                    opacity: 1,
                  }}
                />
              )}
              <div
                style={{
                  position: 'absolute',
                  left: '0',
                  right: '0',
                  bottom: '0',
                  borderBottom: '1px solid #000',
                }}
              ></div>
            </div>
          </div>
          <div>Fdo.: {fijos.director}</div>
        </div>

        <div style={{ marginTop: '5mm', paddingTop: '2mm', borderTop: '1px solid #ccc', fontSize: '8pt', fontFamily: 'Arial, sans-serif', color: '#333' }}>
          <sup style={{ marginRight: '1mm' }}>[1]</sup>
          Junto con esta ficha deberá presentarse fotocopia escaneada de la titulación del tutor/a de prácticas, según lo dispuesto en el Decreto 14/2022 de 30 de marzo, art. 6.2.
        </div>
      </div>
    );
  }
);

export default FichaPracticasTemplate;
