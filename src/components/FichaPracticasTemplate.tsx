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
  padding: '1.5mm 2mm',
  fontSize: '9pt',
  verticalAlign: 'top',
  fontFamily: 'Arial, sans-serif',
};

const labelCell: React.CSSProperties = {
  ...cell,
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
  background: '#f0f0f0',
  width: '38mm',
};

const valueCell: React.CSSProperties = {
  ...cell,
  minHeight: '6mm',
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  tableLayout: 'fixed',
};

const FichaPracticasTemplate = forwardRef<HTMLDivElement, FichaPracticasTemplateProps>(
  function FichaPracticasTemplate({ data, scale = 1 }, ref) {
    const { practicante: p, school } = data;
    const fijos = school.valoresFijos;
    const [showSignature, setShowSignature] = useState(Boolean(fijos.firma_escuela));
    const fechaGeneracion = new Date().toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const nombreCompleto = [p.apellido1, p.apellido2, p.nombre]
      .filter(Boolean)
      .join(' ');

    // Parsear fecha inicio y fin teórica del campo "fechas_curso" (ej: "02/09/24 - 14/12/24")
    const [fechaInicioCurso, fechaFinTeorica] = (p.fechas_curso ?? '')
      .split('-')
      .map((s) => s.trim());

    const containerStyle: React.CSSProperties = {
      width: '210mm',
      boxSizing: 'border-box',
      padding: '8mm 10mm',
      fontFamily: 'Arial, sans-serif',
      fontSize: '9pt',
      color: '#000',
      background: '#fff',
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
    };

    const sectionTitle: React.CSSProperties = {
      fontFamily: 'Arial, sans-serif',
      fontSize: '10pt',
      fontWeight: 'bold',
      background: school.estilos.colorPrimario,
      color: '#fff',
      padding: '1.5mm 3mm',
      marginTop: '3mm',
      marginBottom: '0',
    };

    return (
      <div ref={ref} style={containerStyle} className="ficha-page">

        {/* ── CABECERA ── */}
        <div style={{ textAlign: 'center', marginBottom: '4mm' }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '13pt', fontWeight: 'bold', color: school.estilos.colorPrimario, letterSpacing: '0.05em' }}>
            FICHA INDIVIDUAL DE PRÁCTICAS
          </div>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9pt', color: '#555' }}>
            (A rellenar por la escuela)
          </div>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', fontWeight: 'bold', marginTop: '1mm' }}>
            {school.nombre}
          </div>
        </div>

        {/* ── §1 DATOS DEL ALUMNO/A ── */}
        <div style={sectionTitle}>1.- Datos del/la alumno/a:</div>
        <table style={tableStyle}>
          <tbody>
            <tr>
              <td style={labelCell}>NIF / NIE</td>
              <td style={valueCell}>{p.dni ?? ''}</td>
              <td style={labelCell}>Nacionalidad</td>
              <td style={valueCell}></td>
            </tr>
            <tr>
              <td style={labelCell}>Nombre</td>
              <td style={valueCell}>{p.nombre ?? ''}</td>
              <td style={labelCell}>Apellido 1</td>
              <td style={valueCell}>{p.apellido1 ?? ''}</td>
            </tr>
            <tr>
              <td style={labelCell}>Apellido 2</td>
              <td style={valueCell}>{p.apellido2 ?? ''}</td>
              <td style={labelCell}>F. Nacimiento</td>
              <td style={valueCell}>{p.fecha_nacimiento ?? ''}</td>
            </tr>
            <tr>
              <td style={labelCell}>Email</td>
              <td style={valueCell}>{p.email ?? ''}</td>
              <td style={labelCell}>Teléfono</td>
              <td style={valueCell}>{p.telefono ?? ''}</td>
            </tr>
          </tbody>
        </table>

        {/* ── §2 DATOS ESCUELA Y CURSO ── */}
        <div style={sectionTitle}>2.- Datos de la escuela de tiempo libre y del curso:</div>
        <table style={tableStyle}>
          <tbody>
            <tr>
              <td style={labelCell}>Nombre de la escuela</td>
              <td colSpan={3} style={valueCell}>{school.nombre}</td>
            </tr>
            <tr>
              <td style={labelCell}>Nombre del curso</td>
              <td colSpan={3} style={valueCell}>{fijos.nombre_curso}</td>
            </tr>
            <tr>
              <td style={labelCell}>Código del curso</td>
              <td style={valueCell}>{p.codigo_curso ?? ''}</td>
              <td style={labelCell}>Dirección escuela</td>
              <td style={valueCell}>{fijos.direccion_escuela}</td>
            </tr>
            <tr>
              <td style={labelCell}>Fecha inicio del curso</td>
              <td style={valueCell}>{fechaInicioCurso ?? ''}</td>
              <td style={labelCell}>Tel. escuela</td>
              <td style={valueCell}>{fijos.telefono_escuela}</td>
            </tr>
            <tr>
              <td style={labelCell}>Fin fase teórica</td>
              <td style={valueCell}>{fechaFinTeorica ?? ''}</td>
              <td style={labelCell}>Fin fase práctica</td>
              <td style={valueCell}>{p.fecha_final ?? ''}</td>
            </tr>
          </tbody>
        </table>

        {/* ── §3 ACTIVIDAD 1 ── */}
        <div style={sectionTitle}>3.- Información de las prácticas — Actividad 1</div>
        <table style={tableStyle}>
          <tbody>
            <tr>
              <td style={labelCell}>Tipo de actividad</td>
              <td colSpan={3} style={valueCell}>
                <span style={{ marginRight: '4mm' }}>
                  <input type="checkbox" readOnly checked={fijos.tipo_actividad_default === 'Campamento con pernocta'} style={{ marginRight: '1mm' }} />
                  Campamento con pernocta
                </span>
                <span style={{ marginRight: '4mm' }}>
                  <input type="checkbox" readOnly checked={false} style={{ marginRight: '1mm' }} />
                  Campamento urbano
                </span>
                <span>
                  <input type="checkbox" readOnly checked={false} style={{ marginRight: '1mm' }} />
                  Intervención socioeducativa
                </span>
              </td>
            </tr>
            <tr>
              <td style={labelCell}>Entidad organizadora</td>
              <td colSpan={3} style={{ ...valueCell, minHeight: '8mm' }}>{p.entidad ?? ''}</td>
            </tr>
            <tr>
              <td style={labelCell}>Persona de contacto</td>
              <td colSpan={3} style={valueCell}>{p.persona_contacto ?? ''}</td>
            </tr>
            <tr>
              <td style={labelCell}>Lugar de prácticas</td>
              <td colSpan={3} style={valueCell}>{p.lugar_practicas ?? ''}</td>
            </tr>
            <tr>
              <td style={labelCell}>Fecha inicio</td>
              <td style={valueCell}>{p.fecha_inicio ?? ''}</td>
              <td style={labelCell}>Fecha fin</td>
              <td style={valueCell}>{p.fecha_final ?? ''}</td>
            </tr>
            <tr>
              <td style={labelCell}>Días de la semana</td>
              <td colSpan={3} style={valueCell}>L &nbsp; M &nbsp; X &nbsp; J &nbsp; V &nbsp; S &nbsp; D</td>
            </tr>
            <tr>
              <td style={labelCell}>Horario</td>
              <td style={valueCell}></td>
              <td style={labelCell}>Nº horas totales</td>
              <td style={valueCell}></td>
            </tr>
            <tr>
              <td style={labelCell}>Nº horas planificadas</td>
              <td style={valueCell}></td>
              <td style={labelCell}>Nº de participantes</td>
              <td style={valueCell}>{p.n_participantes ?? ''}</td>
            </tr>
            <tr>
              <td style={labelCell}>Edades participantes</td>
              <td style={valueCell}>{p.edad_participantes ?? ''}</td>
              <td style={labelCell}>Su grupo</td>
              <td style={valueCell}>{p.su_grupo ?? ''}</td>
            </tr>
            <tr>
              <td style={labelCell}>Denominación del proyecto</td>
              <td colSpan={3} style={valueCell}>{p.titulo_memoria ?? ''}</td>
            </tr>
            <tr>
              <td style={labelCell}>Descripción y objetivos</td>
              <td colSpan={3} style={{ ...valueCell, minHeight: '18mm' }}>{p.caracteristicas ?? ''}</td>
            </tr>
            <tr>
              <td style={labelCell}>Observaciones</td>
              <td colSpan={3} style={{ ...valueCell, minHeight: '8mm' }}></td>
            </tr>
          </tbody>
        </table>

        {/* ── §4 DATOS MONITORES/AS ── */}
        <div style={sectionTitle}>4.- Datos de monitores/as:</div>
        <table style={tableStyle}>
          <thead>
            <tr>
              <td style={{ ...cell, fontWeight: 'bold', background: '#f0f0f0', width: '60%' }}>
                Nº de monitores/as y coordinadores/as titulados/as
              </td>
              <td style={{ ...cell, fontWeight: 'bold', background: '#f0f0f0' }}>
                Nº de monitores/as y coordinadores/as en prácticas
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ ...cell, minHeight: '8mm' }}>{p.n_monitores_titulados ?? ''}</td>
              <td style={{ ...cell, minHeight: '8mm' }}>{p.n_monitores_practicas ?? ''}</td>
            </tr>
          </tbody>
        </table>

        {/* ── §5 TUTOR/A DE PRÁCTICAS ── */}
        <div style={sectionTitle}>5.- Datos del tutor/a de prácticas:</div>
        <table style={tableStyle}>
          <tbody>
            <tr>
              <td style={labelCell}>Nombre tutor/a</td>
              <td style={valueCell}>{p.coordinador_practicas ?? ''}</td>
              <td style={labelCell}>Tipo de titulación</td>
              <td style={valueCell}></td>
            </tr>
          </tbody>
        </table>

        {/* ── §6 MEMORIA DE PRÁCTICAS ── */}
        <div style={sectionTitle}>6.- Memoria de prácticas:</div>
        <table style={tableStyle}>
          <tbody>
            <tr>
              <td style={labelCell}>Título</td>
              <td colSpan={3} style={valueCell}>{p.titulo_memoria ?? ''}</td>
            </tr>
            <tr>
              <td style={labelCell}>Fecha de entrega</td>
              <td style={valueCell}>{p.fecha_entrega_memoria ?? ''}</td>
              <td style={labelCell}>Coordinador/a escuela</td>
              <td style={valueCell}>{p.coordinador_escuela ?? ''}</td>
            </tr>
            <tr>
              <td style={labelCell}>Calificación</td>
              <td colSpan={3} style={{ ...valueCell, fontWeight: 'bold', fontSize: '11pt' }}>
                {fijos.calificacion_default}
              </td>
            </tr>
          </tbody>
        </table>

        {/* ── PIE DE FIRMA ── */}
        <div style={{ marginTop: '8mm', fontSize: '9pt', fontFamily: 'Arial, sans-serif' }}>
          <div>
            En {fijos.ciudad}, a{' '}
            {fechaGeneracion}
          </div>
          <div style={{ marginTop: '2mm', fontWeight: 'bold', textTransform: 'uppercase' }}>
            LA ESCUELA DE TIEMPO LIBRE
          </div>
          <div style={{ marginTop: '1mm' }}>El director o coordinador de la escuela</div>
          <div style={{ marginTop: '12mm' }}>
            <div style={{ position: 'relative', display: 'inline-block', width: '60mm', height: '16mm', marginBottom: '1mm' }}>
              {showSignature && fijos.firma_escuela && (
                <Image
                  src={fijos.firma_escuela}
                  alt="Firma escuela"
                  width={220}
                  height={60}
                  unoptimized
                  onError={() => setShowSignature(false)}
                  style={{
                    position: 'absolute',
                    left: '0',
                    bottom: '2mm',
                    maxWidth: '58mm',
                    maxHeight: '14mm',
                    objectFit: 'contain',
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
          <div style={{ marginTop: '2mm', fontSize: '8pt', color: '#555' }}>
            Alumno/a: {nombreCompleto} &nbsp;|&nbsp; DNI: {p.dni ?? ''} &nbsp;|&nbsp; Código: {p.codigo_curso ?? ''} &nbsp;|&nbsp; Hoja: {p._sheet ?? ''}
          </div>
        </div>

      </div>
    );
  }
);

export default FichaPracticasTemplate;
