import {
  AgrichemicalInput,
  BurningInput,
  CarbonMassOfWoodProductsFromFullCAMInput,
  CarbonMassOfWoodProductsFromRecordsInput,
  FarmForestryInput,
  FeedlotManureGroupInput,
  FeedlotManureGroupManureAllocationsInput,
  FeedlotManureInput,
  FertiliserInputInorganicScope1Method1,
  FertiliserInputInorganicScope1Method2,
  FuelInput,
  InorganicFertiliserComponentInput,
  InorganicFertiliserInputScope3Method1,
  InorganicFertiliserScope1Method2Input,
  InorganicFertilisersScope1Method1Input,
  InorganicFertilisersScope1Method2Input,
  LimeApplicationInput,
  LimeInput,
  LocationBasedElectricityInputs,
  LULUCFInput,
  MarketBasedElectricityInputs,
  OrganicFertiliserInput,
  OrganicFertiliserTracedInput,
  OrganicFertilisersInput,
  OtherPurchasedGoodOrServiceInput,
  PastureResidueInput,
  PastureResiduesInput,
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
  SheepClassesSeasonalInput,
  SheepClassPeriodInput,
  SheepClassSeasonalInput,
  SheepClassWithLambingPeriodInput,
  SheepClassWithLambingSeasonalInput,
  SheepClassWithProportionLambsBornPeriodInput,
  SheepClassWithProportionLambsBornSeasonalInput,
  SheepFlockInput,
  SheepInput,
  SheepPurchasedLivestockInput,
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
} from '@aginnovationaustralia/emissions-calculators/sheep';

// These examples build two SheepInput objects with one entry in every array:
//
// - `sheepInputDataMethod1` uses only method 1 inputs. Every optional method 2 key is left
//   out, and wherever there is a choice of method the method 1 alternative is used.
// - `sheepInputDataMethod2` uses method 2 inputs wherever they are available, and
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
  region: 'VIC',
};

const electricityMethod2: MarketBasedElectricityInputs = {
  method: 'market',
  electricityPurchasedKWh: { value: 60000, quality },
  recsSurrendered: { value: 10 },
  recsOnsite: { value: 5 },
  region: 'VIC',
};

// -------- Classes --------

const classPeriodMethod1: SheepClassPeriodInput = {
  head: { value: 500, quality },
};

const classPeriodMethod2: SheepClassPeriodInput = {
  ...classPeriodMethod1,
  method2Liveweight: { value: 60 },
  method2LiveweightGain: { value: 0.1 },
  method2DryMatterAvailability: { value: 2 },
  method2DryMatterDigestibility: { value: 0.6 },
  method2AverageDurationDays: { value: 91 },
  method2CrudeProteinContent: { value: 0.15 },
};

const classWithLambingPeriodMethod1: SheepClassWithLambingPeriodInput = {
  ...classPeriodMethod1,
  percentLambing: { value: 90 },
  percentLambMarking: { value: 85 },
};

const classWithLambingPeriodMethod2: SheepClassWithLambingPeriodInput = {
  ...classWithLambingPeriodMethod1,
  ...classPeriodMethod2,
};

const classWithProportionLambsBornPeriodMethod1: SheepClassWithProportionLambsBornPeriodInput =
  {
    ...classPeriodMethod1,
    proportionOfLambsBorn: { value: 0.25 },
  };

const classWithProportionLambsBornPeriodMethod2: SheepClassWithProportionLambsBornPeriodInput =
  {
    ...classWithProportionLambsBornPeriodMethod1,
    ...classPeriodMethod2,
  };

const classMethod1: SheepClassSeasonalInput = {
  greasyWoolProduction: { value: 5 },
  cleanWoolYieldProportion: { value: 0.65 },
  spring: classPeriodMethod1,
  summer: classPeriodMethod1,
  autumn: classPeriodMethod1,
  winter: classPeriodMethod1,
};

const classMethod2: SheepClassSeasonalInput = {
  ...classMethod1,
  spring: classPeriodMethod2,
  summer: classPeriodMethod2,
  autumn: classPeriodMethod2,
  winter: classPeriodMethod2,
};

const classWithLambingMethod1: SheepClassWithLambingSeasonalInput = {
  greasyWoolProduction: { value: 5 },
  cleanWoolYieldProportion: { value: 0.65 },
  spring: classWithLambingPeriodMethod1,
  summer: classWithLambingPeriodMethod1,
  autumn: classWithLambingPeriodMethod1,
  winter: classWithLambingPeriodMethod1,
};

const classWithLambingMethod2: SheepClassWithLambingSeasonalInput = {
  ...classWithLambingMethod1,
  spring: classWithLambingPeriodMethod2,
  summer: classWithLambingPeriodMethod2,
  autumn: classWithLambingPeriodMethod2,
  winter: classWithLambingPeriodMethod2,
};

