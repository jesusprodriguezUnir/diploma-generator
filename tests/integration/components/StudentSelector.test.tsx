import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StudentSelector from '@/components/StudentSelector';
import type { Practicante } from '@/lib/types';

const practicantes: Practicante[] = [
  {
    nombre: 'Eduardo',
    apellido1: 'Cobian',
    apellido2: 'Quirantes',
    dni: '54697996V',
    lugar_practicas: 'Palencia',
    _sheet: 'CURSO 53',
    _rowIndex: 4,
  },
  {
    nombre: 'Ana',
    apellido1: 'Garcia',
    dni: '55000001A',
    lugar_practicas: '',
    _sheet: 'CURSO 53',
    _rowIndex: 5,
  },
];

describe('StudentSelector', () => {
  it('filtra por busqueda y dispara seleccion por practicas', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();

    render(
      <StudentSelector
        practicantes={practicantes}
        selected={new Set<number>()}
        onSelectionChange={onSelectionChange}
      />
    );

    await user.type(screen.getByPlaceholderText('Buscar por nombre, DNI o curso...'), 'Ana');

    expect(screen.getByText(/Garcia Ana/i)).toBeInTheDocument();
    expect(screen.queryByText(/Eduardo/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Solo con prácticas/i }));

    expect(onSelectionChange).toHaveBeenCalled();
    const lastCall = onSelectionChange.mock.calls.at(-1)?.[0] as Set<number>;
    expect(Array.from(lastCall.values())).toEqual([0]);
  });
});
