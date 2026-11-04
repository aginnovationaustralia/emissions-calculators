import {
  BurningInput,
  CarbonMassOfWoodProductsFromFullCAMInput,
  CarbonMassOfWoodProductsFromRecordsInput,
  FarmForestryInput,
  FuelInput,
  LocationBasedElectricityInputs,
  LULUCFInput,
  MarketBasedElectricityInputs,
  OtherPurchasedGoodOrServiceInput,
  PerennialCropClearingMethod1Input,
  PerennialCropClearingMethod2Input,
  PerennialCropFullMethod2StemDensityInput,
  PerennialCropMethod1Input,
  PerennialCropPlantingInput,
  PoultryClassesLivestockInput,
  PoultryClassInput,
  PoultryFlockInput,
  PoultryInput,
  PoultryMMS2AllocationInput,
  PoultryMMSAllocationInput,
  PoultryPurchasedLivestockInput,
  PurchasedFeedAustralianInput,
  PurchasedFeedMethod2Input,
  QualityTable,
  ServicesFuelInput,
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
} from '@aginnovationaustralia/emissions-calculators/poultry';

// These examples build two PoultryInput objects with one entry in every array:
//
// - `poultryInputDataMethod1` uses only method 1 inputs. Every optional method 2 key is left
//   out, and wherever there is a choice of method the method 1 alternative is used.
// - `poultryInputDataMethod2` uses method 2 inputs wherever they are available, and
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
  electricityPurchasedKilowattHours: { value: 60000, quality },
  region: 'SA',
};

const electricityMethod2: MarketBasedElectricityInputs = {
  method: 'market',
  electricityPurchasedKilowattHours: { value: 60000, quality },
  recsSurrenderedMegawattHours: { value: 10 },
  recsOnsiteMegawattHours: { value: 5 },
  region: 'SA',
};

// -------- Classes --------

const mms2Allocation: PoultryMMS2AllocationInput = {
  solidStorage: { value: 0.2 },
  composting: { value: 0.2 },
  digester: { value: 0.2 },
  directProcessing: { value: 0.2 },
  directApplication: { value: 0.2 },
};

const classManureAllocation: PoultryMMSAllocationInput = {
  manureWithLitter: {
    manureAllocated: { value: 0.4 },
    treatmentStage2Allocations: mms2Allocation,
  },
  beltManureRemoval: {
    manureAllocated: { value: 0.3 },
    treatmentStage2Allocations: mms2Allocation,
  },
  manureStoredInHouse: {
    manureAllocated: { value: 0.2 },
    treatmentStage2Allocations: mms2Allocation,
  },
  pastureRangeAndPaddock: { value: 0.1 },
};

const classMethod1: PoultryClassInput = {
  head: { value: 20000, quality },
  durationDays: { value: 365 },
  manureAllocations: classManureAllocation,
};

const classMethod2: PoultryClassInput = {
  ...classMethod1,
  method2DailyDryMatterIntakeKilograms: { value: 0.1 },
  method2FractionCrudeProteinContent: { value: 0.2 },
  method2FractionDryMatterDigestibility: { value: 0.8 },
};

const classesMethod1: PoultryClassesLivestockInput = {
  layers: classMethod1,
  meatChickenGrowers: classMethod1,
  meatChickenBreeders: classMethod1,
  meatOther: classMethod1,
};

const classesMethod2: PoultryClassesLivestockInput = {
  layers: classMethod2,
  meatChickenGrowers: classMethod2,
  meatChickenBreeders: classMethod2,
  meatOther: classMethod2,
};

// -------- Fuel and services --------

const transportFuel: TransportFuelInput = {
  vehicleType: 'Cars and light commercial vehicles',
  fuelType: 'Diesel oil',
  amountKilolitres: { value: 10 },
};

const stationaryFuel: StationaryFuelInput = {
  fuelClass: 'Gaseous fuels',
  fuelType: 'Natural gas',
  amountKilolitres: { value: 5 },
};

const fuel: FuelInput = {
  transport: [transportFuel],
  stationary: [stationaryFuel],
};

const services: ServicesFuelInput = {
  fuel,
};

// -------- Purchases --------

const purchasedLivestockMethod1: PoultryPurchasedLivestockInput = {
  type: 'Poultry',
  headPurchased: { value: 5000 },
  weightClass: 'pullets',
};

const purchasedLivestockMethod2: PoultryPurchasedLivestockInput = {
  type: 'Poultry',
  headPurchased: { value: 5000 },
  method2EmissionFactor: { value: 3 },
  method2LiveweightKilograms: { value: 1.5 },
};

const purchasedFeedMethod1: PurchasedFeedAustralianInput = {
  type: 'Feed for chickens',
  region: 'Australia',
  amountTonnes: { value: 1000 },
};

const purchasedFeedMethod2: PurchasedFeedMethod2Input = {
  amountTonnes: { value: 1000 },
  method2EmissionFactor: { value: 0.5 },
};

const otherPurchasedGoodOrService: OtherPurchasedGoodOrServiceInput = {
  quantity: { value: 10 },
  emissionFactor: { value: 1.5 },
};

