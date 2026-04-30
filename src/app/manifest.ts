import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Generador de Fichas de Practicas Multiescuela',
    short_name: 'Ficha Generator',
    description:
      'Genera fichas de practicas personalizadas automaticamente para multiples escuelas.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0B0F1A',
    theme_color: '#6C8CFF',
    lang: 'es',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
