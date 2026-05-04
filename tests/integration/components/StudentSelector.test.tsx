import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import StudentSelector from '@/features/students/StudentSelector';
import { StudentsContext } from '@/features/students/StudentsContext';
import type { Practicante, FichaData, ExcelRow } from '@/lib/types';

const mockPracticantes: Practicante[] = [
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

function MockStudentsWrapper({
  children,
  onSelectionChange,
}: {
  children: React.ReactNode;
  onSelectionChange: (s: Set<number>) => void;
}) {
  const [selected, setSelected] = React.useState(new Set<number>());

  const setSelectedWrapped: React.Dispatch<React.SetStateAction<Set<number>>> = (val) => {
    const next = typeof val === 'function' ? val(selected) : val;
    setSelected(next);
    onSelectionChange(next);
  };

  return (
    <StudentsContext.Provider
      value={{
        rows: [] as ExcelRow[],
        practicantes: mockPracticantes,
        editedPracticantes: mockPracticantes,
        editions: {},
        selectedPracticantes: selected,
        previewFichaIndex: null,
        fileName: '',
        isDemo: false,
        error: null,
        selectedFichas: [] as FichaData[],
        previewFichas: [] as FichaData[],
        loadFromExcel: vi.fn(),
        loadDemo: vi.fn(),
        clearAll: vi.fn(),
        updateEdition: vi.fn(),
        resetEdition: vi.fn(),
        setSelectedPracticantes: setSelectedWrapped,
        setPreviewFichaIndex: vi.fn(),
      }}
    >
      {children}
    </StudentsContext.Provider>
  );
}

describe('StudentSelector', () => {
  it('filtra por busqueda y dispara seleccion por practicas', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();

    render(
      <MockStudentsWrapper onSelectionChange={onSelectionChange}>
        <StudentSelector />
      </MockStudentsWrapper>
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
