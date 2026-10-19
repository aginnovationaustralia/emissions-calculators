import {
  FreightMethod1Input,
  FreightMethod2Input,
  FuelInput,
  LocationBasedElectricityInputs,
  MarketBasedElectricityInputs,
  OtherPurchasedGoodOrServiceInput,
  PostProductionInput,
  PostProductionIntensitiesInput,
  PurchasedPackagingByMassMethod1Input,
  PurchasedPackagingByMassMethod2Input,
  QualityTable,
  RefrigerantInput,
  SolidWasteAnaerobicDigestionMethod2Input,
  SolidWasteAnaerobicDigestionScope3Input,
  SolidWasteCompostingMethod2Input,
  SolidWasteCompostingScope3Input,
  SolidWasteIncinerationMethod2Input,
  SolidWasteIncinerationScope3Input,
  SolidWasteInput,
  SolidWasteLandfillWithGasRecoveryScope3Input,
  SolidWasteLandfillWithoutGasRecoveryScope3Input,
  SolidWasteMethod1Input,
  SolidWasteMethod2Input,
  SolidWasteScope3Input,
  SolidWasteUnmanagedBurialMethod2Input,
  SolidWasteUnmanagedDeepMethod2Input,
  SolidWasteUnmanagedShallowMethod2Input,
  StationaryFuelInput,
  TransportFuelInput,
  WastewaterTreatmentMethod1Input,
  WastewaterTreatmentMethod2Input,
} from '@aginnovationaustralia/emissions-calculators/post-production';

// These examples build two PostProductionInput objects with one entry in every array:
//
// - `postProductionInputDataMethod1` uses only method 1 inputs. Wherever there is a
//   choice of method the method 1 alternative is used.
// - `postProductionInputDataMethod2` uses method 2 inputs wherever they are available,
//   and populates every optional key.
//
// Rather than one large literal, each nested piece is declared as its own explicitly
// typed variable and then composed into the final inputs at the end. Pieces that don't
// differ by method are shared between the two inputs.

const quality: QualityTable = {
  Temporal: '5',
  Spatial: '4',
  SampleSize: '3',
  Scope3: '2',
};

// -------- Electricity --------

const electricityMethod1: LocationBasedElectricityInputs = {
  method: 'location',
  electricityPurchasedKWh: { value: 250000, quality },
  region: 'VIC',
};

const electricityMethod2: MarketBasedElectricityInputs = {
  method: 'market',
  electricityPurchasedKWh: { value: 250000, quality },
  // RECs are in MWh
  recsSurrendered: { value: 50 },
  recsOnsite: { value: 20 },
  region: 'VIC',
};

// -------- Intensities --------

const intensities: PostProductionIntensitiesInput = {
  unitsProduced: { value: 1000000 },
  productionEmissionsKgCO2e: { value: 2000000 },
  postProductionAllocation: { value: 0.8 },
};

// -------- Wastewater --------

// Volume is in cubic metres, COD in kg/m3 and methane quantities in tonnes
const wastewaterMethod1: WastewaterTreatmentMethod1Input = {
  facilityType: 'Anaerobic digestor/reactor',
  wastewaterVolume: { value: 20000, quality },
  fractionRemoved: { value: 0.1 },
  commodityType: 'Dairy products',
};

const wastewaterMethod2: WastewaterTreatmentMethod2Input = {
  facilityType: 'Anaerobic digestor/reactor',
  wastewaterVolume: { value: 20000, quality },
  fractionRemoved: { value: 0.1 },
  inletCOD: { value: 3 },
  outletCOD: { value: 0.5 },
  fractionSludge: { value: 0.1 },
  methaneCaptured: { value: 2 },
  methaneFlared: { value: 1 },
  methaneOut: { value: 0.5 },
};

// -------- Fuel --------

const transportFuel: TransportFuelInput = {
  vehicleType: 'Cars and light commercial vehicles',
  fuelType: 'Diesel oil',
  amountKilolitres: { value: 5 },
};

const stationaryFuel: StationaryFuelInput = {
  fuelClass: 'Gaseous fuels',
  fuelType: 'Natural gas',
  amountKilolitres: { value: 20 },
};

const fuel: FuelInput = {
  transport: [transportFuel],
  stationary: [stationaryFuel],
};

// -------- Refrigerants --------

const refrigerant: RefrigerantInput = {
  refrigerant: 'HFC-134a (R-134a)',
  chargeSize: { value: 5 },
  refrigerationType: 'Transport refrigeration',
};

// -------- Solid waste --------

const solidWasteTreatedOnsiteMethod1: SolidWasteMethod1Input = {
  method: '1',
  unmanagedBurial: { value: 2 },
  unmanagedDeep: { value: 1 },
  unmanagedShallow: { value: 3 },
  composting: { value: 4 },
  anaerobicDigestion: { value: 5 },
  incineration: { value: 1 },
};

const solidWasteUnmanagedBurial: SolidWasteUnmanagedBurialMethod2Input = {
  wasteType: 'Food waste',
  massWasteTonnes: { value: 2 },
};

const solidWasteUnmanagedDeep: SolidWasteUnmanagedDeepMethod2Input = {
  wasteType: 'Wood products (at end of life)',
  massWasteTonnes: { value: 1 },
};

