'use client';

import './manual-page.css';
import Link from 'next/link';

export default function ManualPage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="manual-body">
      <nav className="no-print manual-nav">
        <Link href="/" className="back-link">← Volver al Generador</Link>
        <button onClick={handlePrint} className="nav-print-btn">🖨️ Imprimir Manual (PDF)</button>
      </nav>

      <div className="manual-container">
        <header className="manual-header">
          <h1>Manual de Usuario</h1>
          <p>Generador de Fichas de Prácticas Profesionales</p>
          <div className="version-tag">Versión 2.0 • 2026</div>
        </header>

        <section className="manual-section">
          <h2>1. Introducción</h2>
          <p>
            Esta herramienta ha sido diseñada para automatizar y estandarizar la generación de 
            <strong> Fichas Individuales de Prácticas</strong>. Permite a las escuelas de tiempo libre 
            procesar grandes volúmenes de datos de alumnos con un acabado profesional y coherente 
            con su identidad visual.
          </p>
          
          <div className="diagram-container">
            <svg width="600" height="120" viewBox="0 0 600 120">
              <rect x="10" y="30" width="120" height="60" rx="8" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2"/>
              <text x="70" y="65" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1e40af">CONFIGURAR</text>
              
              <line x1="130" y1="60" x2="160" y2="60" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)"/>
              
              <rect x="160" y="30" width="120" height="60" rx="8" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2"/>
              <text x="220" y="65" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#166534">CARGAR EXCEL</text>
              
              <line x1="280" y1="60" x2="310" y2="60" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)"/>
              
              <rect x="310" y="30" width="120" height="60" rx="8" fill="#fff7ed" stroke="#f97316" strokeWidth="2"/>
              <text x="370" y="65" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#9a3412">EDITAR/REVISAR</text>
              
              <line x1="430" y1="60" x2="460" y2="60" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)"/>
              
              <rect x="460" y="30" width="120" height="60" rx="8" fill="#faf5ff" stroke="#a855f7" strokeWidth="2"/>
              <text x="520" y="65" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#6b21a8">GENERAR PDF</text>
              
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                </marker>
              </defs>
            </svg>
          </div>
        </section>

        <section className="manual-section">
          <h2>2. Preparación del Archivo Excel</h2>
          <p>
            El sistema es flexible, pero requiere una estructura mínima para identificar los datos:
          </p>
          <ul className="manual-list">
            <li><strong>Fila de Cabecera:</strong> El sistema busca los nombres de las columnas en la <strong>Fila 4</strong>.</li>
            <li><strong>Formato:</strong> Archivos <code>.xlsx</code> o <code>.xls</code>.</li>
            <li><strong>Múltiples Hojas:</strong> Se procesarán todas las hojas del libro automáticamente.</li>
          </ul>
          <div className="tip-box">
            <strong>💡 Recomendación</strong>
            Si una columna no se detecta, verifica que el nombre en el Excel coincida exactamente con el configurado en el archivo JSON de la escuela.
          </div>
        </section>

        <section className="manual-section">
          <h2>3. Guía de Uso Paso a Paso</h2>
          
          <div className="step-card">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Selección de Escuela</h3>
              <p>Despliega el panel de configuración y elige tu escuela. Esto cargará los colores, logos y firmas predeterminadas.</p>
            </div>
          </div>

          <div className="step-card">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Carga de Alumnos</h3>
              <p>Arrastra el archivo Excel. Verás aparecer la lista de alumnos. Si hay algún error en las columnas, la app te avisará de inmediato.</p>
            </div>
          </div>

          <div className="step-card">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Revisión y Corrección</h3>
              <p>Haz clic en cualquier alumno para abrir el editor lateral. Puedes corregir DNI, fechas o lugares de prácticas antes de generar el PDF.</p>
            </div>
          </div>

          <div className="step-card">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Exportación</h3>
              <p>Selecciona los alumnos deseados y elige entre "Generar PDF Único" (todas las fichas en un archivo) o "Descargar ZIP" (un archivo por alumno).</p>
            </div>
          </div>
        </section>

        <section className="manual-section">
          <h2>4. Configuración Avanzada</h2>
          <p>
            Cada escuela puede personalizar su firma y sello. Si la firma es un archivo único que ya incluye el sello (como en Enforex), el sistema detectará la ausencia del segundo archivo y ajustará el diseño para que la firma centrada luzca perfecta.
          </p>
          <div className="diagram-container">
            <div className="config-grid">
              <div className="config-item">
                <span className="icon">📁</span>
                <strong>JSON</strong>
                <p>Estructura de datos</p>
              </div>
              <div className="config-item">
                <span className="icon">🎨</span>
                <strong>CSS</strong>
                <p>Colores corporativos</p>
              </div>
              <div className="config-item">
                <span className="icon">🖋️</span>
                <strong>Assets</strong>
                <p>Firmas y Logos</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="manual-footer">
          <p>© 2026 Generador de Fichas Profesionales. Todos los derechos reservados.</p>
        </footer>
      </div>

      <button onClick={handlePrint} className="print-button no-print">
        <span>🖨️</span> Generar PDF Perfecto
      </button>
    </div>
  );
}
