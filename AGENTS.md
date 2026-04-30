<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Diploma Generator — Agent Instructions

Generador de diplomas PDF multiescuela. Next.js 16 (App Router) + React 19 + Tailwind CSS v4 + TypeScript. Ver [plan.md](../plan.md) para contexto completo del proyecto.

## Commands

```bash
npm run dev      # Dev server → http://localhost:3000
npm run build    # Production build
npm run lint     # ESLint (Next.js config)
```

## Architecture

```
src/
  app/           # Next.js App Router (layout + page only)
  components/    # UI components (all client-side)
  lib/           # Core logic: excel-parser, mapping-engine, pdf-generator-client, types
  configs/       # Per-school JSON configs (SchoolConfig shape)
  mocks/         # Demo data (mock-data.ts + alumnos-demo.xlsx)
```

## Key Conventions

- **PDF generation is client-only** (`pdf-generator-client.ts`). Uses `html2pdf.js` via dynamic `import()` — never import at the top level; Vercel serverless has no DOM.
- **DiplomaTemplate** uses `forwardRef` so the PDF generator can access the DOM node. Always keep `ref` forwarded on the root `<div>`.
- **School configs** live in `src/configs/*.json` and must conform to `SchoolConfig` (defined in [src/lib/types.ts](src/lib/types.ts)). The `mapeoColumnas` field maps Excel column headers → internal keys (`nombre_alumno`, `nota`, `curso`, …).
- **Diploma format**: A4 landscape, 297 × 210 mm, inline styles (not Tailwind classes) inside `DiplomaTemplate` so html2pdf.js captures them correctly.
- **All shared types** are in `src/lib/types.ts` — add new types there, never inline them in components.
- Tailwind v4 is used for the app shell UI only, **not** inside `DiplomaTemplate`.

## Adding a New School

1. Create `src/configs/<id>.json` following the `SchoolConfig` interface.
2. Add the logo to `public/logos/<id>.png`.
3. Register the school in the `SchoolSelector` component.
4. (Optional) add mock students to `src/mocks/mock-data.ts`.

## Common Pitfalls

- `html2pdf.js` must be dynamically imported inside async functions — it crashes on the server.
- Excel column names in `mapeoColumnas` are case- and space-sensitive (they must match the `.xlsx` header row exactly).
- `DiplomaTemplate` width/height are in `mm` units (`297mm`/`210mm`) — do not change to `px` or the PDF will crop.