// -------- Solid waste --------

const solidWasteTreatedOnsiteMethod1: SolidWasteMethod1Input = {
  method: '1',
  unmanagedBurialTonnes: { value: 2 },
  unmanagedDeepTonnes: { value: 1 },
  unmanagedShallowTonnes: { value: 3 },
  compostingTonnes: { value: 4 },
  anaerobicDigestionTonnes: { value: 5 },
  incinerationTonnes: { value: 1 },
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

// -------- Flocks --------

const flockMethod1: PoultryFlockInput = {
  id: 'poultry-flock-method-1',
  electricityAllocation: { value: 1 },
  classes: classesMethod1,
  isInLeachingZone: false,
  state: 'SA',
  climateZone: 'Warm temperate dry',
  grazingSystem: 'Non-irrigated pasture',
  liveweightSoldKilograms: { value: 150000 },
  eggsSoldKilograms: { value: 200000 },
  fuel,
  waste: wasteMethod1,
  purchasedLivestock: [purchasedLivestockMethod1],
  purchasedFeed: [purchasedFeedMethod1],
  services,
  otherPurchasedGoodsAndServices: [otherPurchasedGoodOrService],
};

const flockMethod2: PoultryFlockInput = {
  ...flockMethod1,
  id: 'poultry-flock-method-2',
  classes: classesMethod2,
  method2MeanAnnualTemperature: '17',
  waste: wasteMethod2,
  purchasedLivestock: [purchasedLivestockMethod2],
  purchasedFeed: [purchasedFeedMethod2],
};

// -------- Land use --------

const carbonMassOfWoodProductsMethod1: CarbonMassOfWoodProductsFromFullCAMInput =
  {
    calculationMethod: '1',
    carbonMassFromFullCAMTonnesPerHectare: { value: 1 },
  };

const carbonMassOfWoodProductsMethod2: CarbonMassOfWoodProductsFromRecordsInput =
  {
    calculationMethod: '2',
    carbonMassFromRecordsTonnesPerHectare: { value: 1.2 },
  };

const landUseChangeActivityMethod1: FarmForestryInput = {
  type: 'farmForestry',
  activityAreaHectares: { value: 10 },
  carbonMassInTreesCurrentYearTonnesPerHectare: { value: 102 },
  carbonMassInTreesPreviousYearTonnesPerHectare: { value: 100 },
  carbonMassInDebrisCurrentYearTonnesPerHectare: { value: 10.5 },
  carbonMassInDebrisPreviousYearTonnesPerHectare: { value: 10 },
  carbonMassOfWoodProducts: carbonMassOfWoodProductsMethod1,
};

const landUseChangeActivityMethod2: FarmForestryInput = {
  ...landUseChangeActivityMethod1,
  carbonMassOfWoodProducts: carbonMassOfWoodProductsMethod2,
};

const burning: BurningInput = {
  emissionsFromBurningLowRainfallZoneTonnes: { value: 1 },
  emissionsFromBurningHighRainfallZoneTonnes: { value: 2 },
  carbonStockChangeLowRainfallZoneTonnes: { value: 3 },
  carbonStockChangeHighRainfallZoneTonnes: { value: 4 },
};

const perennialCropPlanting: PerennialCropPlantingInput = {
  areaPlantedHectares: { value: 5 },
  yearsSincePlanting: { value: 3 },
};

const perennialCropClearingMethod1: PerennialCropClearingMethod1Input = {
  areaClearedHectares: { value: 1 },
};

const perennialCropClearingMethod2: PerennialCropClearingMethod2Input = {
  areaClearedHectares: { value: 1 },
  ageAtClearingYears: { value: 5 },
};

const perennialCropMethod1: PerennialCropMethod1Input = {
  calculationMethod: '1',
  cropType: 'Apples',
  plantings: [perennialCropPlanting],
  clearings: [perennialCropClearingMethod1],
};

const perennialCropMethod2: PerennialCropFullMethod2StemDensityInput = {
  calculationMethod: '2 (stem density)',
  cropType: 'Apples',
  actualStemDensityPerHectare: { value: 400 },
  biomassAtMaturityTonnesPerHectare: { value: 50 },
  plantings: [perennialCropPlanting],
  clearings: [perennialCropClearingMethod2],
};

const landUseMethod1: LULUCFInput = {
  activities: [landUseChangeActivityMethod1],
  burning: [burning],
  perennialCrops: [perennialCropMethod1],
};

const landUseMethod2: LULUCFInput = {
  activities: [landUseChangeActivityMethod2],
  burning: [burning],
  perennialCrops: [perennialCropMethod2],
};

// -------- Combined inputs --------

export const poultryInputDataMethod1: PoultryInput = {
  electricity: electricityMethod1,
  flocks: [flockMethod1],
  landUse: landUseMethod1,
};

export const poultryInputDataMethod2: PoultryInput = {
  electricity: electricityMethod2,
  flocks: [flockMethod2],
  landUse: landUseMethod2,
};
