# Manual de Usuario - Generador de Fichas de Prácticas

Este manual detalla el funcionamiento, configuración y uso del Generador de Fichas de Prácticas, diseñado para automatizar la creación de documentos PDF a partir de datos en Excel.

---

## 1. Introducción

La aplicación permite transformar listas de alumnos en formato Excel en fichas individuales de prácticas personalizadas con la identidad visual de cada escuela (logo, firma, sello y colores).

### Flujo de Trabajo Principal:
1. **Configurar Escuela**: Seleccionar la escuela o cargar su configuración JSON.
2. **Cargar Datos**: Subir el archivo Excel con la información de los alumnos.
3. **Seleccionar/Editar**: Elegir los alumnos y corregir datos si es necesario.
4. **Generar**: Descargar el PDF final o un ZIP con archivos individuales.

---

## 2. Configuración de Escuelas

La configuración define la identidad visual y cómo se leen los datos del Excel.

### Parámetros de Configuración:
- **Identidad Visual**:
    - **Logo**: Imagen de cabecera (se recomienda PNG transparente).
    - **Firma**: Imagen de la firma del director/coordinador.
    - **Sello**: Imagen del sello de la escuela.
    - **Colores**: Colores primario y secundario para títulos y degradados.
- **Valores Fijos**: Datos que no cambian entre alumnos (Nombre del curso, Dirección de la escuela, Nombre del Director, Ciudad, etc.).
- **Mapeo de Columnas**: Relación entre el nombre de la columna en el Excel y el campo en la ficha.

### Gestión desde la UI:
- **Cargar/Descargar JSON**: Puedes exportar tu configuración actual para usarla en otro momento o importar configuraciones nuevas.
- **Restablecer (🔄)**: Si realizas cambios accidentales, usa el botón de reset para volver a los valores originales del archivo.

---

## 3. Formato del Archivo Excel (Entrada)

Para que la aplicación funcione correctamente, el archivo Excel debe cumplir los siguientes requisitos:

### Estructura:
- **Fila de Cabecera**: Los nombres de las columnas deben estar en la **Fila 4** del Excel.
- **Hojas**: Se leen todas las hojas del archivo y se combinan automáticamente.
- **Columnas Obligatorias (Mapeo)**:
    - `PRIMER APELLIDO`, `SEGUNDO APELLIDO`, `NOMBRE`.
    - `D.N.I.`, `CORREO ELECTRÓNICO`, `TELÉFONO`.
    - `CÓDIGO CURSO`, `FECHAS`.
    - `LUGAR DE PRÁCTICAS`, `FECHA INICIO`, `FECHA FINAL`.
    - `ENTIDAD DE PRÁCTICAS`, `TÍTULO MEMORIA`.

> [!TIP]
> Si el Excel tiene nombres de columna diferentes, puedes editarlos en el archivo JSON de configuración bajo el campo `mapeoColumnas`.

---

## 4. Guía de Uso Paso a Paso

### Paso 1: Configuración
Selecciona tu escuela en el panel superior. Asegúrate de que la firma y el sello se visualizan correctamente. Si necesitas cambiar el nombre del director o la ciudad de firma, hazlo en el apartado de "Valores Fijos".

### Paso 2: Carga de Datos
Arrastra tu archivo `.xlsx` al área sombreada. La aplicación listará a todos los alumnos detectados.

### Paso 3: Selección y Edición
- Haz clic en el nombre de un alumno para previsualizar su ficha.
- Usa el panel **"Editar Datos de [Nombre]"** para corregir cualquier información que falte o sea incorrecta en el Excel original. Estos cambios solo afectan a la generación actual.
- Marca los alumnos que deseas incluir en la generación final.

### Paso 4: Generación de Documentos
Haz clic en el botón **"Generar"**:
- **PDF Único**: Un solo archivo con todas las fichas (ideal para imprimir todo de una vez).
- **ZIP Individuales**: Un archivo comprimido con un PDF independiente para cada alumno (ideal para enviar por email).

---

## 5. Solución de Problemas Comunes

- **La firma/sello no aparece**: Asegúrate de que las imágenes están en la carpeta `public/logos/` o usa el botón de **Cargar JPG/PNG** para subirlas manualmente desde la interfaz.
- **No se lee el Excel**: Verifica que las cabeceras estén en la fila 4. Si están en otra fila, el administrador debe ajustar el parámetro `headerRowIndex` en el código.
- **Error de Columnas**: Si falta una columna esencial, la app mostrará un aviso indicando cuál no se ha encontrado. Revisa que el nombre coincida exactamente con el configurado en el JSON.
