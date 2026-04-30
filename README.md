# Diploma Generator

Aplicación web para generar documentos PDF desde Excel en dos modos:

- Modo diploma: diplomas académicos multiescuela.
- Modo ficha: ficha individual de prácticas para Escuela Nuestra Señora del Recuerdo.

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
```

## Funcionalidad

### 1) Modo diploma

- Escuelas disponibles:
	- Instituto Central de Educación
	- Colegio Montessori Internacional
- Flujo:
	1. Seleccionar escuela.
	2. Subir Excel o activar Demo.
	3. Validar cabeceras contra el mapeo de la escuela.
	4. Generar PDF único o ZIP con PDFs individuales.

### 2) Modo ficha de prácticas

- Escuela fija: Escuela Nuestra Señora del Recuerdo.
- Flujo:
	1. Subir Excel de alumnos MTL.
	2. El sistema lee todas las hojas y las concatena.
	3. Se usa la fila 4 como cabecera (headerRowIndex = 3).
	4. Se normalizan cabeceras con trim para tolerar espacios finales.
	5. Se filtran filas vacías y se listan practicantes.
	6. Seleccionar alumnos y generar PDF único o ZIP individual.

## Formatos de salida

- PDF único:
	- Un solo archivo con una página por diploma/ficha.
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
	components/    # UI y plantillas PDF
	configs/       # Configuración por escuela
	lib/           # Parser Excel, mapeo y generación PDF cliente
	mocks/         # Datos demo
public/
	logos/         # Logos públicos
docs/            # Documentación y materiales fuente
```

## Configuración de escuelas

### Diplomas

- Configs en src/configs/*.json
- Deben incluir: id, nombre, logo, estilos, mapeoColumnas, textosFijos

### Fichas de prácticas

- Config principal en src/configs/escuela-recuerdo.json
- Incluye:
	- modo: ficha
	- mapeoColumnas específico de prácticas
	- valoresFijos para rellenado del documento

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
	- PDF único con 1 elemento
	- PDF único con 10 elementos
	- ZIP individual con 10 elementos
	- Error esperado al subir Excel con cabeceras inválidas
	- Verificación en desktop y móvil
