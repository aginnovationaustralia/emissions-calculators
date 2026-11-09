/*
 * Typical mistakes, each annotated with the error TypeScript reports for it (as of TypeScript 5.9).
 * The same file exists in the other example folder, so the messages can be compared. Remove a
 * `@ts-expect-error` to see the error in the editor.
 *
 * Never run: this module only exists to be typechecked.
 */
import {
  area,
  distance,
  mass,
  massPerDistance,
  massPerMass,
  root,
} from './units';

const methane = root(mass('CH4'), 100);
const co2e = root(mass('CO2e'), 1000);
const gwpN2O = root(massPerMass('CO2e', 'N2O'), 273);
const dieselRate = root(massPerDistance('Diesel'), 0.00025);

// TypeScript reports:
//   Argument of type 'Container<Mass<"CH4">>' is not assignable to parameter of type 'Container<RealNumber | Mass<"CO2e">>'.
//   Type 'Mass<"CH4">' is not assignable to type 'RealNumber | Mass<"CO2e">'.
//   Type 'Mass<"CH4">' is not assignable to type 'Mass<"CO2e">'.
//   Type '"CH4"' is not assignable to type '"CO2e"'.
// @ts-expect-error Adding CH4 to a CO2e total
export const addingDifferentGases = co2e.plus(methane);

// TypeScript reports:
//   Argument of type 'Container<MassPerMass<"CO2e", "N2O">>' is not assignable to parameter of type 'Container<MultiplyRight<Mass<"CH4">, R>>'.
//   Type 'MassPerMass<"CO2e", "N2O">' is not assignable to type 'MultiplyRight<Mass<"CH4">, R>'.
//   Type 'MassPerMass<"CO2e", "N2O">' is not assignable to type 'MassPerMass<"Liveweight" | "DryMatter" | "CrudeProtein" | "Milk" | "Milk Solids" | "Greasy Wool" | "Clean Wool" | "Volatile Solids" | "N" | "Inorganic Fertiliser" | "Urea" | "CO2e" | ... 24 more ... | "Yield", "CH4">'.
//   Type '"N2O"' is not assignable to type '"CH4"'.
// @ts-expect-error Applying the N2O GWP to methane
export const wrongGwp = methane.multiply(gwpN2O);

// TypeScript reports:
//   Argument of type 'Container<Mass<"CH4">>' is not assignable to parameter of type 'Container<DivideRight<Mass<"CO2e">, R>>'.
//   Type 'Mass<"CH4">' is not assignable to type 'DivideRight<Mass<"CO2e">, R>'.
//   Type 'Mass<"CH4">' is not assignable to type 'Mass<"CO2e">'.
//   Type '"CH4"' is not assignable to type '"CO2e"'.
// @ts-expect-error Dividing by a unit with no rule
export const noDivideRule = co2e.divide(methane);

// TypeScript reports:
//   Argument of type 'Container<Area>' is not assignable to parameter of type 'Container<MultiplyRight<MassPerDistance<"Diesel">, R>>'.
//   Type 'Area' is not assignable to type 'MultiplyRight<MassPerDistance<"Diesel">, R>'.
//   Type 'Area' is not assignable to type 'RealNumber'.
//   Types of property '__unitType' are incompatible.
//   Type '"Area"' is not assignable to type '"RealNumber"'.
// @ts-expect-error Multiplying by a unit with no rule
export const noMultiplyRule = dieselRate.multiply(root(area(), 1));

// TypeScript reports:
//   Argument of type '"Deisel"' is not assignable to parameter of type '"Liveweight" | "DryMatter" | "CrudeProtein" | "Milk" | "Milk Solids" | "Greasy Wool" | "Clean Wool" | "Volatile Solids" | "N" | "Inorganic Fertiliser" | "Urea" | "CO2e" | "Organic Fertiliser" | ... 23 more ... | "Yield"'.
// @ts-expect-error A substance typo
export const typo = mass('Deisel');
export const fine = dieselRate.multiply(root(distance(), 1000));
