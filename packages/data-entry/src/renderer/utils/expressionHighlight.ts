/**
 * Builds segments for highlighting tokens (and optional merge range) in text.
 * Used by ExpressionPaste and RecordsGrid expression cells.
 */
export function buildHighlightSegments(
  text: string,
  tokens: string[],
  mergeRange: { start: number; end: number } | null = null,
): Array<{ type: 'text' | 'token' | 'merge'; value: string }> {
  const segments: Array<{ type: 'text' | 'token' | 'merge'; value: string }> =
    [];
  const tokensSorted =
    tokens.length > 0 ? [...tokens].sort((a, b) => b.length - a.length) : [];
  let i = 0;
  while (i < text.length) {
    if (mergeRange && i >= mergeRange.start && i < mergeRange.end) {
      segments.push({
        type: 'merge',
        value: text.slice(mergeRange.start, mergeRange.end),
      });
      i = mergeRange.end;
      continue;
    }
    if (tokensSorted.length === 0) {
      segments.push({ type: 'text', value: text[i] });
      i++;
      continue;
    }
    let found = false;
    for (const token of tokensSorted) {
      if (text.slice(i, i + token.length) === token) {
        segments.push({ type: 'token', value: token });
        i += token.length;
        found = true;
        break;
      }
    }
    if (!found) {
      segments.push({ type: 'text', value: text[i] });
      i++;
    }
  }
  return segments.length > 0 ? segments : [{ type: 'text', value: text }];
}
