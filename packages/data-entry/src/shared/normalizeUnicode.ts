/**
 * Converts Unicode mathematical symbols (e.g. from PDF paste) to plain ASCII.
 * Handles: Mathematical Italic/Bold alphanumerics, × − – — ∑ ℎ etc.
 */

const mathToAscii = new Map<string, string>();

// Mathematical Italic: A-Z (1D434-1D44D), a-z (1D44E-1D467)
for (let i = 0; i < 26; i++) {
  mathToAscii.set(String.fromCodePoint(0x1d434 + i), String.fromCharCode(65 + i));
  mathToAscii.set(String.fromCodePoint(0x1d44e + i), String.fromCharCode(97 + i));
}

// Mathematical Bold: A-Z (1D400-1D419), a-z (1D41A-1D433)
for (let i = 0; i < 26; i++) {
  mathToAscii.set(String.fromCodePoint(0x1d400 + i), String.fromCharCode(65 + i));
  mathToAscii.set(String.fromCodePoint(0x1d41a + i), String.fromCharCode(97 + i));
}

// Mathematical Bold Italic: A-Z (1D468-1D481), a-z (1D482-1D49B)
for (let i = 0; i < 26; i++) {
  mathToAscii.set(String.fromCodePoint(0x1d468 + i), String.fromCharCode(65 + i));
  mathToAscii.set(String.fromCodePoint(0x1d482 + i), String.fromCharCode(97 + i));
}

// Mathematical Script: A-Z (1D49C-1D4B5), a-z (1D4B6-1D4CF)
for (let i = 0; i < 26; i++) {
  mathToAscii.set(String.fromCodePoint(0x1d49c + i), String.fromCharCode(65 + i));
  mathToAscii.set(String.fromCodePoint(0x1d4b6 + i), String.fromCharCode(97 + i));
}

const symbolMap = new Map<string, string>([
  ['×', '*'],   // U+00D7 multiplication sign
  ['−', '-'],   // U+2212 minus sign
  ['–', '-'],   // U+2013 en dash
  ['—', '--'],  // U+2014 em dash
  ['∑', 'SUM'], // U+2211 summation
  ['ℎ', 'h'],   // U+210E Planck constant (italic h)
]);

/**
 * Normalize Unicode mathematical/smart characters to ASCII.
 * Also restores exponent syntax: 10-3 -> 10^-3 (common from PDFs).
 */
export function normalize(text: string): string {
  let result = [...text]
    .map((char) => {
      if (mathToAscii.has(char)) return mathToAscii.get(char)!;
      if (symbolMap.has(char)) return symbolMap.get(char)!;
      return char;
    })
    .join('');

  result = result.replace(/\b10-(\d+)\b/g, '10^-$1');
  return result;
}
