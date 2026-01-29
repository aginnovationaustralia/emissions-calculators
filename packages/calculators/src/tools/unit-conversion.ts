import Decimal from 'decimal.js-light';

export const tonnesToKg = (tonnes: number | Decimal) =>
  new Decimal(tonnes).mul(1000);