const classWithProportionLambsBornMethod1: SheepClassWithProportionLambsBornSeasonalInput =
  {
    greasyWoolProduction: { value: 3 },
    cleanWoolYieldProportion: { value: 0.65 },
    spring: classWithProportionLambsBornPeriodMethod1,
    summer: classWithProportionLambsBornPeriodMethod1,
    autumn: classWithProportionLambsBornPeriodMethod1,
    winter: classWithProportionLambsBornPeriodMethod1,
  };

const classWithProportionLambsBornMethod2: SheepClassWithProportionLambsBornSeasonalInput =
  {
    ...classWithProportionLambsBornMethod1,
    spring: classWithProportionLambsBornPeriodMethod2,
    summer: classWithProportionLambsBornPeriodMethod2,
    autumn: classWithProportionLambsBornPeriodMethod2,
    winter: classWithProportionLambsBornPeriodMethod2,
  };

const classesMethod1: SheepClassesSeasonalInput = {
  period: 'seasonal',
  breedingEwes: classWithLambingMethod1,
  lambsHoggets: classWithProportionLambsBornMethod1,
  maidenEwes: classWithLambingMethod1,
  otherEwes: classMethod1,
  rams: classMethod1,
  wethers: classMethod1,
};

const classesMethod2: SheepClassesSeasonalInput = {
  period: 'seasonal',
  breedingEwes: classWithLambingMethod2,
  lambsHoggets: classWithProportionLambsBornMethod2,
  maidenEwes: classWithLambingMethod2,
  otherEwes: classMethod2,
  rams: classMethod2,
  wethers: classMethod2,
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

// -------- Lime --------

const limeApplicationMethod1: LimeApplicationInput = {
  type: 'Limestone',
  massAppliedKg: { value: 5000 },
  limestoneFraction: { value: 0.9 },
};

const limeApplicationMethod2: LimeApplicationInput = {
  ...limeApplicationMethod1,
  customScope3EmissionsFactor: { value: 0.05 },
};

const limeMethod1: LimeInput = {
  applications: [limeApplicationMethod1],
};

const limeMethod2: LimeInput = {
  applications: [limeApplicationMethod2],
};

// -------- Pasture residues --------

const pastureResiduesMethod1: PastureResiduesInput = {
  calculationMethod: '1',
};

const pastureResiduesMethod2: PastureResiduesInput = {
  calculationMethod: '2',
  averageYieldPerHectare: { value: 3 },
};

const pastureMethod1: PastureResidueInput = {
  type: 'Grass clover mixture',
  areaManaged: { value: 1000 },
  fractionOfAnnualCropBurnt: { value: 0 },
  residues: pastureResiduesMethod1,
};

const pastureMethod2: PastureResidueInput = {
  ...pastureMethod1,
  residues: pastureResiduesMethod2,
};

// -------- Purchases --------

// The method 1 liveweight branch (`state` + `season` lookup) currently fails at calculation
// time, so the method 1 emission factor is paired with a method 2 liveweight here.
const purchasedLivestockMethod1: SheepPurchasedLivestockInput = {
  type: 'Sheep',
  headPurchased: { value: 100 },
  class: 'maidenEwes',
  liveweightMethod2: { value: 45 },
};

const purchasedLivestockMethod2: SheepPurchasedLivestockInput = {
  type: 'Sheep',
  headPurchased: { value: 100 },
  emissionFactorMethod2: { value: 5 },
  liveweightMethod2: { value: 45 },
};

const purchasedFeedMethod1: PurchasedFeedAustralianInput = {
  type: 'Lucerne hay',
  region: 'Australia',
  amount: { value: 20 },
};

const purchasedFeedMethod2: PurchasedFeedMethod2Input = {
  amount: { value: 20 },
  customEmissionsFactor: { value: 0.3 },
};

const purchasedMineralSupplementMethod1: PurchasedMineralSupplementMethod1Input =
  {
    type: 'Lick block, mineral',
    amount: { value: 2 },
  };

const purchasedMineralSupplementMethod2: PurchasedMineralSupplementMethod2Input =
  {
    amount: { value: 2 },
    customEmissionsFactor: { value: 0.5 },
  };

const otherPurchasedGoodOrService: OtherPurchasedGoodOrServiceInput = {
  quantity: { value: 10 },
  emissionsFactor: { value: 1.5 },
};

// -------- Agrichemicals --------

const chemicalMethod1: AgrichemicalInput = {
  type: 'Herbicide (paraquat, diquat, glyphosate)',
  amountKg: { value: 50 },
};

const chemicalMethod2: AgrichemicalInput = {
  ...chemicalMethod1,
  customEmissionsFactor: { value: 10 },
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

// -------- Fertiliser --------

const inorganicFertiliserComponent: InorganicFertiliserComponentInput = {
  componentType: 'Urea',
  componentOrigin: 'China',
  fractionOfFertiliser: { value: 1 },
};

const inorganicFertiliserMethod1: InorganicFertiliserInputScope3Method1 = {
  calculationMethodScope3: '1',
  fertiliserType: 'Urea',
  massAppliedKg: { value: 1000 },
  components: [inorganicFertiliserComponent],
};

const inorganicFertilisersMethod1: InorganicFertilisersScope1Method1Input = {
  calculationMethodScope1: '1',
  applications: [inorganicFertiliserMethod1],
};

const inorganicFertiliserMethod2: InorganicFertiliserScope1Method2Input = {
  calculationMethodScope3: '2',
  fertiliserType: 'Urea',
  areaAppliedHectares: { value: 20 },
  massAppliedKg: { value: 1000 },
  customScope3EmissionFactor: { value: 2.5 },
  customNitrogenFraction: { value: 0.46 },
};

const inorganicFertilisersMethod2: InorganicFertilisersScope1Method2Input = {
  calculationMethodScope1: '2',
  applications: [inorganicFertiliserMethod2],
};

const feedlotManureGroupManureAllocations: FeedlotManureGroupManureAllocationsInput =
  {
    solidStorage: { value: 0.5 },
    composting: { value: 0.3 },
    directApplication: { value: 0.2 },
  };

const feedlotManureGroupMethod1: FeedlotManureGroupInput = {
  head: { value: 500 },
  averageLengthOfStayDays: { value: 90 },
  manureAllocations: feedlotManureGroupManureAllocations,
};

const feedlotManureGroupMethod2: FeedlotManureGroupInput = {
  ...feedlotManureGroupMethod1,
  method2DryMatterIntake: { value: 10 },
  method2CrudeProtein: { value: 0.14 },
  method2NitrogenRetentionRate: { value: 0.1 },
};

const feedlotManureMethod1: FeedlotManureInput = {
  type: 'feedlot',
  groups: [feedlotManureGroupMethod1],
  fractionAppliedToSoils: { value: 0.5 },
};

const feedlotManureMethod2: FeedlotManureInput = {
  ...feedlotManureMethod1,
  groups: [feedlotManureGroupMethod2],
};

const organicFertiliserOriginMethod1: OrganicFertiliserTracedInput = {
  origin: 'Traced',
  details: feedlotManureMethod1,
};

const organicFertiliserOriginMethod2: OrganicFertiliserTracedInput = {
  origin: 'Traced',
  details: feedlotManureMethod2,
};

const organicFertiliserMethod1: OrganicFertiliserInput = {
  origin: organicFertiliserOriginMethod1,
};

const organicFertiliserMethod2: OrganicFertiliserInput = {
  origin: organicFertiliserOriginMethod2,
};

const organicFertilisersMethod1: OrganicFertilisersInput = {
  applications: [organicFertiliserMethod1],
};

const organicFertilisersMethod2: OrganicFertilisersInput = {
  applications: [organicFertiliserMethod2],
};

const fertiliserMethod1: FertiliserInputInorganicScope1Method1 = {
  productionSystem: 'Non-irrigated pasture',
  inorganic: inorganicFertilisersMethod1,
  organic: organicFertilisersMethod1,
};

const fertiliserMethod2: FertiliserInputInorganicScope1Method2 = {
  productionSystem: 'Non-irrigated crop (high rainfall)',
  inorganic: inorganicFertilisersMethod2,
  organic: organicFertilisersMethod2,
};

// -------- Flocks --------

const flockMethod1: SheepFlockInput = {
  id: 'sheep-flock-method-1',
  electricityAllocation: { value: 1 },
  classes: classesMethod1,
  state: 'NSW',
  excludedFromNaturalWater: false,
  isInLeachingZone: true,
  climateZone: 'Warm temperate moist',
  grazingSystem: 'Non-irrigated pasture',
  liveweightSoldKg: { value: 60000 },
  lime: limeMethod1,
  pasture: pastureMethod1,
  fuel,
  waste: wasteMethod1,
  purchasedLivestock: [purchasedLivestockMethod1],
  purchasedFeed: [purchasedFeedMethod1],
  purchasedMineralSupplements: [purchasedMineralSupplementMethod1],
  chemicals: [chemicalMethod1],
  services,
  otherPurchasedGoodsAndServices: [otherPurchasedGoodOrService],
  fertiliser: fertiliserMethod1,
};

const flockMethod2: SheepFlockInput = {
  ...flockMethod1,
  id: 'sheep-flock-method-2',
  classes: classesMethod2,
  method2MeanAnnualTemperature: '17',
  lime: limeMethod2,
  pasture: pastureMethod2,
  waste: wasteMethod2,
  purchasedLivestock: [purchasedLivestockMethod2],
  purchasedFeed: [purchasedFeedMethod2],
  purchasedMineralSupplements: [purchasedMineralSupplementMethod2],
  chemicals: [chemicalMethod2],
  fertiliser: fertiliserMethod2,
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

export const sheepInputDataMethod1: SheepInput = {
  electricity: electricityMethod1,
  flocks: [flockMethod1],
  isFebruaryInLeapYear: false,
  landUse: landUseMethod1,
};

export const sheepInputDataMethod2: SheepInput = {
  electricity: electricityMethod2,
  flocks: [flockMethod2],
  isFebruaryInLeapYear: false,
  landUse: landUseMethod2,
};
