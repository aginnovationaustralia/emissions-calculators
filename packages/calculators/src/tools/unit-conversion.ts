import Decimal from 'decimal.js-light';

export const tonnesToKg = (tonnes: number | Decimal) =>
  new Decimal(tonnes).mul(1000);

export const cubicMetresToLitres = (cubicMetres: number | Decimal) =>
  new Decimal(cubicMetres).mul(1000);
