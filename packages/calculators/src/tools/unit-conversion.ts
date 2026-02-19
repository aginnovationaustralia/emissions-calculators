import Decimal from 'decimal.js-light';
import { Container } from './containers';
import { Mass, Substance } from './units';

export const tonnesToKg = (tonnes: number | Decimal) =>
  new Decimal(tonnes).mul(1000);

export const cubicMetresToLitres = (cubicMetres: number | Decimal) =>
  new Decimal(cubicMetres).mul(1000);

export const massInTonnes = (mass: Container<Mass<Substance>>) =>
  mass.unit.value.div(1000);
