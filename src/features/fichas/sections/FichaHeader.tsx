import type { FichaSchoolConfig } from '@/lib/types';

export default function FichaHeader({ school }: { school: FichaSchoolConfig }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8mm' }}>
      <div style={{ width: '45mm', minHeight: '15mm' }}>
        {school.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
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
  );
}
