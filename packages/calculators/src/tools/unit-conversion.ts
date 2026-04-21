import Decimal from 'decimal.js-light';
import { Container } from './containers';
import { Mass, Substance } from './units';

export const tonnesToKg = (tonnes: number | Decimal) =>
  new Decimal(tonnes).mul(1000);

export const cubicMetresToLitres = (cubicMetres: number | Decimal) =>
  new Decimal(cubicMetres).mul(1000);

export const massInTonnes = (mass: Container<Mass<Substance>>) =>
  mass.unit.value.div(1000);

export const gjPerTonneTogjPerKg = (gjPerTonne: number | Decimal) =>
  new Decimal(gjPerTonne).div(1000);

export const kgPerCubicMetresToKgPerLitres = (
  kgPerCubicMetres: number | Decimal,
) => new Decimal(kgPerCubicMetres).div(1000);

export const kgPerGjToKgPerJ = (kgPerGj: number | Decimal) =>
  new Decimal(kgPerGj).mul(1e6);

export const gjPerCubicMetreToJPerLitre = (gjPerCubicMetre: number | Decimal) =>
  new Decimal(gjPerCubicMetre).mul(1e-9);

export const hectaresToSquareMetres = (hectares: number | Decimal) =>
  new Decimal(hectares).mul(1e4);

export const tonnesPerHectareToKgPerSquareMetres = (
  tonnesPerHectare: number | Decimal,
) => new Decimal(tonnesPerHectare).div(10);

export const perHectareToPerSqMetre = (perHectare: number | Decimal) =>
  new Decimal(perHectare).div(1e4);
