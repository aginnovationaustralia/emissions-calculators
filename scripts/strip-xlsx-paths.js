#!/usr/bin/env node
/**
 * Removes local file system paths that Excel stores inside .xlsx files, so they don't
 * end up in the public repo:
 *   - xl/workbook.xml <x15ac:absPath> (Mac Excel records where the file was saved)
 *   - absolute paths to linked workbooks (Excel adds one each time a linked workbook
 *     is saved, alongside the relative path that is actually needed)
 *
 * Usage:
 *   node scripts/strip-xlsx-paths.js [files...]   strip paths in place (default: all tracked .xlsx)
 *   node scripts/strip-xlsx-paths.js --check      fail if any tracked .xlsx contains a local path
 *   node scripts/strip-xlsx-paths.js --staged     strip paths from staged .xlsx (pre-commit hook)
 */

const fs = require('fs');
const zlib = require('zlib');
const { execFileSync } = require('child_process');

const LOCAL_PATH =
  /="(\/Users\/|\/home\/|\/private\/|\/Volumes\/|\/tmp\/|[A-Za-z]:[\\/]|file:|\\\\)[^"]*"/g;
const isAbsoluteTarget = (target) => /^(\/|[A-Za-z]:|file:|\\\\)/.test(target);

// --- minimal zip reading/writing (no zip64, which Excel doesn't produce for these sizes)

const readZip = (buffer) => {
  let eocd = buffer.length - 22;
  while (eocd >= 0 && buffer.readUInt32LE(eocd) !== 0x06054b50) eocd -= 1;
  if (eocd < 0) throw new Error('not a zip file');

  const count = buffer.readUInt16LE(eocd + 10);
  let offset = buffer.readUInt32LE(eocd + 16);
  const entries = [];
  for (let i = 0; i < count; i += 1) {
    const nameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const localOffset = buffer.readUInt32LE(offset + 42);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const localNameLength = buffer.readUInt16LE(localOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localOffset + 28);
    const dataStart = localOffset + 30 + localNameLength + localExtraLength;

    entries.push({
      name: buffer.toString('utf8', offset + 46, offset + 46 + nameLength),
      central: buffer.subarray(
        offset,
        offset + 46 + nameLength + extraLength + commentLength,
      ),
      local: buffer.subarray(localOffset, dataStart),
      data: buffer.subarray(dataStart, dataStart + compressedSize),
      method: buffer.readUInt16LE(offset + 10),
    });
    offset += 46 + nameLength + extraLength + commentLength;
  }
  return entries;
};

const readEntry = (entry) =>
  (entry.method === 0 ? entry.data : zlib.inflateRawSync(entry.data)).toString(
    'utf8',
  );

const replaceEntry = (entry, text) => {
  const content = Buffer.from(text, 'utf8');
  return {
    ...entry,
    method: 8,
    data: zlib.deflateRawSync(content),
    crc: zlib.crc32(content),
    size: content.length,
  };
};

const writeZip = (entries) => {
  const parts = [];
  const centrals = [];
  let offset = 0;
  for (const entry of entries) {
    const local = Buffer.from(entry.local);
    const central = Buffer.from(entry.central);
    if (entry.crc !== undefined) {
      for (const [header, at] of [
        [local, 0],
        [central, 2],
      ]) {
        // clear the data descriptor flag, as sizes are now written in the headers
        header.writeUInt16LE(header.readUInt16LE(at + 6) & ~0x8, at + 6);
        header.writeUInt16LE(entry.method, at + 8);
        header.writeUInt32LE(entry.crc, at + 14);
        header.writeUInt32LE(entry.data.length, at + 18);
        header.writeUInt32LE(entry.size, at + 22);
      }
    }
    central.writeUInt32LE(offset, 42);
    parts.push(local, entry.data);
    centrals.push(central);
    offset += local.length + entry.data.length;
  }
  const centralDirectory = Buffer.concat(centrals);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(centralDirectory.length, 12);
  eocd.writeUInt32LE(offset, 16);
  return Buffer.concat([...parts, centralDirectory, eocd]);
};

// --- path stripping

const stripWorkbook = (xml) =>
  xml.replace(
    /<mc:AlternateContent[^>]*>\s*<mc:Choice Requires="x15">\s*<x15ac:absPath[^>]*\/>\s*<\/mc:Choice>\s*<\/mc:AlternateContent>/g,
    '',
  );

