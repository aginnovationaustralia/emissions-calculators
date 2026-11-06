/**
 * Substances are the keys of this interface. Consumers add their own with module augmentation:
 *
 *   declare module '@aginnovationaustralia/units' {
 *     interface SubstanceRegistry {
 *       Biochar: true;
 *     }
 *   }
 *
 * An interface is used rather than a union because interfaces merge across declarations and unions
 * do not. The value type is irrelevant, only the keys matter.
 */
export interface SubstanceRegistry {
  Carbon: true;
  Chemical: true;
  'Inorganic Fertiliser': true;
  'Organic Fertiliser': true;
  CO2: true;
  CH4: true;
  N2O: true;
  N: true;
  'Volatilised N': true;
  CO2e: true;
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

export type Substance = keyof SubstanceRegistry & string;
