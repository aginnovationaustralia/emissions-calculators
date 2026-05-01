/**
 * Parses a line of the form "SYMBOL = EXPRESSION" (optional spaces around =).
 * Returns { symbol, expression } or { symbol: '', expression: fullLine } if no =.
 *
 * Assignment is detected as:
 * 1. First ` = ` (whitespace around equals) so the LHS may contain `=` (e.g. AUmmsm=1-13 = …).
 * 2. Else if there are multiple `=` in the line, split on the last `=` (e.g. AUmmsm=1-13=x with no spaces).
 * 3. Else split on the first `=` (e.g. A=B).
 */
export function parseExpressionLine(line: string): {
  symbol: string;
  expression: string;
} {
  const trimmed = line.trim();
  if (!trimmed) {
    return { symbol: '', expression: '' };
  }

  const spacedAssignment = trimmed.match(/^(.+?)\s+=\s+([\s\S]+)$/);
  if (spacedAssignment) {
    return {
      symbol: spacedAssignment[1].trim(),
      expression: spacedAssignment[2].trim(),
    };
  }

  const eqCount = [...trimmed].filter((c) => c === '=').length;
  const eqIndex = eqCount > 1 ? trimmed.lastIndexOf('=') : trimmed.indexOf('=');
  if (eqIndex < 0) {
    return { symbol: '', expression: trimmed };
  }
  const symbol = trimmed.slice(0, eqIndex).trim();
  const expression = trimmed.slice(eqIndex + 1).trim();
  return { symbol, expression };
}

/** Characters that separate tokens when they appear at the start/end of a whitespace-separated part. */
const BOUNDARY_CHARS = /^[\s()[\]{}+\-**/]+|[\s()[\]{}+\-**/]+$/g;

/** Trailing exponent (e.g. ^2.5 or ^-1); strip so Wj^2.5 → Wj for symbol extraction. */
const TRAILING_EXPONENT = /\^[-]?\d*\.?\d+$/;

const IGNORED_SYMBOLS = ['SUM', '^', 'e'];

const ignoreSymbol = (symbol: string): boolean =>
  IGNORED_SYMBOLS.some((i) => symbol.includes(i));

/**
 * Extracts symbol tokens from an expression string.
 * Splits on whitespace only so symbols may contain - and = (e.g. AUmmsm=1-13).
 * Leading/trailing brackets (including {}, []) and operators are stripped from each part.
 * Supports commas in symbols (e.g. FracWET,soil); parts ending with comma are merged with the next.
 */
export function extractSymbols(expression: string): string[] {
  const rawParts = expression
    .split(/\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const parts: string[] = [];
  for (let i = 0; i < rawParts.length; i++) {
    const p = rawParts[i];
    if (p.endsWith(',') && i + 1 < rawParts.length) {
      parts.push(p + rawParts[i + 1]);
      i++;
    } else {
      parts.push(p);
    }
  }
  const seen = new Set<string>();
  const result: string[] = [];
  for (const p of parts) {
    const withoutExponent = p.replace(TRAILING_EXPONENT, '');
    const token = withoutExponent.replace(BOUNDARY_CHARS, '').trim();
    if (!token) continue;
    if (ignoreSymbol(token)) continue;
    if (isNumeric(token)) continue;
    if (seen.has(token)) continue;
    seen.add(token);
    result.push(token);
  }
  return result;
}

/**
 * Tokens used for paste preview / matching: LHS symbol (when present) plus symbols from the RHS.
 * LHS is included so it can match an existing row even when it contains `=`.
 */
export function extractPastedLineTokens(line: string): string[] {
  const trimmed = line.trim();
  if (!trimmed) return [];
  const { symbol, expression } = parseExpressionLine(trimmed);
  const rhs =
    symbol && expression ? extractSymbols(expression) : extractSymbols(trimmed);
  if (!symbol || !expression) {
    return rhs;
  }
  const seen = new Set<string>();
  const out: string[] = [];
  const add = (t: string) => {
    const k = t.toLowerCase();
    if (seen.has(k)) return;
    seen.add(k);
    out.push(t);
  };
  add(symbol);
  for (const t of rhs) add(t);
  return out;
}

function isNumeric(s: string): boolean {
  return /^\d*\.?\d+$/.test(s);
}
