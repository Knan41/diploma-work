// Bazadan gələn maşın mətnlərini seçilmiş dilə uyğunlaşdırır

// Mühərrik adındakı Azərbaycan sözlərini ingilis dilində göstərir
export function localizeEngine(engine: string | null | undefined, lang: string | undefined): string {
  if (!engine) return '';
  if (lang !== 'en') return engine;
  return engine
    .replace(/^elektrik mühərrik$/i, 'Electric motor')
    .replace(/hibrid/gi, 'hybrid');
}

// Seçilmiş dil ingilis dilidirsə və ingilis təsvir varsa onu, əks halda əsas təsviri qaytarır
export function localizeDescription(
  car: { description?: string | null; descriptionEn?: string | null },
  lang: string | undefined
): string {
  if (lang === 'en' && car.descriptionEn) return car.descriptionEn;
  return car.description ?? '';
}
