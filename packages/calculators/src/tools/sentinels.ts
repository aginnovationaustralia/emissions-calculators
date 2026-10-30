import { FuelEmissionsGasType } from '@/constants/types';
import Decimal from 'decimal.js-light';
import { Container, num, root, TypedContainer } from './containers';
import {
  area,
  days,
  energy,
  mass,
  Mass,
  massPerHeadPerDay,
  massPerMass,
  massPerYear,
  RealNumber,
  realNumber,
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

export const zeroMassCarbon = root(mass('Carbon', new Decimal(0)), {
  name: 'zeroMassCarbon',
});

export const zeroMassCleanWool = root(mass('Clean Wool', new Decimal(0)), {
  name: 'zeroMassCleanWool',
});

export const zeroMassDryMatter = root(mass('DryMatter', new Decimal(0)), {
  name: 'zeroMassDryMatter',
});

export const zeroMassEggs = root(mass('Eggs', new Decimal(0)), {
  name: 'zeroMassEggs',
});

export const zeroMassFish = root(mass('Fish', new Decimal(0)), {
  name: 'zeroMassFish',
});

export const zeroMassLime = root(mass('Lime', new Decimal(0)), {
  name: 'zeroMassLime',
});

export const zeroMassLiveweight = root(mass('Liveweight', new Decimal(0)), {
  name: 'zeroMassLiveweight',
});

export const zeroMassMilk = root(mass('Milk', new Decimal(0)), {
  name: 'zeroMassMilk',
});

export const zeroMassSolidWaste = root(mass('Solid Waste', new Decimal(0)), {
  name: 'zeroMassSolidWaste',
});

export const zeroMassVolatilisedN = root(
  mass('Volatilised N', new Decimal(0)),
  {
    name: 'zeroMassVolatilisedN',
  },
);

export const zeroMassPerMassNInorganicFertiliser = root(
  massPerMass('N', 'Inorganic Fertiliser', new Decimal(0)),
  {
    name: 'zeroMassPerMassNInorganicFertiliser',
  },
);

export const zeroMassPerMassUreaInorganicFertiliser = root(
  massPerMass('Urea', 'Inorganic Fertiliser', new Decimal(0)),
  {
    name: 'zeroMassPerMassUreaInorganicFertiliser',
  },
);

export const zeroMassPerHeadPerDayCH4 = root(
  massPerHeadPerDay('CH4', new Decimal(0)),
  {
    name: 'zeroMassPerHeadPerDayCH4',
  },
);

export const zeroMassPerHeadPerDayDryMatter = root(
  massPerHeadPerDay('DryMatter', new Decimal(0)),
  { name: 'zeroMassPerHeadPerDayDryMatter' },
);

export const zeroMassPerHeadPerDayMilk = root(
  massPerHeadPerDay('Milk', new Decimal(0)),
  {
    name: 'zeroMassPerHeadPerDayMilk',
  },
);

export const zeroMassPerHeadPerDayN = root(
  massPerHeadPerDay('N', new Decimal(0)),
  {
    name: 'zeroMassPerHeadPerDayN',
  },
);

export const zeroMassPerHeadPerDayVolatileSolids = root(
  massPerHeadPerDay('Volatile Solids', new Decimal(0)),
  {
    name: 'zeroMassPerHeadPerDayVolatileSolids',
  },
);

export const zeroMassPerYearCO2 = root(massPerYear('CO2', new Decimal(0)), {
  name: 'zeroMassPerYearCO2',
});

export const zeroEnergy = root(energy(new Decimal(0)), {
  name: 'zeroEnergy',
});

export const zeroArea = root(area(new Decimal(0)), {
  name: 'zeroArea',
});

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
