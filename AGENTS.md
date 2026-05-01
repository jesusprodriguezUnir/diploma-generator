<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Diploma Generator — Agent Instructions

Generador de fichas de prácticas PDF (modo único). Next.js 16 (App Router) + React 19 + Tailwind CSS v4 + TypeScript.

## Commands

```bash
npm run dev      # Dev server → http://localhost:3000
npm run build    # Production build
npm run lint     # ESLint (Next.js config)
npm run test     # Alias de unitarias/integración
npm run test:unit
npm run test:watch
npm run test:e2e
npm run test:ci
```

## Architecture

```
src/
  app/           # Next.js App Router (layout + page only)
  components/    # UI components + template de ficha
  lib/           # Core logic: excel-parser, mapping-engine, pdf-generator-client, types
  configs/       # Config de escuela (FichaSchoolConfig)
  mocks/         # Demo data de fichas
tests/
  unit/          # Vitest unit
  integration/   # Vitest + Testing Library
  e2e/           # Playwright
```

## Key Conventions

- **PDF generation is client-only** (`pdf-generator-client.ts`). Uses `html2pdf.js` via dynamic `import()` — never import at top-level.
- **FichaPracticasTemplate** uses `forwardRef` so the generator can access the DOM node.
- **School config** is dynamic. Initial config is in `src/configs/escuela-recuerdo.json`, but changes are handled via `activeConfig` state and persisted in `localStorage`.
- **ConfigManager & FieldEditor**: Use these components for managing school settings and individual student data corrections respectively.
- **Ficha format**: A4 portrait (`210mm` de ancho) con estilos dinámicos basados en `school.estilos`.
- **All shared types** are in `src/lib/types.ts` — add new types there, never inline them in components.
- Tailwind v4 is used for the app shell UI only. Immersive designs should use custom CSS variables mapped in `@theme`.

## Testing Conventions

- Unit tests for lógica pura en `tests/unit/lib`.
- Integration tests for UI behavior en `tests/integration/components`.
- E2E smoke/flows en `tests/e2e` con Playwright.
- Prefer assertions robustas (roles, labels, ids) sobre textos ambiguos.

## Demo Signature Assets

- PNG: `public/logos/firma-recuerdo-demo.png`
- SVG: `public/logos/firma-recuerdo-demo.svg`
- Config activa: `valoresFijos.firma_escuela` en `src/configs/escuela-recuerdo.json`.

## Common Pitfalls

- `html2pdf.js` must be dynamically imported inside async functions — it crashes on the server.
- Excel column names in `mapeoColumnas` are case- and space-sensitive (they must match the `.xlsx` header row exactly).
- `FichaPracticasTemplate` debe mantener medidas en `mm`; no cambiar a `px` para evitar recortes en PDF.
- En E2E, evita asserts por texto corto tipo "DEMO"; puede generar colisiones de selector.

