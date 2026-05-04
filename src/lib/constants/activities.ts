export const TIPO_ACTIVIDAD_OPTIONS = [
  'Campamento con pernocta',
  'Campamento urbano',
  'Intervención socioeducativa en entidades',
  'Otra',
] as const;

export type TipoActividad = (typeof TIPO_ACTIVIDAD_OPTIONS)[number];
