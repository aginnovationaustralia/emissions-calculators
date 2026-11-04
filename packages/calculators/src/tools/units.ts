import type { GenericNumberUnit } from './generic/units';

export * from './generic/units';

export type Substance =
  | 'Carbon'
  | 'Chemical'
  | 'Inorganic Fertiliser'
  | 'Organic Fertiliser'
  | 'CO2'
  | 'CH4'
  | 'N2O'
  | 'N'
  | 'Volatilised N'
  | 'CO2e'
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

/** VEERG's number units, restricted to the VEERG substance vocabulary. */
export type NumberUnit = GenericNumberUnit<Substance>;
