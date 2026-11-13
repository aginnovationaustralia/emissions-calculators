/*
 * Substance pack: the greenhouse gases, and CO2-e for emissions converted with a GWP.
 *
 * Importing this module registers them in `SubstanceRegistry`. It has no runtime effect:
 *
 *   import '@aginnovationaustralia/calculator-units/substances/greenhouse-gases';
 */
declare module '../substances.js' {
  interface SubstanceRegistry {
    CO2: true;
    CH4: true;
    N2O: true;
    CO2e: true;
  }
}

export type GreenhouseGas = 'CO2' | 'CH4' | 'N2O' | 'CO2e';
