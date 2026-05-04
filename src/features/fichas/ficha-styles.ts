import type { CSSProperties } from 'react';

export const cell: CSSProperties = {
  border: '1px solid #000',
  padding: '2mm',
  fontSize: '9pt',
  lineHeight: '1.3',
  verticalAlign: 'middle',
  fontFamily: 'Arial, sans-serif',
  color: '#000',
  background: '#fff',
};

export const labelCell: CSSProperties = {
  ...cell,
  fontWeight: 'bold',
};

export const valueCell: CSSProperties = {
  ...cell,
  minHeight: '6mm',
};

export const tableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  tableLayout: 'fixed',
  marginTop: '2mm',
};

export const sectionTitle: CSSProperties = {
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'bold',
  fontSize: '10pt',
  marginTop: '4mm',
  marginBottom: '1mm',
  color: '#000',
};
