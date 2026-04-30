# Pasos pendientes — Despliegue en Vercel

Estado actual: código listo para producción. Lint y build pasan sin errores.

---

## Paso 1 — Subir repositorio a GitHub (si no está hecho)

```bash
git remote add origin https://github.com/TU_USUARIO/diploma-generator.git
git push -u origin master
```

---

## Paso 2 — Importar proyecto en Vercel

1. Entra en https://vercel.com y haz login.
2. Clic en **Add New → Project**.
3. Selecciona tu repositorio de GitHub.
4. En **Root Directory**, pon `diploma-generator` (la carpeta donde está el package.json).
5. Deja el resto de configuración por defecto (Next.js se detecta automáticamente).

---

## Paso 3 — Configurar variable de entorno

En la pantalla de configuración del proyecto en Vercel, antes de hacer Deploy:

| Nombre                  | Valor                             |
|-------------------------|-----------------------------------|
| `NEXT_PUBLIC_APP_URL`   | `https://TU-DOMINIO-O-URL-VERCEL` |

> Si aún no tienes dominio propio, usa la URL que Vercel asigna (formato: `https://diploma-generator-xxx.vercel.app`).
> Puedes actualizar la variable más adelante desde Settings → Environment Variables.

---

## Paso 4 — Deploy inicial (Preview)

1. Clic en **Deploy**.
2. Espera a que el build termine (~1-2 min).
3. Abre la **Preview URL** que genera Vercel.

Pruebas funcionales obligatorias antes de ir a producción:

- [ ] Modo demo → seleccionar escuela → verificar vista previa
- [ ] Generar PDF único con 1 diploma (modo demo)
- [ ] Generar PDF único con 10 diplomas (modo demo)
- [ ] Generar ZIP con 10 diplomas (modo demo)
- [ ] Subir Excel con columnas incorrectas → debe mostrar mensaje de error
- [ ] Repetir prueba de PDF desde móvil (Chrome Android o Safari iOS)

---

## Paso 5 — Dominio personalizado (opcional)

1. En Vercel → tu proyecto → **Settings → Domains**.
2. Añade tu dominio (ejemplo: `diplomas.tuescuela.com`).
3. Copia los registros DNS que Vercel te indica y añádelos en tu proveedor de dominio.
4. Espera propagación (puede tardar minutos u horas según el proveedor).
5. Vercel activa HTTPS automáticamente.
6. Actualiza la variable `NEXT_PUBLIC_APP_URL` con el dominio real y redeploy.

---

## Paso 6 — Publicar a Production

Una vez validadas todas las pruebas en Preview:

1. En Vercel → tu proyecto → **Deployments**.
2. Sobre el deploy de Preview → clic en los tres puntos → **Promote to Production**.
3. Verifica que la URL de producción funciona.

---

## Paso 7 — Smoke test post deploy

- [ ] Abrir URL de producción y verificar que carga sin errores
- [ ] Abrir `/robots.txt` → debe mostrar contenido válido
- [ ] Abrir `/sitemap.xml` → debe mostrar la URL del sitio
- [ ] Abrir `/manifest.webmanifest` → debe mostrar JSON válido
- [ ] Generar al menos un PDF para confirmar funcionamiento en producción

---

## Rollback de emergencia

Si algo falla en producción, desde Vercel → Deployments → selecciona el último deploy estable → **Promote to Production**.

---

## Cambios incluidos en este commit

- `next.config.ts` — headers de seguridad, caché de estáticos, strict mode
- `src/app/globals.css` — fuente unificada via next/font (eliminado import Google Fonts externo)
- `src/app/layout.tsx` — metadataBase con NEXT_PUBLIC_APP_URL
- `src/app/page.tsx` — corrección lint (efecto redundante eliminado)
- `src/app/robots.ts` — robots.txt generado dinámicamente
- `src/app/sitemap.ts` — sitemap.xml generado dinámicamente
- `src/app/manifest.ts` — manifest PWA
- `src/components/DiplomaTemplate.tsx` — logo real de escuela en lugar de emoji
- `src/components/GenerateButton.tsx` — límites operativos de lote (recomendado 10, máximo 25)
- `src/configs/escuela-central.json` — ruta de logo actualizada a SVG
- `src/configs/escuela-montessori.json` — ruta de logo actualizada a SVG
- `public/logos/escuela-central.svg` — logo institucional generado
- `public/logos/escuela-montessori.svg` — logo institucional generado
- `README.md` — documentación real de proyecto y despliegue
