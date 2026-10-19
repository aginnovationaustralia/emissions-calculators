import {
  AquacultureFisheryInput,
  AquacultureInput,
  AquacultureSystemInput,
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
} from '@aginnovationaustralia/emissions-calculators/aquaculture';

// These examples build two AquacultureInput objects with one entry in every array:
//
// - `aquacultureInputDataMethod1` uses only method 1 inputs. Wherever there is a choice
//   of method the method 1 alternative is used.
// - `aquacultureInputDataMethod2` uses method 2 inputs wherever they are available, and
//   populates every optional key.
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
  electricityPurchasedKWh: { value: 20000, quality },
  region: 'TAS',
};

const electricityMethod2: MarketBasedElectricityInputs = {
  method: 'market',
  electricityPurchasedKWh: { value: 20000, quality },
  recsSurrendered: { value: 5 },
  recsOnsite: { value: 2 },
  region: 'TAS',
};

// -------- Purchased feed --------

const purchasedFeedMethod1: PurchasedFeedAquacultureInput = {
  type: 'Whole Sardines',
  amount: { value: 50 },
};

const purchasedFeedMethod2: PurchasedFeedMethod2Input = {
  amount: { value: 50 },
  customEmissionsFactor: { value: 1.2 },
};

// -------- Fuel --------

const transportFuel: TransportFuelInput = {
  vehicleType: 'Vessel',
  fuelType: 'Diesel',
  amountKilolitres: { value: 20 },
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
  refrigerant: 'HFC-23 (R-23)',
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

// -------- Wastewater --------

const wastewaterMethod1: WastewaterTreatmentMethod1Input = {
  facilityType: 'Shallow anaerobic lagoon',
  wastewaterVolume: { value: 500 },
  fractionRemoved: { value: 0.1 },
  commodityType: 'Meat and poultry',
};

const wastewaterMethod2: WastewaterTreatmentMethod2Input = {
  facilityType: 'Shallow anaerobic lagoon',
  wastewaterVolume: { value: 500 },
  fractionRemoved: { value: 0.1 },
  inletCOD: { value: 3 },
  outletCOD: { value: 0.5 },
  fractionSludge: { value: 0.1 },
  methaneCaptured: { value: 0.2 },
  methaneFlared: { value: 0.1 },
  methaneOut: { value: 0.05 },
};

// -------- Aquaculture system --------

const fishery: AquacultureSystemInput = {
  amountProduced: { value: 1000 },
  location: 'Offshore cages in seagrass meadows',
};

// -------- Other purchases --------

const otherPurchasedGoodOrService: OtherPurchasedGoodOrServiceInput = {
  quantity: { value: 10 },
  emissionsFactor: { value: 1.5 },
};

// -------- Fisheries --------

const fisheryActivityMethod1: AquacultureFisheryInput = {
  id: 'salmon-farm-method-1',
  state: 'TAS',
  electricityAllocation: { value: 1 },
  purchasedFeed: [purchasedFeedMethod1],
  fuel,
  refrigerants: [refrigerant],
  waste: wasteMethod1,
  wastewater: wastewaterMethod1,
  fishery,
  otherPurchasedGoodsAndServices: [otherPurchasedGoodOrService],
};

const fisheryActivityMethod2: AquacultureFisheryInput = {
  ...fisheryActivityMethod1,
  id: 'salmon-farm-method-2',
  purchasedFeed: [purchasedFeedMethod2],
  waste: wasteMethod2,
  wastewater: wastewaterMethod2,
};

// -------- Combined inputs --------

export const aquacultureInputDataMethod1: AquacultureInput = {
  electricity: electricityMethod1,
  fisheries: [fisheryActivityMethod1],
};

export const aquacultureInputDataMethod2: AquacultureInput = {
  electricity: electricityMethod2,
  fisheries: [fisheryActivityMethod2],
};
