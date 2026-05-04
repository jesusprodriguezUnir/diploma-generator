import type { GenerationProgress } from '../types';
import { getPdfOptions } from './pdf-options';
import { loadHtml2pdf } from './html2pdf-loader';
import { sanitizeFileName } from './file-utils';

export { downloadBlob } from './file-utils';

type Orientation = 'portrait' | 'landscape';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function renderElementToBlob(html2pdf: any, element: HTMLElement, orientation: Orientation): Promise<Blob> {
  return html2pdf().set(getPdfOptions(orientation)).from(element).outputPdf('blob');
}

/**
 * Genera un PDF a partir de un elemento HTML usando html2pdf.js.
 * Se ejecuta en el cliente (browser).
 */
export async function generateSinglePDF(
  element: HTMLElement,
  orientation: Orientation = 'landscape'
): Promise<Blob> {
  const html2pdf = await loadHtml2pdf();
  return renderElementToBlob(html2pdf, element, orientation);
}

/**
 * Genera un solo PDF con todos los documentos, uno por página.
 */
export async function generateAllPDFs(
  elements: HTMLElement[],
  onProgress?: (progress: GenerationProgress) => void,
  orientation: Orientation = 'landscape'
): Promise<Blob> {
  const html2pdf = await loadHtml2pdf();
  const total = elements.length;

  onProgress?.({ status: 'processing', current: 0, total, message: 'Iniciando generación...' });

  const container = document.createElement('div');
  elements.forEach((el, index) => {
    const wrapper = el.cloneNode(true) as HTMLElement;
    wrapper.style.breakAfter = index < elements.length - 1 ? 'page' : 'auto';
    wrapper.style.breakInside = 'avoid';
    container.appendChild(wrapper);
    onProgress?.({ status: 'processing', current: index + 1, total, message: `Preparando documento ${index + 1} de ${total}...` });
  });

  onProgress?.({ status: 'processing', current: total, total, message: 'Generando PDF final...' });

  const blob: Blob = await html2pdf().set(getPdfOptions(orientation)).from(container).outputPdf('blob');

  onProgress?.({ status: 'complete', current: total, total, message: '¡PDF generado con éxito!' });

  return blob;
}

/**
 * Genera un ZIP con un PDF individual por cada documento.
 */
export async function generateZipPDFs(
  elements: HTMLElement[],
  studentNames: string[],
  onProgress?: (progress: GenerationProgress) => void,
  orientation: Orientation = 'landscape'
): Promise<Blob> {
  const [html2pdf, JSZip] = await Promise.all([
    loadHtml2pdf(),
    import('jszip').then((m) => m.default),
  ]);

  const zip = new JSZip();
  const total = elements.length;

  for (let i = 0; i < elements.length; i++) {
    onProgress?.({ status: 'processing', current: i + 1, total, message: `Generando documento ${i + 1} de ${total}: ${studentNames[i]}...` });

    const pdfBlob = await renderElementToBlob(html2pdf, elements[i], orientation);
    zip.file(`${sanitizeFileName(studentNames[i] || `documento-${i + 1}`)}.pdf`, pdfBlob);
  }

  onProgress?.({ status: 'processing', current: total, total, message: 'Comprimiendo archivos en ZIP...' });
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  onProgress?.({ status: 'complete', current: total, total, message: '¡ZIP con todos los documentos generado con éxito!' });

  return zipBlob;
}
