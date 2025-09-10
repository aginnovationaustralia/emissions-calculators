export function addTotalValue<T extends Record<string, number>>(breakdown: T) {
  return {
    ...breakdown,
    total: Object.entries(breakdown)
      .filter((x) => !x[0].includes('total'))
      .map((x) => x[1])
      .reduce((a, b) => a + b, 0),
  };
}

export function addTotalValueWithEmissionElements<
  T extends Record<string, number>,
>(breakdown: T) {
  const entriesWithoutTotal = Object.entries(breakdown).filter(
    (x) => !x[0].includes('total'),
  );

  return {
    ...breakdown,
    total: entriesWithoutTotal.map((x) => x[1]).reduce((a, b) => a + b, 0),
    totalCO2: entriesWithoutTotal
      .filter((x) => x[0].endsWith('CO2'))
      .map((x) => x[1])
      .reduce((a, b) => a + b, 0),
    totalN2O: entriesWithoutTotal
      .filter((x) => x[0].endsWith('N2O'))
      .map((x) => x[1])
      .reduce((a, b) => a + b, 0),
    totalCH4: entriesWithoutTotal
      .filter((x) => x[0].endsWith('CH4'))
      .map((x) => x[1])
      .reduce((a, b) => a + b, 0),
  };
}

export function divideBySafeFromZero(numerator: number, denominator: number) {
  return denominator === 0 ? 0 : numerator / denominator;
}
