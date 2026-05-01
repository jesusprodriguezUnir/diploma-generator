import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FieldEditor from '@/components/FieldEditor';
import type { Practicante } from '@/lib/types';

const mockStudent: Practicante = {
  nombre: 'Juan',
  apellido1: 'Perez',
  dni: '12345678Z',
  _sheet: 'Hoja1',
  _rowIndex: 1,
};

describe('FieldEditor', () => {
  it('dispara onUpdate al cambiar campos', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    const onReset = vi.fn();

    render(
      <FieldEditor
        practicante={mockStudent}
        onUpdate={onUpdate}
        onReset={onReset}
      />
    );

    const nameInput = screen.getByLabelText(/Nombre/i);
    await user.type(nameInput, 'X');

    // Dado que el componente es controlado y el prop no cambia en el test, 
    // el valor resultante será el prop original + el carácter tecleado
    expect(onUpdate).toHaveBeenCalledWith({ nombre: 'JuanX' });
  });

  it('dispara onReset al pulsar resetear', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    const onReset = vi.fn();

    render(
      <FieldEditor
        practicante={mockStudent}
        onUpdate={onUpdate}
        onReset={onReset}
      />
    );

    await user.click(screen.getByText(/Resetear a original/i));
    expect(onReset).toHaveBeenCalled();
  });
});
