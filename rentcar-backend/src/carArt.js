// Real şəkil olmadıqda hər maşın üçün avtomatik maşın təsviri (SVG) yaradır
const COLORS = { hybrid: ['#22c55e', '#15803d'], electric: ['#3b82f6', '#1d4ed8'], sport: ['#ef4444', '#b91c1c'] };
const LABEL = { hybrid: 'HİBRİD', electric: 'ELEKTRİK', sport: 'SPORT' };

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

const SHAPES = {
  sedan: {
    body: 'M110 340 L110 300 Q110 280 135 274 L230 262 L300 205 Q310 198 325 198 L505 198 Q520 198 532 207 L600 262 L670 272 Q695 278 695 300 L695 340 Z',
    windows: ['M262 262 L318 214 Q324 210 332 210 L418 210 L418 262 Z', 'M434 210 L505 210 Q512 210 518 215 L568 262 L434 262 Z'],
    wheels: [240, 570], tail: [110, 298], head: [673, 292], extra: '',
  },
  suv: {
    body: 'M105 345 L105 285 Q105 262 130 258 L200 250 L235 185 Q242 175 256 175 L565 175 Q580 175 588 186 L625 250 L675 258 Q700 262 700 285 L700 345 Z',
    windows: ['M262 250 L282 192 L405 192 L405 250 Z', 'M421 192 L550 192 L582 250 L421 250 Z'],
    wheels: [235, 575], tail: [105, 280], head: [680, 280], extra: '',
  },
  coupe: {
    body: 'M95 345 L95 310 Q95 292 120 288 L250 276 L330 222 Q342 214 358 214 L470 214 Q488 214 500 224 L585 282 L685 290 Q710 294 710 315 L710 345 Z',
    windows: ['M290 276 L346 232 L452 232 L452 276 Z', 'M466 232 L490 232 L550 276 L466 276 Z'],
    wheels: [250, 585], tail: [95, 306], head: [690, 304],
    extra: '<rect x="112" y="276" width="62" height="8" rx="3" fill="#0f172a"/><rect x="128" y="282" width="5" height="12" fill="#0f172a"/><rect x="152" y="282" width="5" height="12" fill="#0f172a"/>',
  },
};

function carSvg({ brand, model, category, type }) {
  const [c1, c2] = COLORS[category] || COLORS.hybrid;
  const s = SHAPES[type] || SHAPES.sedan;
  const wheels = s.wheels
    .map((x) => `<circle cx="${x}" cy="345" r="58" fill="#0b1220"/><circle cx="${x}" cy="345" r="48" fill="#111827"/><circle cx="${x}" cy="345" r="28" fill="#9ca3af"/><circle cx="${x}" cy="345" r="10" fill="#374151"/>`)
    .join('');
  const windows = s.windows.map((w) => `<path d="${w}" fill="#bfdbfe" opacity="0.92"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f172a"/><stop offset="1" stop-color="#1e293b"/></linearGradient>
<linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>
</defs>
<rect width="800" height="500" fill="url(#bg)"/>
<rect y="400" width="800" height="100" fill="#0b1220"/>
<ellipse cx="400" cy="398" rx="330" ry="14" fill="#000" opacity="0.4"/>
<path d="${s.body}" fill="url(#g)"/>
${s.extra}${windows}
<rect x="${s.head[0]}" y="${s.head[1]}" width="24" height="12" rx="4" fill="#fde68a"/>
<rect x="${s.tail[0]}" y="${s.tail[1]}" width="20" height="12" rx="4" fill="#fca5a5"/>
${wheels}
<text x="40" y="72" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="700" fill="#ffffff">${esc(brand)} ${esc(model)}</text>
<text x="40" y="104" font-family="Arial, Helvetica, sans-serif" font-size="20" letter-spacing="4" fill="#94a3b8">${LABEL[category] || ''}</text>
</svg>`;
}

module.exports = { carSvg };
