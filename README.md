# Generador de Diplomas Multiescuela

Aplicacion web para generar diplomas personalizados desde un archivo Excel.
Construida con Next.js 16, React 19, TypeScript y Tailwind CSS v4.

## Requisitos

- Node.js 20+
- npm 10+

## Desarrollo local

```bash
npm install
npm run dev
```

Abre http://localhost:3000.

## Comandos utiles

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Flujo funcional

1. Selecciona una escuela.
2. Sube un archivo Excel (.xlsx) o usa modo demo.
3. El sistema valida encabezados segun la configuracion de escuela.
4. Genera salida en PDF unico o ZIP con PDFs individuales.

## Limites operativos recomendados

- Recomendado: hasta 10 diplomas por lote para mantener fluidez.
- Maximo admitido en la UI: 25 diplomas por lote.
- Para volumen mayor: divide en bloques.

## Configuracion de escuelas

- Archivos: src/configs/*.json
- Logos: public/logos/*.svg
- El campo logo debe apuntar a ruta publica valida (ejemplo: /logos/escuela-central.svg).

## Variables de entorno

Crear archivo .env.local:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

En Vercel, define NEXT_PUBLIC_APP_URL con la URL de produccion
(por ejemplo https://diplomas.tudominio.com).

## Despliegue en Vercel

1. Sube el repositorio a GitHub.
2. En Vercel, importa el proyecto y selecciona la carpeta raiz diploma-generator.
3. Configura:
	- Build Command: npm run build
	- Install Command: npm install
	- Output: .next (automatico en Next.js)
4. Define variable de entorno:
	- NEXT_PUBLIC_APP_URL=https://tu-dominio-o-url-vercel
5. Ejecuta deploy de Preview y valida flujos.
6. Asigna dominio personalizado y publica a Production.

## Checklist de salida

- Lint sin errores: npm run lint
- Build exitoso: npm run build
- Pruebas funcionales:
  - PDF unico (1 diploma)
  - PDF unico (10 diplomas)
  - ZIP (10 diplomas)
  - Excel con columnas faltantes (error esperado)
- Verificacion en movil y desktop
- HTTPS activo en dominio final
