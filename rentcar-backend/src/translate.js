// Mətni avtomatik tərcümə edir (MyMemory pulsuz API: https://mymemory.translated.net/doc/spec.php)
// Xəta olarsa (internet, limit və s.) null qaytarır, sayt işləməyə davam edir.
const API_URL = process.env.TRANSLATE_API_URL || 'https://api.mymemory.translated.net/get';
const MAX_BYTES = 450; // MyMemory bir sorğuda ən çox 500 bayt qəbul edir
const TIMEOUT_MS = 8000;

// Mətni cümlələrə, lazım olsa sözlərə bölərək MAX_BYTES-dan böyük olmayan hissələr düzəldir
function splitText(text) {
  const bytes = (s) => Buffer.byteLength(s, 'utf8');
  const parts = [];
  let current = '';
  const push = (piece) => {
    if (current && bytes(`${current} ${piece}`) > MAX_BYTES) {
      parts.push(current);
      current = piece;
    } else {
      current = current ? `${current} ${piece}` : piece;
    }
  };
  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    if (bytes(sentence) <= MAX_BYTES) {
      push(sentence);
      continue;
    }
    for (const word of sentence.split(/\s+/)) push(word);
  }
  if (current) parts.push(current);
  return parts;
}

function decodeEntities(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

async function translateChunk(q, from, to) {
  const url = new URL(API_URL);
  url.searchParams.set('q', q);
  url.searchParams.set('langpair', `${from}|${to}`);
  if (process.env.TRANSLATE_EMAIL) url.searchParams.set('de', process.env.TRANSLATE_EMAIL);
  const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const out = data?.responseData?.translatedText;
  if (Number(data?.responseStatus) !== 200 || typeof out !== 'string' || !out.trim()) {
    throw new Error(`Tərcümə cavabı uğursuz: ${data?.responseStatus}`);
  }
  if (/MYMEMORY WARNING/i.test(out)) throw new Error('Günlük tərcümə limiti bitib');
  return decodeEntities(out).trim();
}

// from, to: 'az' və ya 'en'. Uğursuz olarsa null qaytarır.
async function translateText(text, from, to) {
  const clean = String(text || '').trim();
  if (!clean) return null;
  if (process.env.TRANSLATE_DISABLED === 'true') return null;
  try {
    const out = [];
    for (const part of splitText(clean)) out.push(await translateChunk(part, from, to));
    return out.join(' ');
  } catch (err) {
    console.warn('Avtomatik tərcümə alınmadı:', err.message);
    return null;
  }
}

module.exports = { translateText, splitText };
