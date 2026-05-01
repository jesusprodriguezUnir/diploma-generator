# Diploma Generator

Aplicación web para generar fichas individuales de prácticas en PDF a partir de Excel.

Estado actual del proyecto:

- Modo activo: ficha de prácticas.
- Configuración dinámica: soporte para carga y edición de múltiples escuelas vía JSON.
- Edición pre-PDF: editor de campos para corregir datos de alumnos y valores fijos antes de generar.
- Flujo principal: Configurar Escuela → Subida de Excel → Seleccionar/Editar Alumnos → Generar PDF/ZIP.

Stack principal: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, xlsx, html2pdf.js y jszip.

## Requisitos

- Node.js 20 o superior
- npm 10 o superior

## Arranque rápido

```bash
npm install
npm run dev
```

Abre http://localhost:3000

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
npm run test
npm run test:unit
npm run test:watch
npm run test:e2e
npm run test:ci
```

## Testing

La base de pruebas queda dividida en 3 niveles:

- Unitarias (Vitest): lógica pura en src/lib
- Integración (Vitest + Testing Library): componentes y comportamiento de UI
- E2E (Playwright): flujo completo de la pantalla principal

Estructura:

```text
tests/
	unit/
		lib/
	integration/
		components/
	e2e/
```

Configuración principal:

- vitest.config.ts
- vitest.setup.ts
- playwright.config.ts

Nota para E2E: si es la primera vez, instala navegadores con `npx playwright install chromium`.

## Funcionalidad

### 1. Gestión de Escuela (Configuración)

El sistema ya no depende de una configuración hardcodeada:
- **Carga de JSON**: Permite subir ficheros de configuración de nuevas escuelas.
- **Editor Integrado**: Permite modificar colores, nombres y valores fijos (director, ciudad, etc.) desde la UI.
- **Exportación**: Puedes descargar el JSON configurado para guardarlo localmente.
- **Persistencia**: La app recuerda la última configuración usada mediante `localStorage`.

### 2. Procesamiento de Excel

- Flujo:
	1. Subir Excel de alumnos MTL.
	2. El sistema lee todas las hojas y las concatena.
	3. Se usa la fila 4 como cabecera (headerRowIndex = 3).
	4. Se normalizan cabeceras con trim para tolerar espacios finales.
	5. Se filtran filas vacías y se listan practicantes.

### 3. Editor de Campos (Pre-PDF)

Antes de generar el documento final, puedes:
- Hacer clic en un alumno para abrir el **Editor de Ficha**.
- Modificar cualquier campo (DNI, fechas, lugar de prácticas, etc.).
- Ver los cambios reflejados instantáneamente en la **Vista Previa**.
- Resetear los valores a su estado original del Excel si es necesario.

## Formatos de salida

- PDF único:
	- Un solo archivo con una página por ficha.
- ZIP individual:
	- Un PDF por alumno dentro de un .zip.

## Límites operativos

- Recomendado: hasta 10 elementos por lote.
- Máximo permitido en la UI: 25 elementos por lote.
- Si necesitas más volumen: dividir en bloques.

## Estructura de proyecto

```text
src/
	app/           # App Router (layout + page)
	components/    # UI, ConfigManager, FieldEditor y plantillas PDF
	configs/       # Ficheros JSON de configuración (base)
	lib/           # Validador de config, Parser Excel, mapeo y generación PDF
	mocks/         # Datos demo
public/
	logos/         # Logos públicos
docs/            # Documentación y materiales fuente
```

En [public/logos](public/logos) se han añadido firmas demo para validación visual:

- [public/logos/firma-recuerdo-demo.png](public/logos/firma-recuerdo-demo.png)
- [public/logos/firma-recuerdo-demo.svg](public/logos/firma-recuerdo-demo.svg)

## Configuración de escuelas

### Fichas de prácticas

- Se pueden cargar dinámicamente mediante el panel de configuración.
- El esquema esperado sigue la interfaz `FichaSchoolConfig` en `src/lib/types.ts`.
- Incluye:
	- modo: ficha
	- mapeoColumnas específico de prácticas
	- valoresFijos para rellenado del documento
	- estilos (colores corporativos)
	- firma_escuela para render de firma en la plantilla

## Firma de prueba

Se han añadido dos recursos de prueba para comparar visualmente el trazo de firma:

- PNG transparente: [public/logos/firma-recuerdo-demo.png](public/logos/firma-recuerdo-demo.png)
- SVG vectorial: [public/logos/firma-recuerdo-demo.svg](public/logos/firma-recuerdo-demo.svg)

La configuración actual apunta a la firma PNG demo en [src/configs/escuela-recuerdo.json](src/configs/escuela-recuerdo.json).

## Carpeta docs

Materiales añadidos y referenciados para validación funcional del modo ficha:

- docs/Datos alumnos CURSOS MTL Recuerdo.xlsx
- docs/FICHA INDIVIDUAL DE PRÁCTICAS NUEVO MODELO.docx
- docs/Eduardo Cobián Quirantes (CVR 2025).docx
- docs/Marina León Mesa (Vinuesa 2025).docx

Uso recomendado de estos archivos:

- El .xlsx como fuente real de carga para pruebas de parseo y mapeo.
- El .docx de modelo como referencia visual del formato objetivo.
- Los .docx nominales como ejemplos de salida esperada para contraste manual.

## Variables de entorno

Crear .env.local:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

En Vercel, usar la URL pública de producción para NEXT_PUBLIC_APP_URL.

## Despliegue

Hay guía detallada en DEPLOY.md.

Resumen:

1. Subir repositorio a GitHub.
2. Importar en Vercel.
3. Configurar NEXT_PUBLIC_APP_URL.
4. Ejecutar deploy Preview y validar flujos.
5. Promocionar a Production.

## Validación recomendada antes de publicar

- Lint limpio: npm run lint
- Build correcto: npm run build
- Pruebas:
	- Unitarias e integración (Vitest): npm run test:unit
	- E2E (Playwright): npm run test:e2e
	- Suite CI local: npm run test:ci
	- Error esperado al subir Excel con cabeceras inválidas
	- Verificación en desktop y móvil
