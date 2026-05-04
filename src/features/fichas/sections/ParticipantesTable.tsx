import type { Practicante } from '@/lib/types';
import { tableStyle, labelCell, valueCell } from '../ficha-styles';

export default function ParticipantesTable({ practicante: p }: { practicante: Practicante }) {
  return (
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
  );
}