const stripExternalLink = (linkXml, relsXml) => {
  const targets = Object.fromEntries(
    [
      ...relsXml.matchAll(
        /<Relationship [^>]*?Id="([^"]+)"[^>]*?Target="([^"]*)"[^>]*\/>/g,
      ),
    ].map(([, id, target]) => [id, target]),
  );
  const primaryId = linkXml.match(/<externalBook [^>]*r:id="([^"]+)"/)?.[1];
  const relativeId = linkXml.match(/<xxl21:relativeUrl r:id="([^"]+)"\/>/)?.[1];

  let rels = relsXml;
  // Excel sometimes makes the absolute path the primary target, with the relative path as an alternate
  if (primaryId && isAbsoluteTarget(targets[primaryId] ?? '') && relativeId) {
    rels = rels.replace(
      new RegExp(`(<Relationship [^>]*?Id="${primaryId}"[^>]*?Target=")[^"]*"`),
      `$1${targets[relativeId]}"`,
    );
    targets[primaryId] = targets[relativeId];
  }

  let link = linkXml;
  for (const [id, target] of Object.entries(targets)) {
    if (id === primaryId || !isAbsoluteTarget(target)) continue;
    rels = rels.replace(
      new RegExp(`<Relationship [^>]*?Id="${id}"[^>]*\\/>`),
      '',
    );
    link = link.replace(new RegExp(`<xxl21:\\w+ r:id="${id}"\\/>`), '');
  }
  link = link.replace(
    /<xxl21:alternateUrls><\/xxl21:alternateUrls>|<xxl21:alternateUrls\/>/,
    '',
  );
  return { link, rels };
};

const strip = (buffer) => {
  const entries = readZip(buffer);
  const byName = new Map(entries.map((entry, i) => [entry.name, i]));
  const updates = new Map();

  const workbookIndex = byName.get('xl/workbook.xml');
  if (workbookIndex !== undefined) {
    updates.set(
      workbookIndex,
      stripWorkbook(readEntry(entries[workbookIndex])),
    );
  }
  for (const [name, index] of byName) {
    const match = name.match(/^xl\/externalLinks\/(externalLink\d+\.xml)$/);
    const relsIndex =
      match && byName.get(`xl/externalLinks/_rels/${match[1]}.rels`);
    if (relsIndex === undefined || relsIndex === null) continue;
    const { link, rels } = stripExternalLink(
      readEntry(entries[index]),
      readEntry(entries[relsIndex]),
    );
    updates.set(index, link);
    updates.set(relsIndex, rels);
  }

  let changed = false;
  const result = entries.map((entry, i) => {
    if (!updates.has(i) || updates.get(i) === readEntry(entry)) return entry;
    changed = true;
    return replaceEntry(entry, updates.get(i));
  });
  return changed ? writeZip(result) : buffer;
};

const findLocalPaths = (buffer) =>
  readZip(buffer)
    .filter((entry) => /\.(xml|rels)$/.test(entry.name))
    .flatMap((entry) =>
      [...readEntry(entry).matchAll(LOCAL_PATH)].map(
        ([found]) => `${entry.name}: ${found}`,
      ),
    );

// --- commands

const git = (...args) =>
  execFileSync('git', args, { encoding: 'buffer', maxBuffer: 1 << 30 });
const gitLines = (...args) =>
  git(...args)
    .toString('utf8')
    .split('\0')
    .filter(Boolean);

// tracked files deleted in the working tree have nothing left to strip or check
const trackedSpreadsheets = () =>
  gitLines('ls-files', '-z', '--', '*.xlsx').filter((file) =>
    fs.existsSync(file),
  );

const args = process.argv.slice(2);

if (args[0] === '--check') {
  const failures = trackedSpreadsheets().flatMap((file) =>
    findLocalPaths(fs.readFileSync(file)).map(
      (found) => `${file}\n    ${found}`,
    ),
  );
  if (failures.length > 0) {
    console.error(
      `Local file paths found in spreadsheets:\n  ${failures.join('\n  ')}`,
    );
    console.error('\nRun `node scripts/strip-xlsx-paths.js` to remove them.');
    process.exit(1);
  }
} else if (args[0] === '--staged') {
  const staged = gitLines(
    'diff',
    '--cached',
    '--name-only',
    '--diff-filter=ACMR',
    '-z',
    '--',
    '*.xlsx',
  );
  for (const file of staged) {
    // fix the staged copy directly, so unstaged changes to the same file are never staged
    const blob = git('show', `:${file}`);
    const stripped = strip(blob);
    if (stripped !== blob) {
      const sha = execFileSync('git', ['hash-object', '-w', '--stdin'], {
        input: stripped,
      })
        .toString()
        .trim();
      const mode = git('ls-files', '-s', '--', file).toString().split(' ')[0];
      git('update-index', '--cacheinfo', `${mode},${sha},${file}`);
      console.log(`Stripped local paths from ${file}`);
    }
    if (fs.existsSync(file)) {
      const current = fs.readFileSync(file);
      const strippedCurrent = strip(current);
      if (strippedCurrent !== current) fs.writeFileSync(file, strippedCurrent);
    }
  }
  const remaining = staged.flatMap((file) =>
    findLocalPaths(git('show', `:${file}`)).map(
      (found) => `${file}\n    ${found}`,
    ),
  );
  if (remaining.length > 0) {
    console.error(
      `Local file paths could not be removed automatically:\n  ${remaining.join('\n  ')}`,
    );
    process.exit(1);
  }
} else {
  const files = args.length > 0 ? args : trackedSpreadsheets();
  for (const file of files) {
    const current = fs.readFileSync(file);
    const stripped = strip(current);
    if (stripped !== current) {
      fs.writeFileSync(file, stripped);
      console.log(`Stripped local paths from ${file}`);
    }
  }
}
