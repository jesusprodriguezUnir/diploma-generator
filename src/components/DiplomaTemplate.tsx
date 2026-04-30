import { forwardRef } from 'react';
import type { DiplomaData } from '@/lib/types';

interface DiplomaTemplateProps {
  data: DiplomaData;
  scale?: number;
}

/**
 * Plantilla HTML del diploma. Diseño A4 landscape (297mm x 210mm).
 * Se renderiza con los estilos de la escuela y los datos del alumno.
 * Usa forwardRef para que el generador de PDF pueda acceder al DOM.
 */
const DiplomaTemplate = forwardRef<HTMLDivElement, DiplomaTemplateProps>(
  function DiplomaTemplate({ data, scale = 1 }, ref) {
    const { student, school } = data;
    const { estilos, textosFijos } = school;

    const containerStyle: React.CSSProperties = {
      width: '297mm',
      height: '210mm',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: estilos.fuenteCuerpo,
      background: estilos.colorFondo || '#FFFDF7',
      color: estilos.colorPrimario,
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      boxSizing: 'border-box',
    };

    return (
      <div ref={ref} style={containerStyle} className="diploma-page">
        {/* Decorative border - outer */}
        <div
          style={{
            position: 'absolute',
            inset: '8mm',
            border: `3px solid ${estilos.colorSecundario}`,
            borderRadius: '2px',
            pointerEvents: 'none',
          }}
        />

        {/* Decorative border - inner */}
        <div
          style={{
            position: 'absolute',
            inset: '11mm',
            border: `1px solid ${estilos.colorSecundario}80`,
            borderRadius: '2px',
            pointerEvents: 'none',
          }}
        />

        {/* Corner ornaments */}
        {[
          { top: '10mm', left: '10mm' },
          { top: '10mm', right: '10mm' },
          { bottom: '10mm', left: '10mm' },
          { bottom: '10mm', right: '10mm' },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              ...pos,
              width: '20mm',
              height: '20mm',
              borderTop: i < 2 ? `2px solid ${estilos.colorSecundario}` : 'none',
              borderBottom: i >= 2 ? `2px solid ${estilos.colorSecundario}` : 'none',
              borderLeft: i % 2 === 0 ? `2px solid ${estilos.colorSecundario}` : 'none',
              borderRight: i % 2 !== 0 ? `2px solid ${estilos.colorSecundario}` : 'none',
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Content */}
        <div
          style={{
            position: 'absolute',
            inset: '18mm',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '4mm',
          }}
        >
          {/* School logo placeholder */}
          <div
            style={{
              width: '22mm',
              height: '22mm',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${estilos.colorPrimario}, ${estilos.colorSecundario})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10mm',
              color: 'white',
              boxShadow: `0 4px 15px ${estilos.colorPrimario}40`,
            }}
          >
            🎓
          </div>

          {/* School name */}
          <div
            style={{
              fontFamily: estilos.fuenteTitulo,
              fontSize: '5.5mm',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: estilos.colorPrimario,
              marginTop: '2mm',
            }}
          >
            {school.nombre}
          </div>

          {/* Decorative line */}
          <div
            style={{
              width: '60mm',
              height: '0.5mm',
              background: `linear-gradient(90deg, transparent, ${estilos.colorSecundario}, transparent)`,
              margin: '1mm 0',
            }}
          />

          {/* Diploma title */}
          <div
            style={{
              fontFamily: estilos.fuenteTitulo,
              fontSize: '12mm',
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: estilos.colorPrimario,
              lineHeight: 1.1,
            }}
          >
            {textosFijos.titulo}
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: '4.5mm',
              color: `${estilos.colorPrimario}B0`,
              fontStyle: 'italic',
              maxWidth: '200mm',
            }}
          >
            {textosFijos.subtitulo}
          </div>

          {/* "Se otorga a" text */}
          <div
            style={{
              fontSize: '4mm',
              color: `${estilos.colorPrimario}90`,
              marginTop: '3mm',
              letterSpacing: '0.08em',
            }}
          >
            Se otorga a
          </div>

          {/* Student name */}
          <div
            style={{
              fontFamily: estilos.fuenteTitulo,
              fontSize: '10mm',
              fontWeight: 700,
              color: estilos.colorPrimario,
              borderBottom: `1px solid ${estilos.colorSecundario}`,
              paddingBottom: '2mm',
              paddingLeft: '20mm',
              paddingRight: '20mm',
              lineHeight: 1.2,
            }}
          >
            {student.nombre_alumno}
          </div>

          {/* Additional info (course, grade) */}
          <div
            style={{
              display: 'flex',
              gap: '15mm',
              marginTop: '2mm',
              fontSize: '4mm',
            }}
          >
            {student.curso && (
              <div style={{ color: `${estilos.colorPrimario}A0` }}>
                <span style={{ fontWeight: 600 }}>Curso: </span>
                {student.curso}
              </div>
            )}
            {student.nota && (
              <div style={{ color: `${estilos.colorPrimario}A0` }}>
                <span style={{ fontWeight: 600 }}>Calificación: </span>
                <span
                  style={{
                    color: estilos.colorSecundario,
                    fontWeight: 700,
                    fontSize: '4.5mm',
                  }}
                >
                  {student.nota}
                </span>
              </div>
            )}
          </div>

          {/* City and date */}
          <div
            style={{
              fontSize: '3.5mm',
              color: `${estilos.colorPrimario}80`,
              marginTop: '5mm',
            }}
          >
            {textosFijos.ciudad}, {textosFijos.fecha}
          </div>

          {/* Signature area */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end',
              gap: '40mm',
              marginTop: '8mm',
              width: '100%',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '50mm',
                  borderBottom: `1px solid ${estilos.colorPrimario}50`,
                  marginBottom: '2mm',
                }}
              />
              <div
                style={{
                  fontSize: '3.5mm',
                  fontWeight: 600,
                  color: estilos.colorPrimario,
                }}
              >
                {textosFijos.director}
              </div>
              <div
                style={{
                  fontSize: '3mm',
                  color: `${estilos.colorPrimario}70`,
                }}
              >
                Director/a
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '50mm',
                  borderBottom: `1px solid ${estilos.colorPrimario}50`,
                  marginBottom: '2mm',
                }}
              />
              <div
                style={{
                  fontSize: '3.5mm',
                  fontWeight: 600,
                  color: estilos.colorPrimario,
                }}
              >
                Sello del Centro
              </div>
              <div
                style={{
                  fontSize: '3mm',
                  color: `${estilos.colorPrimario}70`,
                }}
              >
                V.º B.º
              </div>
            </div>
          </div>
        </div>

        {/* Watermark decorative elements */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '120mm',
            height: '120mm',
            borderRadius: '50%',
            border: `1px solid ${estilos.colorSecundario}10`,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '140mm',
            height: '140mm',
            borderRadius: '50%',
            border: `1px solid ${estilos.colorSecundario}08`,
            pointerEvents: 'none',
          }}
        />
      </div>
    );
  }
);

export default DiplomaTemplate;
