'use client';

import { useState } from 'react';
import type { FichaValoresFijos } from '@/lib/types';
import { parsePositiveMm, formatFechaFirma } from '@/lib/pdf/format';

export default function FirmasFooter({ fijos }: { fijos: FichaValoresFijos }) {
  const signatureSrc = fijos.firma_escuela;
  const sealSrc = fijos.sello_escuela;
  const [failedSignatureSrc, setFailedSignatureSrc] = useState<string | null>(null);
  const [failedSealSrc, setFailedSealSrc] = useState<string | null>(null);

  const showSignature = Boolean(signatureSrc) && failedSignatureSrc !== signatureSrc;
  const showSeal = Boolean(sealSrc) && failedSealSrc !== sealSrc;

  const signatureWidthMm = parsePositiveMm(fijos.firma_ancho_mm as string, 46);
  const signatureHeightMm = parsePositiveMm(fijos.firma_alto_mm as string, 12);
  const sealWidthMm = parsePositiveMm(fijos.sello_ancho_mm as string, 20);
  const sealHeightMm = parsePositiveMm(fijos.sello_alto_mm as string, 20);

  return (
    <>
      <div style={{ marginTop: '7.5mm', fontSize: '9pt', fontFamily: 'Arial, sans-serif' }}>
        <div>En {fijos.ciudad || 'Madrid'}, a {formatFechaFirma()}</div>
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
              // eslint-disable-next-line @next/next/no-img-element
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
              // eslint-disable-next-line @next/next/no-img-element
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
            />
          </div>
        </div>
        <div>Fdo.: {fijos.director}</div>
      </div>

      <div style={{ marginTop: '5mm', paddingTop: '2mm', borderTop: '1px solid #ccc', fontSize: '8pt', fontFamily: 'Arial, sans-serif', color: '#333' }}>
        <sup style={{ marginRight: '1mm' }}>[1]</sup>
        Junto con esta ficha deberá presentarse fotocopia escaneada de la titulación del tutor/a de prácticas, según lo dispuesto en el Decreto 14/2022 de 30 de marzo, art. 6.2.
      </div>
    </>
  );
}
