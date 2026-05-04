type Html2PdfModule = typeof import('html2pdf.js');

let cached: Html2PdfModule | null = null;

export async function loadHtml2pdf(): Promise<Html2PdfModule> {
  if (!cached) {
    cached = (await import('html2pdf.js')).default as unknown as Html2PdfModule;
  }
  return cached;
}
