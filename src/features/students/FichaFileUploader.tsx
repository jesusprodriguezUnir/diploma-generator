'use client';

import { useState, type ReactNode } from 'react';
import type { ExcelRow } from '@/lib/types';

export default function FichaFileUploader({
  onFileLoaded,
  fileName,
}: Readonly<{
  onFileLoaded: (rows: ExcelRow[], file: File) => void;
  fileName: string;
}>) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = async (file: File) => {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setError('Solo se admiten archivos .xlsx o .xls');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const { parseExcelFileMultiSheet } = await import('@/lib/excel/parser');
      const rows = await parseExcelFileMultiSheet(file, { headerRowIndex: 3 });
      onFileLoaded(rows, file);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al leer el archivo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  let uploaderContent: ReactNode;
  if (isLoading) {
    uploaderContent = (
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        Leyendo Excel (todas las hojas)…
      </p>
    );
  } else if (fileName) {
    uploaderContent = (
      <div>
        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>📊 {fileName}</p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Haz clic para cambiar el archivo</p>
      </div>
    );
  } else {
    uploaderContent = (
      <div>
        <p className="text-2xl mb-2">📊</p>
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          Arrastra el Excel aquí o haz clic
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          Lee todas las hojas · Cabeceras en fila 4
        </p>
      </div>
    );
  }

  return (
    <div>
      <label
        className="block"
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        <div
          className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all"
          style={{
            borderColor: isDragOver ? 'var(--accent)' : 'var(--card-border)',
            background: isDragOver ? 'rgba(108,140,255,0.05)' : 'transparent',
          }}
        >
          {uploaderContent}
        </div>
        <input type="file" accept=".xlsx,.xls" className="hidden" onChange={handleChange} />
      </label>
      {error && (
        <p className="text-xs mt-2" style={{ color: 'var(--error)' }}>{error}</p>
      )}
    </div>
  );
}
