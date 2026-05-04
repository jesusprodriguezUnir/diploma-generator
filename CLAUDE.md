# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important: Next.js 16

This project uses Next.js 16, which has breaking changes relative to earlier versions. Before writing any Next.js-specific code, consult `node_modules/next/dist/docs/` — do not rely on training-data assumptions about Next.js APIs or file conventions.

## Project root

The Next.js app lives in `diploma-generator/`. All commands below must be run from that folder, not from the parent `d:\Personal\Diplomas\`.

## Commands

```bash
npm run dev          # Dev server → http://localhost:3000
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint (Next.js config)

npm run test         # Alias for test:unit
npm run test:unit    # Vitest unit + integration (single run)
npm run test:watch   # Vitest in watch mode
npm run test:e2e     # Playwright E2E (first run: npx playwright install chromium)
npm run test:ci      # test:unit + test:e2e (CI suite)
```

Run a single unit test file:

```bash
npx vitest run tests/unit/lib/<file>.test.ts
```

Run a single E2E spec:

```bash
npx playwright test tests/e2e/<file>.spec.ts
```

## Architecture

### End-to-end flow

```text
ConfigManager (load/edit/export JSON)
  → ExcelParser (parse .xlsx, all sheets concatenated, header at row 4)
    → MappingEngine (cross-reference rows with mapeoColumnas from config)
      → StudentSelector + FieldEditor (select students, correct fields pre-PDF)
        → FichaPracticasTemplate (forwardRef, renders A4 portrait in mm)
          → pdf-generator-client (html2pdf.js → PDF Blob or ZIP via jszip)
```

### lib/ modules

| Module | Responsibility |
| --- | --- |
| `config-validator.ts` | Validates uploaded school JSON against `FichaSchoolConfig` |
| `excel-parser.ts` | Reads `.xlsx` (all sheets concatenated, header = row 4, `headerRowIndex = 3`) |
| `mapping-engine.ts` | Transforms Excel rows → `MappedStudent[]` using `mapeoColumnas` |
| `pdf-generator-client.ts` | Converts rendered DOM nodes → PDF/ZIP (client-only) |
| `types.ts` | **All shared types** — add new types here, never inline in components |

### School config

- Initial config: `src/configs/escuela-recuerdo.json` (schema: `FichaSchoolConfig` in `types.ts`)
- Config is **dynamic**: users can upload JSON or edit via `ConfigManager`
- Active config (`activeConfig`) is persisted in `localStorage` across sessions

### PDF generation

PDF generation is **client-only** — `html2pdf.js` cannot run in Vercel serverless (bundle size/memory limits). `pdf-generator-client.ts` wraps all calls. The entry point is `GenerateButton.tsx`.

### Tailwind v4 usage

Tailwind utilities apply only to the **app shell** (navigation, layout, controls). `FichaPracticasTemplate` (the diploma/ficha itself) uses **custom CSS variables** mapped via `@theme` — never apply Tailwind utilities directly inside the template.

### Testing layout

```text
tests/
  unit/lib/          # Pure logic (excel-parser, mapping-engine, config-validator)
  integration/components/  # UI behavior (Testing Library + Vitest)
  e2e/               # Full flows (Playwright)
```

## Critical pitfalls

- **`html2pdf.js` must be dynamically imported** inside async functions: `const { default: html2pdf } = await import('html2pdf.js')`. A top-level import crashes the server.
- **Keep `FichaPracticasTemplate` dimensions in `mm`** — converting to `px` breaks PDF page boundaries.
- **`mapeoColumnas` is case- and space-sensitive** — values must match the `.xlsx` header row exactly (row 4; `headerRowIndex = 3`).
- **`FichaPracticasTemplate` uses `forwardRef`** — the generator accesses the DOM node directly; do not refactor away the ref.
- **E2E selectors**: avoid short-text selectors like `"DEMO"` — they collide with other elements. Use roles, labels, or `data-testid`.

## Environment variable

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000   # Production: your Vercel URL
```

## Further reading

- [AGENTS.md](AGENTS.md) — detailed agent instructions and conventions
- [README.md](README.md) — user-facing docs: flow, output formats, batch limits (≤10 recommended, ≤25 max)
- [DEPLOY.md](DEPLOY.md) — step-by-step Vercel deployment guide
