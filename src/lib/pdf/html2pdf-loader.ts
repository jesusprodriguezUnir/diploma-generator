type Html2PdfModule = typeof import('html2pdf.js');

let cached: Html2PdfModule['default'] | null = null;

export async function loadHtml2pdf(): Promise<Html2PdfModule['default']> {
  if (!cached) {
    cached = (await import('html2pdf.js')).default;
  }
  return cached;
}
