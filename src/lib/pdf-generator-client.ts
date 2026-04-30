import type { GenerationProgress } from './types';

// Opciones compartidas de html2pdf.js con tipos literales
function getHtml2PdfOptions() {
  return {
    margin: 0,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      logging: false,
    },
    jsPDF: {
      unit: 'mm' as const,
      format: 'a4',
      orientation: 'landscape' as const,
    },
  };
}

/**
 * Genera un PDF a partir de un elemento HTML usando html2pdf.js.
 * Se ejecuta en el cliente (browser).
 */
export async function generateSinglePDF(element: HTMLElement): Promise<Blob> {
  const html2pdf = (await import('html2pdf.js')).default;

  const opt = { ...getHtml2PdfOptions(), filename: 'diploma.pdf' };

  const blob: Blob = await html2pdf()
    .set(opt)
    .from(element)
    .outputPdf('blob');

  return blob;
}

/**
 * Genera un solo PDF con todos los diplomas, un diploma por página.
 * Acepta un array de elementos HTML (uno por diploma).
 */
export async function generateAllPDFs(
  elements: HTMLElement[],
  onProgress?: (progress: GenerationProgress) => void
): Promise<Blob> {
  const html2pdf = (await import('html2pdf.js')).default;

  const total = elements.length;

  onProgress?.({
    status: 'processing',
    current: 0,
    total,
    message: 'Iniciando generación de diplomas...',
  });

  const opt = getHtml2PdfOptions();

  // Crear un contenedor temporal con todos los diplomas separados por saltos de página
  const container = document.createElement('div');

  elements.forEach((el, index) => {
    const wrapper = document.createElement('div');
    wrapper.style.pageBreakAfter = index < elements.length - 1 ? 'always' : 'auto';
    wrapper.style.pageBreakInside = 'avoid';
    wrapper.innerHTML = el.innerHTML;
    // Copy inline styles from original
    wrapper.className = el.className;
    container.appendChild(wrapper);

    onProgress?.({
      status: 'processing',
      current: index + 1,
      total,
      message: `Preparando diploma ${index + 1} de ${total}...`,
    });
  });

  onProgress?.({
    status: 'processing',
    current: total,
    total,
    message: 'Generando PDF final...',
  });

  const blob: Blob = await html2pdf()
    .set(opt)
    .from(container)
    .outputPdf('blob');

  onProgress?.({
    status: 'complete',
    current: total,
    total,
    message: '¡PDF generado con éxito!',
  });

  return blob;
}

/**
 * Genera un ZIP con un PDF individual por cada diploma.
 */
export async function generateZipPDFs(
  elements: HTMLElement[],
  studentNames: string[],
  onProgress?: (progress: GenerationProgress) => void
): Promise<Blob> {
  const html2pdf = (await import('html2pdf.js')).default;
  const JSZip = (await import('jszip')).default;

  const zip = new JSZip();
  const total = elements.length;

  const opt = getHtml2PdfOptions();

  for (let i = 0; i < elements.length; i++) {
    onProgress?.({
      status: 'processing',
      current: i + 1,
      total,
      message: `Generando diploma ${i + 1} de ${total}: ${studentNames[i]}...`,
    });

    const pdfBlob: Blob = await html2pdf()
      .set(opt)
      .from(elements[i])
      .outputPdf('blob');

    const safeName = (studentNames[i] || `diploma-${i + 1}`)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '_');

    zip.file(`${safeName}.pdf`, pdfBlob);
  }

  onProgress?.({
    status: 'processing',
    current: total,
    total,
    message: 'Comprimiendo archivos en ZIP...',
  });

  const zipBlob = await zip.generateAsync({ type: 'blob' });

  onProgress?.({
    status: 'complete',
    current: total,
    total,
    message: '¡ZIP con todos los diplomas generado con éxito!',
  });

  return zipBlob;
}

/**
 * Descarga un Blob como archivo.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
