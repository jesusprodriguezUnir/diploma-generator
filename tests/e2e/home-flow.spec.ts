import { test, expect } from '@playwright/test';

test('home renderiza shell correctamente', async ({ page }) => {
  await page.goto('/');

  // Shell básica
  await expect(page.getByRole('heading', { name: 'Fichas de Prácticas' })).toBeVisible();
  await expect(page.getByText('Sin fichas que mostrar')).toBeVisible();
  
  // Configuración colapsable
  await expect(page.getByText('Configuración de Escuela')).toBeVisible();
});

test('flujo de selección y editor condicional', async ({ page }) => {
  await page.goto('/');

  // 1. Activar modo demo
  await page.getByLabel('Activar modo demostración').click();
  
  // 2. Verificar que aparecen alumnos
  await expect(page.getByText('alumnos', { exact: false })).toBeVisible();
  
  // 3. Seleccionar UN alumno
  const firstStudent = page.locator('label').filter({ hasText: '✓ con prácticas' }).first();
  await firstStudent.click();

  // 4. Verificar que aparece el editor y la vista previa individual
  await expect(page.getByText('Editor de Ficha')).toBeVisible();
  await expect(page.getByText('1 alumnos en vista previa')).toBeVisible();

  // 5. Seleccionar un SEGUNDO alumno
  const secondStudent = page.locator('label').filter({ hasText: '✓ con prácticas' }).nth(1);
  await secondStudent.click();

  // 6. Verificar que el editor DESAPARECE y la vista previa indica 2 alumnos
  await expect(page.getByText('Editor de Ficha')).not.toBeVisible();
  await expect(page.getByText('2 alumnos en vista previa')).toBeVisible();

  // 7. Desmarcar todos y verificar que no hay vista previa
  await page.getByRole('button', { name: 'Desmarcar todos' }).click();
  await expect(page.getByText('Sin fichas que mostrar')).toBeVisible();
});
