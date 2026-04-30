import type { GenerationProgress } from './types';

// Opciones compartidas de html2pdf.js con tipos literales
function getHtml2PdfOptions(orientation: 'portrait' | 'landscape' = 'landscape') {
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
      orientation,
    },
    pagebreak: { mode: ['css', 'legacy'] as string[] },
  };
}

/**
 * Genera un PDF a partir de un elemento HTML usando html2pdf.js.
 * Se ejecuta en el cliente (browser).
 */
export async function generateSinglePDF(
  element: HTMLElement,
  orientation: 'portrait' | 'landscape' = 'landscape'
): Promise<Blob> {
  const html2pdf = (await import('html2pdf.js')).default;

  const opt = { ...getHtml2PdfOptions(orientation), filename: 'documento.pdf' };

  const blob: Blob = await html2pdf()
    .set(opt)
    .from(element)
    .outputPdf('blob');

  return blob;
}

/**
 * Genera un solo PDF con todos los documentos, uno por pagina.
 * Acepta un array de elementos HTML (uno por item).
 */
export async function generateAllPDFs(
  elements: HTMLElement[],
  onProgress?: (progress: GenerationProgress) => void,
  orientation: 'portrait' | 'landscape' = 'landscape'
): Promise<Blob> {
  const html2pdf = (await import('html2pdf.js')).default;

  const total = elements.length;

  onProgress?.({
    status: 'processing',
    current: 0,
    total,
    message: 'Iniciando generación...',
  });

  const opt = getHtml2PdfOptions(orientation);

  // Crear un contenedor temporal con todos los documentos separados por saltos de pagina
  const container = document.createElement('div');

  elements.forEach((el, index) => {
    const wrapper = document.createElement('div');
    wrapper.style.breakAfter = index < elements.length - 1 ? 'page' : 'auto';
    wrapper.style.breakInside = 'avoid';
    wrapper.innerHTML = el.innerHTML;
    // Copy inline styles from original
    wrapper.className = el.className;
    container.appendChild(wrapper);

    onProgress?.({
      status: 'processing',
      current: index + 1,
      total,
      message: `Preparando documento ${index + 1} de ${total}...`,
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
 * Genera un ZIP con un PDF individual por cada documento.
 */
export async function generateZipPDFs(
  elements: HTMLElement[],
  studentNames: string[],
  onProgress?: (progress: GenerationProgress) => void,
  orientation: 'portrait' | 'landscape' = 'landscape'
): Promise<Blob> {
  const html2pdf = (await import('html2pdf.js')).default;
  const JSZip = (await import('jszip')).default;

  const zip = new JSZip();
  const total = elements.length;

  const opt = getHtml2PdfOptions(orientation);

  for (let i = 0; i < elements.length; i++) {
    onProgress?.({
      status: 'processing',
      current: i + 1,
      total,
      message: `Generando documento ${i + 1} de ${total}: ${studentNames[i]}...`,
    });

    const pdfBlob: Blob = await html2pdf()
      .set(opt)
      .from(elements[i])
      .outputPdf('blob');

    const safeName = (studentNames[i] || `documento-${i + 1}`)
      .normalize('NFD')
      .replaceAll(/[\u0300-\u036f]/g, '')
      .replaceAll(/[^a-zA-Z0-9\s-]/g, '')
      .replaceAll(/\s+/g, '_');

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
    message: '¡ZIP con todos los documentos generado con exito!',
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
  a.remove();
  URL.revokeObjectURL(url);
}
