import { WEEK_DAYS } from '@/lib/constants/week';
import { Checkbox } from '../Checkbox';

interface SemanaCalendarProps {
  diasSemana: string;
  isActividad1: boolean;
}

export default function SemanaCalendar({ diasSemana, isActividad1 }: SemanaCalendarProps) {
  const dias = diasSemana.toUpperCase();
  const check = (dia: string) => isActividad1 && dias.includes(dia);

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '0.8mm', padding: 0 }}>
      {WEEK_DAYS.map((letra) => (
        <div key={letra} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1mm', flexShrink: 0 }}>
          <span style={{ fontFamily: 'Arial, sans-serif', fontSize: '8pt', lineHeight: 1.2 }}>{letra}</span>
          <Checkbox checked={check(letra)} />
        </div>
      ))}
    </div>
  );
}
