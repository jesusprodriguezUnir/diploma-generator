export const PDF_IMAGE = { type: 'jpeg' as const, quality: 0.98 };
export const PDF_CANVAS = { scale: 2, useCORS: true, letterRendering: true, logging: false };

export function getPdfOptions(orientation: 'portrait' | 'landscape' = 'landscape') {
  return {
    margin: 0,
    image: PDF_IMAGE,
    html2canvas: PDF_CANVAS,
    jsPDF: { unit: 'mm' as const, format: 'a4', orientation },
    pagebreak: { mode: ['css', 'legacy'] as ('css' | 'legacy')[] },
  };
}
