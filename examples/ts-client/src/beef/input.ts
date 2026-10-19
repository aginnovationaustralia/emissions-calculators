import {
  AgrichemicalInput,
  BeefCalfClassPeriodInput,
  BeefCalfClassSeasonalInput,
  BeefClassPeriodInput,
  BeefClassPeriodWithCalvesInput,
  BeefClassesSeasonalInput,
  BeefClassSeasonalInput,
  BeefClassWithCalvesSeasonalInput,
  BeefHerdInput,
  BeefInput,
  BeefPurchasedLivestockInput,
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
} from '@aginnovationaustralia/emissions-calculators/beef';

// These examples build two BeefInput objects with one entry in every array:
//
// - `beefInputDataMethod1` uses only method 1 inputs. Every optional method 2 key is left
//   out, and wherever there is a choice of method the method 1 alternative is used.
// - `beefInputDataMethod2` uses method 2 inputs wherever they are available, and
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
  electricityPurchasedKWh: { value: 30000, quality },
  region: 'QLD',
};

const electricityMethod2: MarketBasedElectricityInputs = {
  method: 'market',
  electricityPurchasedKWh: { value: 30000, quality },
  recsSurrendered: { value: 5 },
  recsOnsite: { value: 2 },
  region: 'QLD',
};

// -------- Classes --------

const classPeriodMethod1: BeefClassPeriodInput = {
  head: { value: 100, quality },
};

const classPeriodMethod2: BeefClassPeriodInput = {
  ...classPeriodMethod1,
  method2Liveweight: { value: 450 },
  method2LiveweightGain: { value: 0.5 },
  method2DurationDays: { value: 91 },
  method2DryMatterIntake: { value: 9 },
  method2DryMatterDigestibility: { value: 0.65 },
  method2CrudeProteinContent: { value: 0.12 },
};

const calfClassPeriodMethod1: BeefCalfClassPeriodInput = {
  ...classPeriodMethod1,
  proportionCalvesBornThisSeason: { value: 0.6 },
  proportionCalvesBornPreviousSeason: { value: 0.4 },
};

const calfClassPeriodMethod2: BeefCalfClassPeriodInput = {
  ...calfClassPeriodMethod1,
  ...classPeriodMethod2,
};

const classWithCalvesPeriodMethod1: BeefClassPeriodWithCalvesInput = {
  ...classPeriodMethod1,
  proportionCowsThisSeasonInCalf: { value: 0.3 },
  proportionCowsPreviousSeasonInCalf: { value: 0.2 },
};

const classWithCalvesPeriodMethod2: BeefClassPeriodWithCalvesInput = {
  ...classWithCalvesPeriodMethod1,
  ...classPeriodMethod2,
};

const classMethod1: BeefClassSeasonalInput = {
  spring: classPeriodMethod1,
  summer: classPeriodMethod1,
  autumn: classPeriodMethod1,
  winter: classPeriodMethod1,
};

const classMethod2: BeefClassSeasonalInput = {
  spring: classPeriodMethod2,
  summer: classPeriodMethod2,
  autumn: classPeriodMethod2,
  winter: classPeriodMethod2,
};

const calfClassMethod1: BeefCalfClassSeasonalInput = {
  spring: calfClassPeriodMethod1,
  summer: calfClassPeriodMethod1,
  autumn: calfClassPeriodMethod1,
  winter: calfClassPeriodMethod1,
};

const calfClassMethod2: BeefCalfClassSeasonalInput = {
  spring: calfClassPeriodMethod2,
  summer: calfClassPeriodMethod2,
  autumn: calfClassPeriodMethod2,
  winter: calfClassPeriodMethod2,
};

const classWithCalvesMethod1: BeefClassWithCalvesSeasonalInput = {
  spring: classWithCalvesPeriodMethod1,
  summer: classWithCalvesPeriodMethod1,
  autumn: classWithCalvesPeriodMethod1,
  winter: classWithCalvesPeriodMethod1,
};

const classWithCalvesMethod2: BeefClassWithCalvesSeasonalInput = {
  spring: classWithCalvesPeriodMethod2,
  summer: classWithCalvesPeriodMethod2,
  autumn: classWithCalvesPeriodMethod2,
  winter: classWithCalvesPeriodMethod2,
};

