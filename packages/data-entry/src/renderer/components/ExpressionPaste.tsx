import { extractSymbols, parseExpressionLine } from '@/shared/expressionParser';
import { normalize } from '@/shared/normalizeUnicode';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../store/useStore';
import { buildHighlightSegments } from '../utils/expressionHighlight';

function getTokensFromText(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  const { symbol, expression } = parseExpressionLine(trimmed);
  const expr = symbol && expression ? expression : trimmed;
  return extractSymbols(expr);
}

function getMergeRange(
  text: string,
  records: { symbol: string }[],
): { start: number; end: number } | null {
  const eqIdx = text.indexOf('=');
  if (eqIdx < 0) return null;
  const beforeEq = text.slice(0, eqIdx);
  const lhsTrimmed = beforeEq.trim();
  if (!lhsTrimmed) return null;
  const lower = lhsTrimmed.toLowerCase();
  const hasMatch = records.some(
    (r) => r.symbol.toLowerCase() === lower,
  );
  if (!hasMatch) return null;
  const mergeStart = beforeEq.indexOf(lhsTrimmed);
  if (mergeStart < 0) return null;
  return { start: mergeStart, end: mergeStart + lhsTrimmed.length };
}

export function ExpressionPaste() {
  const [text, setText] = useState('');
  const [lineNumber, setLineNumber] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const addExpressionFromPaste = useStore((s) => s.addExpressionFromPaste);
  const records = useStore((s) => s.records);

  const tokens = useMemo(() => getTokensFromText(text), [text]);
  const existingSymbolsSet = useMemo(
    () => new Set(records.map((r) => r.symbol.toLowerCase())),
    [records],
  );
  const existingTokens = useMemo(
    () => tokens.filter((t) => existingSymbolsSet.has(t.toLowerCase())),
    [tokens, existingSymbolsSet],
  );
  const tokensToAdd = useMemo(
    () => tokens.filter((t) => !existingSymbolsSet.has(t.toLowerCase())),
    [tokens, existingSymbolsSet],
  );
  const mergeRange = useMemo(
    () => getMergeRange(text, records),
    [text, records],
  );
  const segments = useMemo(
    () => buildHighlightSegments(text, tokens, mergeRange),
    [text, tokens, mergeRange],
  );

  useEffect(() => {
    const ta = textareaRef.current;
    const hl = highlightRef.current;
    if (!ta || !hl) return;
    const syncScroll = () => {
      hl.scrollTop = ta.scrollTop;
      hl.scrollLeft = ta.scrollLeft;
    };
    ta.addEventListener('scroll', syncScroll);
    return () => ta.removeEventListener('scroll', syncScroll);
  }, []);

  function handleAdd() {
    const trimmed = text.trim();
    if (!trimmed) return;
    addExpressionFromPaste(trimmed, lineNumber);
    setText('');
    setLineNumber('');
  }

  return (
    <div className="expression-paste">
      <label htmlFor="expression-input">
        Paste expression (e.g. SYMBOL = EXPRESSION)
      </label>
      <div className="expression-paste-row">
        <div className="expression-paste-textarea-wrap">
          <div
            ref={highlightRef}
            className="expression-paste-highlight"
            aria-hidden
          >
            {segments.map((seg, i) =>
              seg.type === 'token' ? (
                <mark key={i} className="expression-paste-token">
                  {seg.value}
                </mark>
              ) : seg.type === 'merge' ? (
                <mark key={i} className="expression-paste-merge">
                  {seg.value}
                </mark>
              ) : (
                <span key={i}>{seg.value}</span>
              ),
            )}
          </div>
          <textarea
            ref={textareaRef}
            id="expression-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onPaste={(e) => {
              const pasted = e.clipboardData?.getData('text') ?? '';
              if (!pasted) return;
              e.preventDefault();
              const normalized = normalize(pasted);
              const ta = textareaRef.current;
              if (ta) {
                const start = ta.selectionStart;
                const end = ta.selectionEnd;
                const newValue =
                  text.slice(0, start) + normalized + text.slice(end);
                setText(newValue);
                const newCursor = start + normalized.length;
                setTimeout(() => {
                  ta.focus();
                  ta.setSelectionRange(newCursor, newCursor);
                }, 0);
              } else {
                setText((prev) => prev + normalized);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAdd();
              }
            }}
            placeholder="𝑀𝑙𝑒𝑎𝑐ℎ,𝑃𝑅𝑃 = (𝐴𝑈𝑃𝑅𝑃 + 𝐴𝐹𝑃𝑅𝑃) × 𝐹𝑟𝑎𝑐𝑊𝐸𝑇,𝑠𝑜𝑖𝑙 × 𝐹𝑟𝑎𝑐𝐿𝐸𝐴𝐶𝐻"
            rows={2}
            className="expression-paste-input"
          />
        </div>
        <div className="expression-paste-line-wrap">
          <label htmlFor="expression-line-input" className="expression-paste-line-label">
            Line
          </label>
          <input
            id="expression-line-input"
            type="text"
            value={lineNumber}
            onChange={(e) => setLineNumber(e.target.value)}
            placeholder="e.g. 42"
            className="expression-paste-line-input"
          />
        </div>
        <button type="button" onClick={handleAdd}>
          Add
        </button>
      </div>
      {tokens.length > 0 && (
        <div className="expression-paste-tokens-panel">
          <div className="expression-paste-tokens-row">
            <span className="expression-paste-tokens-label">
              Existing tokens:
            </span>
            <span className="expression-paste-tokens-list">
              {existingTokens.length > 0
                ? existingTokens.join(' | ')
                : '—'}
            </span>
          </div>
          <div className="expression-paste-tokens-row">
            <span className="expression-paste-tokens-label">
              Tokens to add:
            </span>
            <span className="expression-paste-tokens-list">
              {tokensToAdd.length > 0 ? tokensToAdd.join(' | ') : '—'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
