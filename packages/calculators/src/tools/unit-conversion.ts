import Decimal from 'decimal.js-light';
import { Container } from './containers';
import { Mass, Substance } from './units';

export const tonnesToKg = (tonnes: number | Decimal) =>
  new Decimal(tonnes).mul(1000);

export const gramsToKg = (grams: number | Decimal) =>
  new Decimal(grams).div(1000);

export const kgToTonnes = (kg: number | Decimal) => new Decimal(kg).div(1000);

export const cubicMetresToLitres = (cubicMetres: number | Decimal) =>
  new Decimal(cubicMetres).mul(1000);

export const massInTonnes = (mass: Container<Mass<Substance>>) =>
  mass.unit.store.value.div(1000);

export const perTonneToPerKg = (perTonne: number | Decimal) =>
  new Decimal(perTonne).div(1000);

export const perCubicMetresToPerLitres = (perCubicMetres: number | Decimal) =>
  new Decimal(perCubicMetres).div(1000);

export const perGjToPerJ = (kgPerGj: number | Decimal) =>
  new Decimal(kgPerGj).div(1e6);

export const gjPerCubicMetreToJPerLitre = (gjPerCubicMetre: number | Decimal) =>
  new Decimal(gjPerCubicMetre).mul(1e3); // 10 ^ 6 / 10 ^ 3

export const gjPerTonneToJPerKg = (gjPerTonne: number | Decimal) =>
  new Decimal(gjPerTonne).mul(1e3); // * 10 ^ 6 / 10 ^ 3

export const gjPerKlToJPerLitre = (gjPerKl: number | Decimal) =>
  new Decimal(gjPerKl).mul(1e3); // 10 ^ 6 / 10 ^ 3

export const megaJoulesToJoules = (megaJoules: number | Decimal) =>
  new Decimal(megaJoules).mul(1e6);

export const hectaresToSquareMetres = (hectares: number | Decimal) =>
  new Decimal(hectares).mul(1e4);

export const squareMetresToHectares = (squareMetres: number | Decimal) =>
  new Decimal(squareMetres).div(1e4);

export const kilolitresToLitres = (kiloLitres: number | Decimal) =>
  new Decimal(kiloLitres).mul(1000);

export const tonnesPerHectareToKgPerSquareMetres = (
  tonnesPerHectare: number | Decimal,
) => new Decimal(tonnesPerHectare).div(10);

export const perHectareToPerSqMetre = (perHectare: number | Decimal) =>
  new Decimal(perHectare).div(1e4);

export const kilometresToMetres = (kilometres: number | Decimal) =>
  new Decimal(kilometres).mul(1000);

export const perKilometreToPerMetre = (perKilometre: number | Decimal) =>
  new Decimal(perKilometre).div(1000);

export const megawattHoursToKilowattHours = (megawattHours: number | Decimal) =>
  new Decimal(megawattHours).mul(1000);
