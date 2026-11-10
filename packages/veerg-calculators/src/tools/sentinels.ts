import { FuelEmissionsGasType } from '@/constants/types';
import Decimal from 'decimal.js-light';
import { Container, num, root, TypedContainer } from './containers';
import {
  area,
  days,
  energy,
  mass,
  Mass,
  massPerArea,
  massPerHeadPerDay,
  massPerMass,
  massPerYear,
  RealNumber,
  realNumber,
  Substance,
  years,
} from './units';

export const one = num(1).named('one');

export const zero = num(0).named('zero');
export const tenToPowMinus3 = root(realNumber(new Decimal(10).pow(-3)), {
  name: '10^-3',
});
export const tenToPowMinus4 = root(realNumber(new Decimal(10).pow(-4)), {
  name: '10^-4',
});

export const zeroN2O = root(mass('N2O', new Decimal(0)), {
  name: 'zeroN2O',
});

export const zeroCH4 = root(mass('CH4', new Decimal(0)), {
  name: 'zeroCH4',
});

export const zeroCO2 = root(mass('CO2', new Decimal(0)), {
  name: 'zeroCO2',
});

export const zeroCO2e = root(mass('CO2e', new Decimal(0)), {
  name: 'zeroCO2e',
});

export const zeroN = root(mass('N', new Decimal(0)), {
  name: 'zeroN',
});

// Zeros named after their unit and substance, e.g. `zeroMassFish`, for use as `sum` fallbacks
const nameOf = (substance: Substance) => substance.replace(/ /g, '');
const zeroMass = <S extends Substance>(substance: S) =>
  root(mass(substance, 0), { name: `zeroMass${nameOf(substance)}` });
const zeroMassPerMass = <SNum extends Substance, SDenom extends Substance>(
  snum: SNum,
  sdenom: SDenom,
) =>
  root(massPerMass(snum, sdenom, 0), {
    name: `zeroMassPerMass${nameOf(snum)}${nameOf(sdenom)}`,
  });
const zeroMassPerHeadPerDay = <S extends Substance>(substance: S) =>
  root(massPerHeadPerDay(substance, 0), {
    name: `zeroMassPerHeadPerDay${nameOf(substance)}`,
  });
const zeroMassPerArea = <S extends Substance>(substance: S) =>
  root(massPerArea(substance, 0), {
    name: `zeroMassPerArea${nameOf(substance)}`,
  });
const zeroMassPerYear = <S extends Substance>(substance: S) =>
  root(massPerYear(substance, 0), {
    name: `zeroMassPerYear${nameOf(substance)}`,
  });

export const zeroMassCarbon = zeroMass('Carbon');
export const zeroMassCleanWool = zeroMass('Clean Wool');
export const zeroMassDryMatter = zeroMass('DryMatter');
export const zeroMassEggs = zeroMass('Eggs');
export const zeroMassFish = zeroMass('Fish');
export const zeroMassLime = zeroMass('Lime');
export const zeroMassLiveweight = zeroMass('Liveweight');
export const zeroMassMilk = zeroMass('Milk');
export const zeroMassSolidWaste = zeroMass('Solid Waste');
export const zeroMassVolatilisedN = zeroMass('Volatilised N');

export const zeroMassPerMassNInorganicFertiliser = zeroMassPerMass(
  'N',
  'Inorganic Fertiliser',
);
export const zeroMassPerMassUreaInorganicFertiliser = zeroMassPerMass(
  'Urea',
  'Inorganic Fertiliser',
);

export const zeroMassPerHeadPerDayCH4 = zeroMassPerHeadPerDay('CH4');
export const zeroMassPerHeadPerDayDryMatter =
  zeroMassPerHeadPerDay('DryMatter');
export const zeroMassPerHeadPerDayMilk = zeroMassPerHeadPerDay('Milk');
export const zeroMassPerHeadPerDayN = zeroMassPerHeadPerDay('N');
export const zeroMassPerHeadPerDayVolatileSolids =
  zeroMassPerHeadPerDay('Volatile Solids');

export const zeroMassPerAreaOrganicAmendment =
  zeroMassPerArea('Organic Amendment');

export const zeroMassPerYearCO2 = zeroMassPerYear('CO2');

export const zeroEnergy = root(energy(0), { name: 'zeroEnergy' });
export const zeroArea = root(area(0), { name: 'zeroArea' });

export const oneMinus = (x: TypedContainer<RealNumber>) =>
  num(1).named('one').minus(x);
export const onePlus = (x: TypedContainer<RealNumber>) =>
  num(1).named('one').plus(x);
export const percentageToFraction = (x: TypedContainer<RealNumber>) =>
  x.divide(num(100));

export const daysInYear = root(days(365));
export const oneYear = root(years(1));
export const daysPostWeaning = root(days(281));
export const daysPreWeaning = root(days(84));
export const daysInSeason = root(days(91.25)).named('daysInSeason');

export const e = num(Math.E).named('e');

/** The zero of each gas, indexable by a generic gas type to give a `Container<Mass<G>>` */
export const zeroOfGas: {
  [G in FuelEmissionsGasType]: Container<Mass<G>>;
} = {
  CH4: zeroCH4,
  N2O: zeroN2O,
  CO2: zeroCO2,
  CO2e: zeroCO2e,
};
