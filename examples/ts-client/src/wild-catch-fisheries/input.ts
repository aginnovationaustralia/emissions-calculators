import {
  FuelInput,
  LocationBasedElectricityInputs,
  MarketBasedElectricityInputs,
  OtherPurchasedGoodOrServiceInput,
  PurchasedFeedAquacultureInput,
  PurchasedFeedMethod2Input,
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
  WildCatchFisheriesInput,
  WildCatchFisheryInput,
} from '@aginnovationaustralia/emissions-calculators/wild-catch-fisheries';

// These examples build two WildCatchFisheriesInput objects with one entry in every array:
//
// - `wildCatchFisheriesInputDataMethod1` uses only method 1 inputs. Wherever there is a
//   choice of method the method 1 alternative is used.
// - `wildCatchFisheriesInputDataMethod2` uses method 2 inputs wherever they are
//   available, and populates every optional key.
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
  electricityPurchasedKWh: { value: 15000, quality },
  region: 'SA',
};

const electricityMethod2: MarketBasedElectricityInputs = {
  method: 'market',
  electricityPurchasedKWh: { value: 15000, quality },
  // RECs are in MWh
  recsSurrendered: { value: 5 },
  recsOnsite: { value: 2 },
  region: 'SA',
};

// -------- Purchased feed (bait) --------

// Feed amounts are in tonnes, and the method 2 emissions factor in kg CO2e per kg
const purchasedFeedMethod1: PurchasedFeedAquacultureInput = {
  type: 'Squid',
  amount: { value: 20 },
};

const purchasedFeedMethod2: PurchasedFeedMethod2Input = {
  amount: { value: 20 },
  customEmissionsFactor: { value: 1.2 },
};

// -------- Fuel --------

const transportFuel: TransportFuelInput = {
  vehicleType: 'Vessel',
  fuelType: 'Diesel',
  amountKilolitres: { value: 200, quality },
};

const stationaryFuel: StationaryFuelInput = {
  fuelClass: 'Liquid fuels',
  fuelType: 'Automotive gasoline/petrol',
  amountKilolitres: { value: 2 },
};

const fuel: FuelInput = {
  transport: [transportFuel],
  stationary: [stationaryFuel],
};

// -------- Refrigerants --------

const refrigerant: RefrigerantInput = {
  refrigerant: 'HFC-134a (R-134a)',
  chargeSize: { value: 20 },
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

// -------- Wastewater --------

// Volume is in cubic metres, COD in kg/m3 and methane quantities in tonnes
const wastewaterMethod1: WastewaterTreatmentMethod1Input = {
  facilityType: 'Shallow anaerobic lagoon',
  wastewaterVolume: { value: 1000 },
  fractionRemoved: { value: 0.1 },
  commodityType: 'Meat and poultry',
};

const wastewaterMethod2: WastewaterTreatmentMethod2Input = {
  facilityType: 'Shallow anaerobic lagoon',
  wastewaterVolume: { value: 1000 },
  fractionRemoved: { value: 0.1 },
  inletCOD: { value: 4 },
  outletCOD: { value: 1 },
  fractionSludge: { value: 0.1 },
  methaneCaptured: { value: 0.1 },
  methaneFlared: { value: 0.05 },
  methaneOut: { value: 0.01 },
};

// -------- Purchases --------

const otherPurchasedGoodOrService: OtherPurchasedGoodOrServiceInput = {
  quantity: { value: 10 },
  emissionsFactor: { value: 1.5 },
};

// -------- Fisheries --------

const fisheryMethod1: WildCatchFisheryInput = {
  id: 'wild-catch-fishery-method-1',
  electricityAllocation: { value: 1 },
  state: 'SA',
  // Tonnes of fish or crustaceans harvested
  amountHarvested: { value: 500 },
  purchasedFeed: [purchasedFeedMethod1],
  fuel,
  refrigerants: [refrigerant],
  waste: wasteMethod1,
  wastewater: wastewaterMethod1,
  otherPurchasedGoodsAndServices: [otherPurchasedGoodOrService],
};

const fisheryMethod2: WildCatchFisheryInput = {
  ...fisheryMethod1,
  id: 'wild-catch-fishery-method-2',
  purchasedFeed: [purchasedFeedMethod2],
  waste: wasteMethod2,
  wastewater: wastewaterMethod2,
};

// -------- Combined inputs --------

export const wildCatchFisheriesInputDataMethod1: WildCatchFisheriesInput = {
  electricity: electricityMethod1,
  fisheries: [fisheryMethod1],
};

export const wildCatchFisheriesInputDataMethod2: WildCatchFisheriesInput = {
  electricity: electricityMethod2,
  fisheries: [fisheryMethod2],
};
