'use client';

import { forwardRef, useState } from 'react';
import Image from 'next/image';
import type { FichaData } from '@/lib/types';

interface FichaPracticasTemplateProps {
  data: FichaData;
  scale?: number;
}

const cell: React.CSSProperties = {
  border: '1px solid #000',
  padding: '1mm 2mm',
  fontSize: '9pt',
  verticalAlign: 'top',
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
  marginBottom: '1mm',
  color: '#000',
};

function Checkbox({ checked = false }: { checked?: boolean }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: '2.8mm',
        height: '2.8mm',
        border: '1px solid #000',
        verticalAlign: 'middle',
        marginRight: '1mm',
        textAlign: 'center',
        lineHeight: '2.4mm',
        fontFamily: 'Arial, sans-serif',
        fontSize: '8pt',
        color: '#000',
      }}
    >
      {checked ? 'X' : ''}
    </span>
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

    const fechaFirmaTexto = p.fecha_firma?.trim()
      ? p.fecha_firma
      : '__________ de _____________ de __________';

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

    const renderWeekDays = () => (
      <span style={{ display: 'inline-flex', alignItems: 'center', columnGap: '2mm', flexWrap: 'wrap' }}>
        <span>L <Checkbox /></span>
        <span>M <Checkbox /></span>
        <span>X <Checkbox /></span>
        <span>J <Checkbox /></span>
        <span>V <Checkbox /></span>
        <span>S <Checkbox /></span>
        <span>D <Checkbox /></span>
      </span>
    );

    const renderActivityTable = (actividad: 1 | 2) => {
      const isActividad1 = actividad === 1;
      const entidad = isActividad1 ? (p.entidad ?? '') : '';
      const direccion = isActividad1 ? (p.lugar_practicas ?? '') : '';
      const telefono = isActividad1 ? (p.persona_contacto ?? '') : '';
      const fechaInicio = isActividad1 ? (p.fecha_inicio ?? '') : '';
      const fechaFin = isActividad1 ? (p.fecha_final ?? '') : '';
      const nParticipantes = isActividad1 ? (p.n_participantes ?? '') : '';
      const edades = isActividad1 ? (p.edad_participantes ?? '') : '';
      const denominacion = isActividad1 ? (p.titulo_memoria ?? '') : '';
      const descripcion = isActividad1 ? (p.caracteristicas ?? '') : '';

      return (
        <table style={tableStyle}>
          <colgroup>
            <col style={{ width: '23.1%' }} />
            <col style={{ width: '14.9%' }} />
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
              <td colSpan={2} style={labelCell}>Tipo de actividad</td>
              <td colSpan={7} style={valueCell}>
                <span style={{ marginRight: '4mm', whiteSpace: 'nowrap' }}>
                  <Checkbox checked={isActividad1 && fijos.tipo_actividad_default === 'Campamento con pernocta'} />
                  Campamento con pernocta
                </span>
                <span style={{ marginRight: '4mm', whiteSpace: 'nowrap' }}>
                  <Checkbox />
                  Campamento urbano
                </span>
                <span style={{ marginRight: '4mm', whiteSpace: 'nowrap' }}>
                  <Checkbox />
                  Intervención socioeducativa en entidades
                </span>
                <span style={{ whiteSpace: 'nowrap' }}>
                  <Checkbox />
                  Otra (.............................................................)
                </span>
              </td>
            </tr>
            <tr>
              <td colSpan={2} style={labelCell}>Entidad organizadora</td>
              <td colSpan={3} style={valueCell}>{entidad}</td>
              <td colSpan={2} style={labelCell}>NIF</td>
              <td colSpan={2} style={valueCell}></td>
            </tr>
            <tr>
              <td colSpan={2} style={labelCell}>Dirección</td>
              <td colSpan={7} style={valueCell}>{direccion}</td>
            </tr>
            <tr>
              <td colSpan={2} style={labelCell}>Teléfono</td>
              <td colSpan={7} style={valueCell}>{telefono}</td>
            </tr>
            <tr>
              <td colSpan={2} style={labelCell}>Fecha inicio</td>
              <td colSpan={3} style={valueCell}>{fechaInicio}</td>
              <td colSpan={2} style={labelCell}>Fecha fin</td>
              <td colSpan={2} style={valueCell}>{fechaFin}</td>
            </tr>
            <tr>
              <td colSpan={2} style={labelCell}>Días de la semana</td>
              <td colSpan={7} style={valueCell}>{renderWeekDays()}</td>
            </tr>
            <tr>
              <td colSpan={2} style={labelCell}>Horario</td>
              <td colSpan={3} style={valueCell}></td>
              <td colSpan={2} style={labelCell}>NÂº horas totales realizadas</td>
              <td colSpan={2} style={valueCell}></td>
            </tr>
            <tr>
              <td colSpan={2} style={labelCell}>NÂº horas planificadas</td>
              <td colSpan={3} style={valueCell}></td>
              <td colSpan={2} style={labelCell}>NÂº de participantes</td>
              <td colSpan={2} style={valueCell}>{nParticipantes}</td>
            </tr>
            <tr>
              <td colSpan={2} style={labelCell}>Edades</td>
              <td colSpan={7} style={valueCell}>{edades}</td>
            </tr>
            <tr>
              <td colSpan={2} style={labelCell}>Denominación del proyecto</td>
              <td colSpan={7} style={valueCell}>{denominacion}</td>
            </tr>
            <tr>
              <td colSpan={2} style={labelCell}>Descripción de la actividad principal y objetivos</td>
              <td colSpan={7} style={{ ...valueCell, minHeight: '18mm' }}>{descripcion}</td>
            </tr>
            <tr>
              <td colSpan={2} style={labelCell}>Observaciones</td>
              <td colSpan={7} style={{ ...valueCell, minHeight: '8mm' }}></td>
            </tr>
          </tbody>
        </table>
      );
    };

    return (
      <div ref={ref} style={containerStyle} className="ficha-page">
        <div style={{ textAlign: 'center', marginBottom: '6mm' }}>
          <div
            style={{
              display: 'inline-block',
              background: '#C5E0B3',
              border: '1px solid #000',
              padding: '2mm 4mm',
            }}
          >
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', fontWeight: 'bold' }}>
              FICHA INDIVIDUAL DE PRÁCTICAS
            </div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt' }}>
              (A rellenar por la escuela)
            </div>
          </div>
        </div>

        <div style={sectionTitle}>1.- Datos del/la alumno/a:</div>
        <table style={tableStyle}>
          <colgroup>
            <col style={{ width: '8.7%' }} />
            <col style={{ width: '20.1%' }} />
            <col style={{ width: '9.4%' }} />
            <col style={{ width: '18.8%' }} />
            <col style={{ width: '4%' }} />
            <col style={{ width: '12.1%' }} />
            <col style={{ width: '26.9%' }} />
          </colgroup>
          <tbody>
            <tr>
              <td style={labelCell}>NIF / NIE</td>
              <td colSpan={2} style={valueCell}>{p.dni ?? ''}</td>
              <td colSpan={2} style={labelCell}>Nacionalidad</td>
              <td colSpan={2} style={valueCell}></td>
            </tr>
            <tr>
              <td style={labelCell}>Nombre</td>
              <td colSpan={2} style={valueCell}>{p.nombre ?? ''}</td>
              <td colSpan={2} style={labelCell}>Apellido 1</td>
              <td colSpan={2} style={valueCell}>{p.apellido1 ?? ''}</td>
            </tr>
            <tr>
              <td style={labelCell}>Apellido 2</td>
              <td colSpan={6} style={valueCell}>{p.apellido2 ?? ''}</td>
            </tr>
            <tr>
              <td style={labelCell}>Email</td>
              <td colSpan={3} style={valueCell}>{p.email ?? ''}</td>
              <td style={labelCell}>Teléfono</td>
              <td colSpan={2} style={valueCell}>{p.telefono ?? ''}</td>
            </tr>
          </tbody>
        </table>

        <div style={sectionTitle}>2.- Datos de la escuela de tiempo libre y del curso:</div>
        <table style={tableStyle}>
          <colgroup>
            <col style={{ width: '25.4%' }} />
            <col style={{ width: '24.6%' }} />
            <col style={{ width: '15.6%' }} />
            <col style={{ width: '10.7%' }} />
            <col style={{ width: '4%' }} />
            <col style={{ width: '19.6%' }} />
          </colgroup>
          <tbody>
            <tr>
              <td colSpan={2} style={labelCell}>Nombre de la escuela</td>
              <td colSpan={4} style={valueCell}>{school.nombre}</td>
            </tr>
            <tr>
              <td colSpan={2} style={labelCell}>Nombre del curso</td>
              <td colSpan={4} style={valueCell}>{fijos.nombre_curso}</td>
            </tr>
            <tr>
              <td style={labelCell}>Código del curso</td>
              <td colSpan={2} style={valueCell}>{p.codigo_curso ?? ''}</td>
              <td style={labelCell}>Dirección escuela</td>
              <td colSpan={2} style={valueCell}>{fijos.direccion_escuela}</td>
            </tr>
            <tr>
              <td style={labelCell}>Fecha inicio del curso</td>
              <td colSpan={2} style={valueCell}>{fechaInicioCurso ?? ''}</td>
              <td style={labelCell}>Tel. escuela</td>
              <td colSpan={2} style={valueCell}>{fijos.telefono_escuela}</td>
            </tr>
            <tr>
              <td style={labelCell}>Fecha finalización fase teórica</td>
              <td colSpan={2} style={valueCell}>{fechaFinTeorica ?? ''}</td>
              <td style={labelCell}>Fecha finalización fase práctica</td>
              <td colSpan={2} style={valueCell}>{p.fecha_final ?? ''}</td>
            </tr>
          </tbody>
        </table>

        <div style={sectionTitle}>3.- Información de las prácticas (rellenar la/s actividad/es que se hayan realizado):</div>
        <div style={activityTitle}>Actividad 1</div>
        {renderActivityTable(1)}

        <div style={activityTitle}>Actividad 2</div>
        {renderActivityTable(2)}

        <table style={tableStyle}>
          <colgroup>
            <col style={{ width: '33.8%' }} />
            <col style={{ width: '66.2%' }} />
          </colgroup>
          <tbody>
            <tr>
              <td style={labelCell}>NÂº total de horas realizadas (actividad 1 + actividad 2)</td>
              <td style={valueCell}></td>
            </tr>
          </tbody>
        </table>

        <div style={sectionTitle}>4.- Datos de monitores/as:</div>
        <table style={tableStyle}>
          <colgroup>
            <col style={{ width: '12.2%' }} />
            <col style={{ width: '38%' }} />
            <col style={{ width: '12.2%' }} />
            <col style={{ width: '37.6%' }} />
          </colgroup>
          <thead>
            <tr>
              <td style={{ ...cell, fontWeight: 'bold' }}></td>
              <td style={{ ...cell, fontWeight: 'bold' }}>Actividad 1</td>
              <td style={{ ...cell, fontWeight: 'bold' }}>Actividad 2</td>
              <td style={{ ...cell, fontWeight: 'bold' }}>Actividad 3</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={labelCell}>NÂº de monitores/as y coordinadores/as titulados/as</td>
              <td style={{ ...cell, minHeight: '8mm' }}>{p.n_monitores_titulados ?? ''}</td>
              <td style={{ ...cell, minHeight: '8mm' }}></td>
              <td style={{ ...cell, minHeight: '8mm' }}></td>
            </tr>
            <tr>
              <td style={labelCell}>NÂº de monitores/as y coordinadores/as en prácticas</td>
              <td style={{ ...cell, minHeight: '8mm' }}>{p.n_monitores_practicas ?? ''}</td>
              <td style={{ ...cell, minHeight: '8mm' }}></td>
              <td style={{ ...cell, minHeight: '8mm' }}></td>
            </tr>
          </tbody>
        </table>

        <div style={sectionTitle}>5.- Datos del tutor/a de prácticas:</div>
        <table style={tableStyle}>
          <colgroup>
            <col style={{ width: '23.1%' }} />
            <col style={{ width: '76.9%' }} />
          </colgroup>
          <tbody>
            <tr>
              <td style={labelCell}>
                <div>Nombre</div>
                <div style={{ marginTop: '2mm' }}>Tipo de titulación</div>
              </td>
              <td style={valueCell}>
                <div>{p.coordinador_practicas ?? ''}</div>
                <div style={{ marginTop: '2mm', minHeight: '6mm' }}></div>
              </td>
            </tr>
          </tbody>
        </table>

        <div style={sectionTitle}>6.- Memoria de prácticas:</div>
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
              <td style={labelCell}>
                <div>Fecha de entrega en la escuela</div>
                <div style={{ marginTop: '2mm' }}>Coordinador/a de prácticas de la escuela</div>
              </td>
              <td style={valueCell}>
                <div>{p.fecha_entrega_memoria ?? ''}</div>
                <div style={{ marginTop: '2mm' }}>{p.coordinador_escuela ?? ''}</div>
              </td>
            </tr>
            <tr>
              <td style={labelCell}>Calificación</td>
              <td style={{ ...valueCell, fontWeight: 'bold', fontSize: '11pt', textAlign: 'center' }}>
                {fijos.calificacion_default}
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: '8mm', fontSize: '9pt', fontFamily: 'Arial, sans-serif' }}>
          <div>
            En {fijos.ciudad}, a {fechaFirmaTexto}
          </div>
          <div style={{ marginTop: '2mm', fontWeight: 'bold', textTransform: 'uppercase' }}>
            LA ESCUELA DE TIEMPO LIBRE
          </div>
          <div style={{ marginTop: '1mm' }}>El director o coordinador de la escuela</div>
          <div style={{ marginTop: '12mm' }}>
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
                <Image
                  src={fijos.firma_escuela}
                  alt="Firma escuela"
                  width={Math.round(signatureWidthMm * 12)}
                  height={Math.round(signatureHeightMm * 12)}
                  unoptimized
                  onError={() => setFailedSignatureSrc(signatureSrc ?? null)}
                  style={{
                    position: 'absolute',
                    left: '0',
                    bottom: '2mm',
                    width: `${signatureWidthMm}mm`,
                    height: `${signatureHeightMm}mm`,
                    objectFit: 'contain',
                  }}
                />
              )}
              {showSeal && fijos.sello_escuela && (
                <Image
                  src={fijos.sello_escuela}
                  alt="Sello escuela"
                  width={Math.round(sealWidthMm * 12)}
                  height={Math.round(sealHeightMm * 12)}
                  unoptimized
                  onError={() => setFailedSealSrc(sealSrc ?? null)}
                  style={{
                    position: 'absolute',
                    right: '-8mm',
                    bottom: '0',
                    width: `${sealWidthMm}mm`,
                    height: `${sealHeightMm}mm`,
                    objectFit: 'contain',
                    opacity: 0.85,
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
      </div>
    );
  }
);

export default FichaPracticasTemplate;

