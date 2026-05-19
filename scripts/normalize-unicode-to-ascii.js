#!/usr/bin/env node
/**
 * Converts Unicode mathematical symbols (from PDF paste) back to plain ASCII.
 * Uses the shared normalize implementation from the data-entry package.
 *
 * Usage: node scripts/normalize-unicode-to-ascii.js <file>
 */

const fs = require('fs');
const path = require('path');

const { normalize } = require('data-entry/normalize');

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