const classesMethod1: BeefClassesSeasonalInput = {
  period: 'seasonal',
  bullsLt1: calfClassMethod1,
  bullsGt1: classMethod1,
  cowsLt1: calfClassMethod1,
  cows1To2Years: classWithCalvesMethod1,
  cows2To3Years: classWithCalvesMethod1,
  cowsGt3Years: classWithCalvesMethod1,
  steersLt1: calfClassMethod1,
  steers1To2Years: classMethod1,
  steers2To3Years: classMethod1,
  steersGt3Years: classMethod1,
};

const classesMethod2: BeefClassesSeasonalInput = {
  period: 'seasonal',
  bullsLt1: calfClassMethod2,
  bullsGt1: classMethod2,
  cowsLt1: calfClassMethod2,
  cows1To2Years: classWithCalvesMethod2,
  cows2To3Years: classWithCalvesMethod2,
  cowsGt3Years: classWithCalvesMethod2,
  steersLt1: calfClassMethod2,
  steers1To2Years: classMethod2,
  steers2To3Years: classMethod2,
  steersGt3Years: classMethod2,
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
  averageYieldPerHectare: { value: 2 },
};

const pastureMethod1: PastureResidueInput = {
  type: 'Grass clover mixture',
  areaManaged: { value: 500 },
  fractionOfAnnualCropBurnt: { value: 0 },
  residues: pastureResiduesMethod1,
};

const pastureMethod2: PastureResidueInput = {
  ...pastureMethod1,
  residues: pastureResiduesMethod2,
};

// -------- Purchases --------

const purchasedLivestockMethod1: BeefPurchasedLivestockInput = {
  type: 'Beef',
  headPurchased: { value: 20 },
  category: 'beefWeaned',
  region: 'ACT/NSW',
  class: 'steersLt1',
  season: 'spring',
};

const purchasedLivestockMethod2: BeefPurchasedLivestockInput = {
  type: 'Beef',
  headPurchased: { value: 20 },
  emissionFactorMethod2: { value: 5 },
  liveweightMethod2: { value: 250 },
};

const purchasedFeedMethod1: PurchasedFeedAustralianInput = {
  type: 'Barley grain',
  region: 'Australia',
  amount: { value: 10 },
};

const purchasedFeedMethod2: PurchasedFeedMethod2Input = {
  amount: { value: 10 },
  customEmissionsFactor: { value: 0.3 },
};

const purchasedMineralSupplementMethod1: PurchasedMineralSupplementMethod1Input =
  {
    type: 'Lick block, weaner',
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

// -------- Herds --------

const herdMethod1: BeefHerdInput = {
  id: 'beef-herd-method-1',
  electricityAllocation: { value: 1 },
  region: 'QLD - Moderate/High',
  classes: classesMethod1,
  breed: 'Northern Brahman cross breed',
  grazingSystem: 'Non-irrigated pasture',
  climateZone: 'Warm temperate moist',
  isInLeachingZone: false,
  excludedFromNaturalWater: false,
  liveweightSoldKg: { value: 200000 },
  fuel,
  lime: limeMethod1,
  pasture: pastureMethod1,
  purchasedLivestock: [purchasedLivestockMethod1],
  purchasedFeed: [purchasedFeedMethod1],
  purchasedMineralSupplements: [purchasedMineralSupplementMethod1],
  chemicals: [chemicalMethod1],
  services,
  otherPurchasedGoodsAndServices: [otherPurchasedGoodOrService],
  waste: wasteMethod1,
  fertiliser: fertiliserMethod1,
};

const herdMethod2: BeefHerdInput = {
  ...herdMethod1,
  id: 'beef-herd-method-2',
  classes: classesMethod2,
  method2MeanAnnualTemperature: '22',
  lime: limeMethod2,
  pasture: pastureMethod2,
  purchasedLivestock: [purchasedLivestockMethod2],
  purchasedFeed: [purchasedFeedMethod2],
  purchasedMineralSupplements: [purchasedMineralSupplementMethod2],
  chemicals: [chemicalMethod2],
  waste: wasteMethod2,
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
  cropType: 'Oranges',
  plantings: [perennialCropPlanting],
  clearings: [perennialCropClearingMethod1],
};

const perennialCropMethod2: PerennialCropFullMethod2StemDensityInput = {
  calculationMethod: '2 (stem density)',
  cropType: 'Oranges',
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

export const beefInputDataMethod1: BeefInput = {
  electricity: electricityMethod1,
  herds: [herdMethod1],
  isFebruaryInLeapYear: false,
  landUse: landUseMethod1,
};

export const beefInputDataMethod2: BeefInput = {
  electricity: electricityMethod2,
  herds: [herdMethod2],
  isFebruaryInLeapYear: false,
  landUse: landUseMethod2,
};
