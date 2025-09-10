export function sum_(...values: (number | undefined)[]) {
  return (
    values.reduce((result, value) => {
      return (result ?? 0) + (value ?? 0);
    }, 0) ?? 0
  );
}

export function divideOrZero(numerator: number, denominator: number) {
  return denominator === 0 ? 0 : numerator / denominator;
}
