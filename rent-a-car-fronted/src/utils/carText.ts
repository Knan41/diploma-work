export function localizeEngine(engine: string | null | undefined, lang: string | undefined): string {
  if (!engine) return '';
  if (lang !== 'en') return engine;

  if (engine === 'Elektrik mühərrik') return 'Electric motor';
  return engine.replace('hibrid', 'hybrid');
}

export function localizeDescription(
  car: { description?: string | null; descriptionEn?: string | null },
  lang: string | undefined
): string {
  if (lang === 'en') return car.descriptionEn || car.description || '';
  return car.description || car.descriptionEn || '';
}