const solidWasteUnmanagedShallow: SolidWasteUnmanagedShallowMethod2Input = {
  wasteType: 'Sludge',
  volumeWasteCubicMetres: { value: 3 },
};

const solidWasteOnsiteComposting: SolidWasteCompostingMethod2Input = {
  wasteType: 'Green waste',
  massWasteTonnes: { value: 4 },
};

const solidWasteOnsiteAnaerobicDigestion: SolidWasteAnaerobicDigestionMethod2Input =
  {
    wasteType: 'Food waste',
    massWasteTonnes: { value: 5 },
  };

const solidWasteOnsiteIncineration: SolidWasteIncinerationMethod2Input = {
  wasteType: 'Wood products (at time of harvest)',
  massWasteTonnes: { value: 1 },
};

const solidWasteTreatedOnsiteMethod2: SolidWasteMethod2Input = {
  method: '2',
  unmanagedBurial: [solidWasteUnmanagedBurial],
  unmanagedDeep: [solidWasteUnmanagedDeep],
  unmanagedShallow: [solidWasteUnmanagedShallow],
  composting: [solidWasteOnsiteComposting],
  anaerobicDigestion: [solidWasteOnsiteAnaerobicDigestion],
  incineration: [solidWasteOnsiteIncineration],
};

const solidWasteLandfillWithoutGasRecovery: SolidWasteLandfillWithoutGasRecoveryScope3Input =
  {
    wasteType: 'Municipal solid waste',
    massWasteTonnes: { value: 10 },
  };

const solidWasteLandfillWithGasRecovery: SolidWasteLandfillWithGasRecoveryScope3Input =
  {
    wasteType: 'Commercial and industrial waste',
    volumeWasteCubicMetres: { value: 20 },
  };

const solidWasteOffsiteIncineration: SolidWasteIncinerationScope3Input = {
  wasteType: 'Textiles',
  massWasteTonnes: { value: 1 },
};

const solidWasteOffsiteComposting: SolidWasteCompostingScope3Input = {
  wasteType: 'Green waste',
  massWasteTonnes: { value: 2 },
};

const solidWasteOffsiteAnaerobicDigestion: SolidWasteAnaerobicDigestionScope3Input =
  {
    wasteType: 'Food waste',
    massWasteTonnes: { value: 3 },
  };

const solidWasteTreatedOffsite: SolidWasteScope3Input = {
  landfillWithoutGasRecovery: [solidWasteLandfillWithoutGasRecovery],
  landfillWithGasRecovery: [solidWasteLandfillWithGasRecovery],
  incineration: [solidWasteOffsiteIncineration],
  composting: [solidWasteOffsiteComposting],
  anaerobicDigestion: [solidWasteOffsiteAnaerobicDigestion],
};

const wasteMethod1: SolidWasteInput = {
  treatedOnsite: solidWasteTreatedOnsiteMethod1,
  treatedOffsite: solidWasteTreatedOffsite,
};

const wasteMethod2: SolidWasteInput = {
  treatedOnsite: solidWasteTreatedOnsiteMethod2,
  treatedOffsite: solidWasteTreatedOffsite,
};

// -------- Purchases --------

const otherPurchasedGoodOrService: OtherPurchasedGoodOrServiceInput = {
  quantity: { value: 10 },
  emissionsFactor: { value: 1.5 },
};

// Packaging mass is in kg, and the method 2 emissions factor in kg CO2e per kg
const purchasedPackagingMethod1: PurchasedPackagingByMassMethod1Input = {
  type: 'Corrugated board',
  amountMass: { value: 20000 },
};

const purchasedPackagingMethod2: PurchasedPackagingByMassMethod2Input = {
  amountMass: { value: 20000 },
  customEmissionsFactor: { value: 0.8 },
};

// -------- Freight --------

// Distance is in km and weight in tonnes
const freightMethod1: FreightMethod1Input = {
  calculationMethod: '1',
  freightType: 'Truck > 3.5 tonnes refrigerated (diesel)',
  distance: { value: 300 },
  weight: { value: 500 },
};

const freightFuel: TransportFuelInput = {
  vehicleType: 'Heavy duty vehicles',
  fuelType: 'Diesel oil - Euro iv or higher',
  amountKilolitres: { value: 10 },
};

const freightMethod2: FreightMethod2Input = {
  calculationMethod: '2',
  freightType: 'Truck > 3.5 tonnes refrigerated (diesel)',
  fuel: freightFuel,
};

// -------- Combined inputs --------

export const postProductionInputDataMethod1: PostProductionInput = {
  electricity: electricityMethod1,
  intensities,
  wastewater: wastewaterMethod1,
  fuel,
  refrigerants: [refrigerant],
  waste: wasteMethod1,
  supplementaryCO2Kg: { value: 1000 },
  otherPurchasedGoodsAndServices: [otherPurchasedGoodOrService],
  state: 'VIC',
  purchasedPackaging: [purchasedPackagingMethod1],
  freight: [freightMethod1],
};

export const postProductionInputDataMethod2: PostProductionInput = {
  ...postProductionInputDataMethod1,
  electricity: electricityMethod2,
  wastewater: wastewaterMethod2,
  waste: wasteMethod2,
  purchasedPackaging: [purchasedPackagingMethod2],
  freight: [freightMethod2],
};
