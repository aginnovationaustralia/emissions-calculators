/*
 * Substance pack: the substances the VEERG agricultural calculators use, on top of the greenhouse
 * gases (which this pack also registers).
 *
 * Importing this module registers them in `SubstanceRegistry`. It has no runtime effect:
 *
 *   import '@aginnovationaustralia/calculator-units/substances/agriculture';
 */
export type { GreenhouseGas } from './greenhouse-gases.js';

declare module '../substances.js' {
  interface SubstanceRegistry {
    Carbon: true;
    Chemical: true;
    'Inorganic Fertiliser': true;
    'Organic Fertiliser': true;
    N: true;
    'Volatilised N': true;
    Refrigerant: true;
    Fuel: true;
    'Greasy Wool': true;
    'Clean Wool': true;
    FluidWaste: true;
    Oxygen: true;
    Urea: true;
    DryMatter: true;
    CrudeProtein: true;
    CropResidue: true;
    Yield: true;
    Lime: true;
    'Solid Waste': true;
    Milk: true;
    'Milk Solids': true;
    Liveweight: true;
    'Purchased Feed': true;
    'Purchased Mineral Supplement': true;
    'Volatile Solids': true;
    COD: true;
    Packaging: true;
    'Organic Amendment': true;
    Trees: true;
    'Freight Goods': true;
    Eggs: true;
    Fish: true;
  }
}

export type AgriculturalSubstance =
  | 'Carbon'
  | 'Chemical'
  | 'Inorganic Fertiliser'
  | 'Organic Fertiliser'
  | 'N'
  | 'Volatilised N'
  | 'Refrigerant'
  | 'Fuel'
  | 'Greasy Wool'
  | 'Clean Wool'
  | 'FluidWaste'
  | 'Oxygen'
  | 'Urea'
  | 'DryMatter'
  | 'CrudeProtein'
  | 'CropResidue'
  | 'Yield'
  | 'Lime'
  | 'Solid Waste'
  | 'Milk'
  | 'Milk Solids'
  | 'Liveweight'
  | 'Purchased Feed'
  | 'Purchased Mineral Supplement'
  | 'Volatile Solids'
  | 'COD'
  | 'Packaging'
  | 'Organic Amendment'
  | 'Trees'
  | 'Freight Goods'
  | 'Eggs'
  | 'Fish';
