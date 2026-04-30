import { test, expect } from '@playwright/test';

test('home renderiza shell y firmas demo', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Fichas de Prácticas' })).toBeVisible();
  await expect(page.getByText('Firma demo PNG')).toBeVisible();
  await expect(page.getByText('Firma demo SVG')).toBeVisible();
  await expect(page.getByText('Sin fichas que mostrar')).toBeVisible();
  await expect(page.getByText('/logos/firma-recuerdo-demo.png')).toBeVisible();
  await expect(page.getByText('/logos/firma-recuerdo-demo.svg')).toBeVisible();
});
