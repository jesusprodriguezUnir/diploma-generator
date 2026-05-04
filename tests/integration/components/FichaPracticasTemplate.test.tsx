import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import FichaPracticasTemplate from '@/features/fichas/FichaPracticasTemplate';
import type { FichaData } from '@/lib/types';
import { fichaSchoolConfig } from '@/mocks/mock-fichas';

const mockData: FichaData = {
  practicante: {
    nombre: 'Maria',
    apellido1: 'Lopez',
    dni: '87654321X',
    _sheet: 'Hoja1',
    _rowIndex: 1,
  },
  school: fichaSchoolConfig,
};

describe('FichaPracticasTemplate', () => {
  it('renderiza los datos del alumno correctamente', () => {
    render(<FichaPracticasTemplate data={mockData} />);
    
    expect(screen.getByText('Maria')).toBeInTheDocument();
    expect(screen.getByText('Lopez')).toBeInTheDocument();
    expect(screen.getByText('87654321X')).toBeInTheDocument();
  });

  it('muestra el nombre de la escuela', () => {
    render(<FichaPracticasTemplate data={mockData} />);
    expect(screen.getAllByText(fichaSchoolConfig.nombre).length).toBeGreaterThan(0);
  });
});
