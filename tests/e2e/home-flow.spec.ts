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
  await page.getByText('Modo Demo').waitFor({ state: 'visible' });
  await page.locator('#demo-mode-toggle').click({ force: true });
  
  // 2. Verificar que aparecen alumnos (esperar a que aparezca el primer alumno)
  const firstStudent = page.locator('.student-row').first();
  await expect(firstStudent).toBeVisible({ timeout: 15000 });
  
  // 3. Seleccionar UN alumno
  await firstStudent.click({ force: true });

  // 4. Verificar que aparece el editor y la vista previa individual
  await expect(page.getByText('Editor de Ficha')).toBeVisible();
  await expect(page.getByText(/1 alumnos en vista previa/i)).toBeVisible();

  // 5. Seleccionar un SEGUNDO alumno
  await page.getByLabel(/Seleccionar/i).nth(1).click({ force: true });

  // 6. Verificar que el editor DESAPARECE y la vista previa indica 2 alumnos
  await expect(page.getByText('Editor de Ficha')).not.toBeVisible();
  await expect(page.getByText('2 alumnos en vista previa')).toBeVisible();

  // 7. Desmarcar todos y verificar que no hay vista previa
  await page.getByRole('button', { name: 'Desmarcar todos' }).click();
  await expect(page.getByText('Sin fichas que mostrar')).toBeVisible();
});
