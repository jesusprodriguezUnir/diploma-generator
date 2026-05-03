# Diagramas de Proceso - Generador de Fichas

Estos diagramas representan visualmente el funcionamiento de la aplicación descrito en el manual de usuario.

---

## 1. Flujo de Trabajo del Usuario

Este diagrama describe los pasos que debe seguir un usuario desde que abre la aplicación hasta que obtiene los documentos.

```mermaid
graph TD
    Start((Inicio)) --> Config[1. Seleccionar Escuela / Cargar JSON]
    Config --> Excel[2. Arrastrar Excel de Alumnos]
    Excel --> Validation{¿Excel Válido?}
    
    Validation -- No --> Error[Corregir Excel o Mapeo]
    Error --> Excel
    
    Validation -- Sí --> List[Visualizar Lista de Alumnos]
    List --> Edit[3. Hacer clic para Editar / Previsualizar]
    Edit --> Select[4. Seleccionar Alumnos para Generar]
    
    Select --> Generate{¿Qué formato?}
    Generate -- "PDF Único" --> PDF[Descargar PDF con todas las fichas]
    Generate -- "ZIP Individual" --> ZIP[Descargar ZIP con un PDF por alumno]
    
    PDF --> End((Fin))
    ZIP --> End
```

---

## 2. Preparación y Mapeo de Datos

Cómo se transforman los datos desde el archivo físico hasta la plantilla final.

```mermaid
graph LR
    subgraph "Entrada (Excel)"
        E1[Fila 4: Cabeceras]
        E2[Hojas 1, 2, 3...]
    end
    
    subgraph "Procesamiento"
        P1[Limpieza de espacios]
        P2[Unión de Hojas]
        P3[Mapeo según JSON]
    end
    
    subgraph "Resultado"
        R1[Datos del Practicante]
        R2[Valores Fijos de Escuela]
    end
    
    E1 & E2 --> P1
    P1 --> P2 --> P3
    P3 --> R1
    R2 --- P3
```

---

## 3. Arquitectura de Configuración

Relación entre los archivos del sistema y la personalización del usuario.

```mermaid
graph TD
    subgraph "Archivos en Disco"
        J1[escuela-recuerdo.json]
        J2[escuela-enforex.json]
        I1[Logos / Firmas / Sellos]
    end
    
    subgraph "Memoria del Navegador"
        LS[(Local Storage)]
    end
    
    subgraph "Aplicación (UI)"
        CM[Config Manager]
        TP[Template Preview]
    end
    
    J1 & J2 --> CM
    I1 --> TP
    CM <--> LS
    LS --> TP
```
