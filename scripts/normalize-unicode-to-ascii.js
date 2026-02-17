#!/usr/bin/env node
/**
 * Converts Unicode mathematical symbols (from PDF paste) back to plain ASCII.
 * Handles: Mathematical Italic/Bold alphanumerics, × − – — ∑ ℎ etc.
 *
 * Usage: node scripts/normalize-unicode-to-ascii.js <file>
 */

const fs = require('fs');
const path = require('path');

// Build mapping for Mathematical Alphanumeric Symbols (U+1D400 block)
const mathToAscii = new Map();

// Mathematical Italic: A-Z (1D434-1D44D), a-z (1D44E-1D467)
for (let i = 0; i < 26; i++) {
  mathToAscii.set(
    String.fromCodePoint(0x1d434 + i),
    String.fromCharCode(65 + i),
  );
  mathToAscii.set(
    String.fromCodePoint(0x1d44e + i),
    String.fromCharCode(97 + i),
  );
}

// Mathematical Bold: A-Z (1D400-1D419), a-z (1D41A-1D433)
for (let i = 0; i < 26; i++) {
  mathToAscii.set(
    String.fromCodePoint(0x1d400 + i),
    String.fromCharCode(65 + i),
  );
  mathToAscii.set(
    String.fromCodePoint(0x1d41a + i),
    String.fromCharCode(97 + i),
  );
}

// Mathematical Bold Italic: A-Z (1D468-1D481), a-z (1D482-1D49B)
for (let i = 0; i < 26; i++) {
  mathToAscii.set(
    String.fromCodePoint(0x1d468 + i),
    String.fromCharCode(65 + i),
  );
  mathToAscii.set(
    String.fromCodePoint(0x1d482 + i),
    String.fromCharCode(97 + i),
  );
}

// Mathematical Script: A-Z (1D49C-1D4B5), a-z (1D4B6-1D4CF)
for (let i = 0; i < 26; i++) {
  mathToAscii.set(
    String.fromCodePoint(0x1d49c + i),
    String.fromCharCode(65 + i),
  );
  mathToAscii.set(
    String.fromCodePoint(0x1d4b6 + i),
    String.fromCharCode(97 + i),
  );
}

// Other common symbols from PDF paste
const symbolMap = new Map([
  ['×', '*'], // U+00D7 multiplication sign
  ['−', '-'], // U+2212 minus sign
  ['–', '-'], // U+2013 en dash
  ['—', '--'], // U+2014 em dash
  ['∑', 'SUM'], // U+2211 summation
  ['ℎ', 'h'], // U+210E Planck constant (italic h)
]);

function normalize(text) {
  let result = [...text]
    .map((char) => {
      if (mathToAscii.has(char)) return mathToAscii.get(char);
      if (symbolMap.has(char)) return symbolMap.get(char);
      return char;
    })
    .join('');

  // Restore exponent syntax: 10-3 -> 10^-3 (common in scientific notation from PDFs)
  result = result.replace(/\b10-(\d+)\b/g, '10^-$1');

  return result;
}

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node scripts/normalize-unicode-to-ascii.js <file>');
  process.exit(1);
}

const resolved = path.resolve(filePath);
if (!fs.existsSync(resolved)) {
  console.error('File not found:', resolved);
  process.exit(1);
}

const content = fs.readFileSync(resolved, 'utf8');
const normalized = normalize(content);

if (content === normalized) {
  console.log('No changes needed.');
} else {
  fs.writeFileSync(resolved, normalized);
  console.log('Converted Unicode symbols to ASCII in:', resolved);
}
