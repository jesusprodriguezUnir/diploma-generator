import type { Practicante, FichaValoresFijos } from '@/lib/types';
import { tableStyle, labelCell, valueCell } from '../ficha-styles';
import { Checkbox } from '../Checkbox';
import SemanaCalendar from './SemanaCalendar';

interface ActividadesTableProps {
  actividad: 1 | 2;
  practicante: Practicante;
  fijos: FichaValoresFijos;
}

export default function ActividadesTable({ actividad, practicante: p, fijos }: ActividadesTableProps) {
  const isActividad1 = actividad === 1;
  const tipoActividadActual = p.tipo_actividad || fijos.tipo_actividad_default || '';
  const diasConfigurados = fijos.dias_semana_por_tipo as Record<string, string> | undefined;
  const diasDelTipo = tipoActividadActual ? diasConfigurados?.[tipoActividadActual] : undefined;
  const tieneDiasConfigurados = !!diasDelTipo;
  const diasSemana = tieneDiasConfigurados ? diasDelTipo : (p.dias_semana || '');

  const entidad = isActividad1 ? (p.entidad || fijos.entidad_organizadora_default || '') : '';
  const nifEntidad = isActividad1 ? (p.nif_entidad || fijos.nif_entidad_default || '') : '';
  const direccion = isActividad1 ? (p.lugar_practicas ?? '') : '';
  const telefono = isActividad1 ? (p.persona_contacto ?? '') : '';
  const fechaInicio = isActividad1 ? (p.fecha_inicio ?? '') : '';
  const fechaFin = isActividad1 ? (p.fecha_final ?? '') : '';
  const horario = isActividad1 ? (tieneDiasConfigurados ? 'Completo' : (p.horario ?? '')) : '';
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
              <Checkbox checked={isActividad1 && tipoActividadActual === 'Campamento con pernocta'} />
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
              <Checkbox checked={isActividad1 && tipoActividadActual === 'Otra'} />
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
          <td style={{ ...valueCell, padding: '2mm 1mm' }}>
            <SemanaCalendar
              diasSemana={diasSemana}
              isActividad1={isActividad1}
            />
          </td>
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
}
