/*
 * A typical calculation. This file is identical in ../calculator-units and
 * ../calculator-units-globals: only ./units differs. Diff the two folders to compare the setup.
 *
 * Every helper only names the units it expects. The return types are never written out: they are
 * inferred from the rules, e.g. `fuelEmissions` returns Container<Mass<'CO2e'>>.
 */
import {
  area,
  Area,
  Container,
  days,
  Days,
  distance,
  Distance,
  head,
  Head,
  Mass,
  MassPerArea,
  massPerArea,
  MassPerDistance,
  massPerDistance,
  MassPerHeadPerDay,
  massPerHeadPerDay,
  MassPerMass,
  massPerMass,
  num,
  RealNumber,
  root,
  Substance,
} from './units';

const oneMinus = (fraction: Container<RealNumber>) => num(1).minus(fraction);

/** Converts a mass of any gas to CO2e. Works for any substance, the GWP must match it. */
const toCO2e = <S extends Substance>(
  gas: Container<Mass<S>>,
  gwp: Container<MassPerMass<'CO2e', S>>,
) => gas.multiply(gwp);

/**
 * Efuel = D * FC * EFfuel
 */
const fuelEmissions = (
  travelled: Container<Distance>,
  fuelConsumption: Container<MassPerDistance<'Diesel'>>,
  emissionFactor: Container<MassPerMass<'CO2e', 'Diesel'>>,
) =>
  fuelConsumption
    .multiply(travelled)
    .multiply(emissionFactor)
    .reference('Example 1.1');

/**
 * EN2O = A * Napplied * EF * (44 / 28) * GWP_N2O
 */
const fertiliserEmissions = (
  areaFertilised: Container<Area>,
  applicationRate: Container<MassPerArea<'N'>>,
  emissionFactor: Container<MassPerMass<'N2O', 'N'>>,
  gwpN2O: Container<MassPerMass<'CO2e', 'N2O'>>,
) => {
  const nitrogenApplied = applicationRate
    .multiply(areaFertilised)
    .named('Nitrogen applied');
  const n2o = nitrogenApplied.multiply(emissionFactor).reference('Example 2.1');
  return toCO2e(n2o, gwpN2O);
};

/**
 * ECH4 = H * DMI * D * Ym * (1 - Rf) * GWP_CH4
 */
const entericEmissions = (
  herd: Container<Head>,
  dryMatterIntake: Container<MassPerHeadPerDay<'DryMatter'>>,
  period: Container<Days>,
  methaneYield: Container<MassPerMass<'CH4', 'DryMatter'>>,
  reductionFraction: Container<RealNumber>,
  gwpCH4: Container<MassPerMass<'CO2e', 'CH4'>>,
) => {
  const intake = dryMatterIntake
    .multiply(herd)
    .multiply(period)
    .named('Dry matter intake');
  const methane = intake
    .multiply(methaneYield)
    .multiply(oneMinus(reductionFraction))
    .reference('Example 3.1');
  return toCO2e(methane, gwpCH4);
};

export type FarmInput = {
  freightKm: number;
  fertilisedHectares: number;
  nitrogenKgPerHa: number;
  herdSize: number;
  dryMatterKgPerHeadPerDay: number;
  methaneReductionPercent: number;
};

export const calculateFarmEmissions = (input: FarmInput) => {
  // In real code these come from inputs and selectConstant. Here they are roots.
  const freight = fuelEmissions(
    root(distance(), input.freightKm * 1000).named('D'),
    root(massPerDistance('Diesel'), 0.00025).named('FC'),
    root(massPerMass('CO2e', 'Diesel'), 3.2).named('EFfuel'),
  );

  const fertiliser = fertiliserEmissions(
    root(area(), input.fertilisedHectares * 10_000).named('A'),
    root(massPerArea('N'), input.nitrogenKgPerHa / 10_000).named('Napplied'),
    root(massPerMass('N2O', 'N'), 0.01 * (44 / 28)).named('EF'),
    root(massPerMass('CO2e', 'N2O'), 273).named('GWP_N2O'),
  );

  const enteric = entericEmissions(
    root(head(), input.herdSize).named('H'),
    root(massPerHeadPerDay('DryMatter'), input.dryMatterKgPerHeadPerDay).named(
      'DMI',
    ),
    root(days(), 365).named('D'),
    root(massPerMass('CH4', 'DryMatter'), 0.0207).named('Ym'),
    num(input.methaneReductionPercent / 100).named('Rf'),
    root(massPerMass('CO2e', 'CH4'), 28).named('GWP_CH4'),
  );

  // All three are Mass<'CO2e'>, so they can be added. Adding the raw methane would not compile.
  const total = freight
    .plus(fertiliser)
    .plus(enteric)
    .named('Total farm emissions');

  // Share of the total from enteric methane: Mass<'CO2e'> / Mass<'CO2e'> is a RealNumber
  const entericShare = enteric.divide(total).named('Enteric share');

  return { freight, fertiliser, enteric, total, entericShare };
};
