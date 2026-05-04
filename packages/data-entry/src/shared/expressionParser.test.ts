import {
  extractPastedLineTokens,
  extractSymbols,
  parseExpressionLine,
} from './expressionParser';

describe('parseExpressionLine', () => {
  it('splits symbol and expression on =', () => {
    const result = parseExpressionLine(
      'Mleach,PRP = (AUPRP + AFPRP) * FracLEACH',
    );
    expect(result.symbol).toBe('Mleach,PRP');
    expect(result.expression).toBe('(AUPRP + AFPRP) * FracLEACH');
  });

  it('trims spaces around =', () => {
    const result = parseExpressionLine('  A  =  B + C  ');
    expect(result.symbol).toBe('A');
    expect(result.expression).toBe('B + C');
  });

  it('returns full line as expression when no =', () => {
    const result = parseExpressionLine('A + B');
    expect(result.symbol).toBe('');
    expect(result.expression).toBe('A + B');
  });

  it('splits on spaced = when LHS contains =', () => {
    const result = parseExpressionLine('AUmmsm=1-13 = (AUPRP + AFPRP)');
    expect(result.symbol).toBe('AUmmsm=1-13');
    expect(result.expression).toBe('(AUPRP + AFPRP)');
  });

  it('splits on last = when multiple unspaced and no spaced assignment', () => {
    const result = parseExpressionLine('AUmmsm=1-13=(AUPRP+AFPRP)');
    expect(result.symbol).toBe('AUmmsm=1-13');
    expect(result.expression).toBe('(AUPRP+AFPRP)');
  });
});

describe('extractPastedLineTokens', () => {
  it('includes LHS so it can match existing records when LHS contains =', () => {
    const tokens = extractPastedLineTokens('AUmmsm=1-13 = A + B');
    expect(tokens[0]).toBe('AUmmsm=1-13');
    expect(tokens).toContain('A');
    expect(tokens).toContain('B');
  });
});

describe('extractSymbols', () => {
  it('extracts symbols from expression', () => {
    const symbols = extractSymbols(
      '(AUPRP + AFPRP) * FracWET,soil * FracLEACH',
    );
    expect(symbols).toContain('AUPRP');
    expect(symbols).toContain('AFPRP');
    expect(symbols).toContain('FracWET,soil');
    expect(symbols).toContain('FracLEACH');
    expect(symbols).toHaveLength(4);
  });

  it('merges token ending with comma and next token (e.g. FracWET, soil → one symbol)', () => {
    const symbols = extractSymbols(
      '(AUPRP + AFPRP) * FracWET, soil * FracLEACH',
    );
    expect(symbols).toContain('FracWET,soil');
    expect(symbols).not.toContain('FracWET,');
    expect(symbols).not.toContain('soil');
    expect(symbols).toHaveLength(4);
  });

  it('drops numeric tokens', () => {
    const symbols = extractSymbols('A + 1.5 + B');
    expect(symbols).toEqual(['A', 'B']);
  });

  it('deduplicates symbols', () => {
    const symbols = extractSymbols('A + A + B');
    expect(symbols).toEqual(['A', 'B']);
  });

  it('allows - and = inside symbols (e.g. AUmmsm=1-13)', () => {
    const symbols = extractSymbols('(AUPRP + AFPRP) * AUmmsm=1-13');
    expect(symbols).toContain('AUmmsm=1-13');
    expect(symbols).toContain('AUPRP');
    expect(symbols).toContain('AFPRP');
    expect(symbols).toHaveLength(3);
  });

  it('strips curly and square brackets from token edges', () => {
    expect(extractSymbols('{Foo} + [Bar] * (Baz)')).toEqual([
      'Foo',
      'Bar',
      'Baz',
    ]);
  });
});
