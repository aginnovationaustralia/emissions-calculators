import {
  BeefPurchasedLivestockInput,
  BurningInput,
  CarbonMassOfWoodProductsFromFullCAMInput,
  CarbonMassOfWoodProductsFromRecordsInput,
  FarmForestryInput,
  FeedlotGroupLivestockInput,
  FeedlotGroupManureAllocationsInput,
  FeedlotInput,
  FeedlotLotInput,
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
  PurchasedFeedAustralianInput,
  PurchasedFeedMethod2Input,
  PurchasedMineralSupplementMethod1Input,
  PurchasedMineralSupplementMethod2Input,
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
} from '@aginnovationaustralia/emissions-calculators/feedlot';

// These examples build two FeedlotInput objects with one entry in every array:
//
// - `feedlotInputDataMethod1` uses only method 1 inputs. Every optional method 2 key is left
//   out, and wherever there is a choice of method the method 1 alternative is used.
// - `feedlotInputDataMethod2` uses method 2 inputs wherever they are available, and
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
  electricityPurchasedKWh: { value: 60000, quality },
  region: 'QLD',
};

const electricityMethod2: MarketBasedElectricityInputs = {
  method: 'market',
  electricityPurchasedKWh: { value: 60000, quality },
  recsSurrendered: { value: 10 },
  recsOnsite: { value: 5 },
  region: 'QLD',
};

// -------- Groups --------

const groupManureAllocations: FeedlotGroupManureAllocationsInput = {
  solidStorage: { value: 0.5 },
  composting: { value: 0.3 },
  directApplication: { value: 0.2 },
};

const groupMethod1: FeedlotGroupLivestockInput = {
  head: { value: 1000, quality },
  averageLengthOfStayDays: { value: 100 },
  manureAllocations: groupManureAllocations,
};

const groupMethod2: FeedlotGroupLivestockInput = {
  ...groupMethod1,
  method2DryMatterIntake: { value: 10 },
  method2CrudeProtein: { value: 0.14 },
  method2NitrogenRetentionRate: { value: 0.1 },
  method2AverageNeutralDetergentFibrePercentage: { value: 30 },
  method2DryMatterDigestibility: { value: 0.75 },
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

const purchasedLivestockMethod1: BeefPurchasedLivestockInput = {
  type: 'Beef',
  headPurchased: { value: 1000 },
  category: 'beefWeaned',
  region: 'QLD - Moderate/High',
  class: 'steersLt1',
  season: 'autumn',
};

const purchasedLivestockMethod2: BeefPurchasedLivestockInput = {
  type: 'Beef',
  headPurchased: { value: 1000 },
  emissionFactorMethod2: { value: 5 },
  liveweightMethod2: { value: 300 },
};

const purchasedFeedMethod1: PurchasedFeedAustralianInput = {
  type: 'Barley grain',
  region: 'Australia',
  amount: { value: 1000 },
};

const purchasedFeedMethod2: PurchasedFeedMethod2Input = {
  amount: { value: 1000 },
  customEmissionsFactor: { value: 0.3 },
};

const purchasedMineralSupplementMethod1: PurchasedMineralSupplementMethod1Input =
  {
    type: 'Lick block, mineral',
    amount: { value: 5 },
  };

const purchasedMineralSupplementMethod2: PurchasedMineralSupplementMethod2Input =
  {
    amount: { value: 5 },
    customEmissionsFactor: { value: 0.5 },
  };

const otherPurchasedGoodOrService: OtherPurchasedGoodOrServiceInput = {
  quantity: { value: 10 },
  emissionsFactor: { value: 1.5 },
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

// -------- Lots --------

const lotMethod1: FeedlotLotInput = {
  id: 'feedlot-lot-method-1',
  electricityAllocation: { value: 1 },
  groups: [groupMethod1],
  state: 'QLD',
  grazingSystem: 'Non-irrigated pasture',
  liveweightSoldKg: { value: 450000 },
  fuel,
  waste: wasteMethod1,
  purchasedLivestock: [purchasedLivestockMethod1],
  purchasedFeed: [purchasedFeedMethod1],
  purchasedMineralSupplements: [purchasedMineralSupplementMethod1],
  services,
  otherPurchasedGoodsAndServices: [otherPurchasedGoodOrService],
};

const lotMethod2: FeedlotLotInput = {
  ...lotMethod1,
  id: 'feedlot-lot-method-2',
  groups: [groupMethod2],
  method2MeanAnnualTemperature: '21',
  waste: wasteMethod2,
  purchasedLivestock: [purchasedLivestockMethod2],
  purchasedFeed: [purchasedFeedMethod2],
  purchasedMineralSupplements: [purchasedMineralSupplementMethod2],
};

// -------- Land use --------

const carbonMassOfWoodProductsMethod1: CarbonMassOfWoodProductsFromFullCAMInput =
  {
    calculationMethod: '1',
    carbonMassPerHectareFromFullCAM: { value: 1 },
  };

const carbonMassOfWoodProductsMethod2: CarbonMassOfWoodProductsFromRecordsInput =
  {
    calculationMethod: '2',
    carbonMassPerHectareFromRecords: { value: 1.2 },
  };

const landUseChangeActivityMethod1: FarmForestryInput = {
  type: 'farmForestry',
  activityAreaHectares: { value: 10 },
  carbonMassInTreesCurrentYear: { value: 102 },
  carbonMassInTreesPreviousYear: { value: 100 },
  carbonMassInDebrisCurrentYear: { value: 10.5 },
  carbonMassInDebrisPreviousYear: { value: 10 },
  carbonMassOfWoodProducts: carbonMassOfWoodProductsMethod1,
};

const landUseChangeActivityMethod2: FarmForestryInput = {
  ...landUseChangeActivityMethod1,
  carbonMassOfWoodProducts: carbonMassOfWoodProductsMethod2,
};

const burning: BurningInput = {
  emissionsFromBurningLowRainfallZone: { value: 1 },
  emissionsFromBurningHighRainfallZone: { value: 2 },
  carbonStockChangeLowRainfallZone: { value: 3 },
  carbonStockChangeHighRainfallZone: { value: 4 },
};

const perennialCropPlanting: PerennialCropPlantingInput = {
  areaPlanted: { value: 5 },
  yearsSincePlanting: { value: 3 },
};

const perennialCropClearingMethod1: PerennialCropClearingMethod1Input = {
  areaCleared: { value: 1 },
};

const perennialCropClearingMethod2: PerennialCropClearingMethod2Input = {
  areaCleared: { value: 1 },
  method2AgeAtClearing: { value: 5 },
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
  method2ActualStemDensity: { value: 400 },
  method2BiomassAtMaturity: { value: 50 },
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

export const feedlotInputDataMethod1: FeedlotInput = {
  electricity: electricityMethod1,
  lots: [lotMethod1],
  landUse: landUseMethod1,
};

export const feedlotInputDataMethod2: FeedlotInput = {
  electricity: electricityMethod2,
  lots: [lotMethod2],
  landUse: landUseMethod2,
};
