import {
  AgrichemicalInput,
  AllModulesBeefInput,
  AllModulesCropInput,
  AllModulesFertiliserInput,
  AllModulesFuelInput,
  AllModulesInput,
  AllModulesPastureInput,
  AllModulesRiceInput,
  AllModulesServicesInput,
  AllModulesSheepInput,
  AquacultureSystemInput,
  BeefCalfClassPeriodInput,
  BeefCalfClassSeasonalInput,
  BeefClassesSeasonalInput,
  BeefClassPeriodInput,
  BeefClassPeriodWithCalvesInput,
  BeefClassSeasonalInput,
  BeefClassWithCalvesSeasonalInput,
  BeefPurchasedLivestockInput,
  BurningInput,
  CarbonMassOfWoodProductsFromFullCAMInput,
  CarbonMassOfWoodProductsFromRecordsInput,
  CropResidueInput,
  CropResiduesInput,
  DairyClassesInput,
  DairyClassInput,
  DairyHerdLivestockInput,
  DairyManureAllocationsInput,
  DairyMilkSolidsInput,
  DairyMilkVolumeInput,
  DairyMMSAllocationInner,
  DairyTimeSpentInLocationsInput,
  FarmForestryInput,
  FeedlotGroupLivestockInput,
  FeedlotGroupManureAllocationsInput,
  FeedlotLotLivestockInput,
  FeedlotManureGroupInput,
  FeedlotManureGroupManureAllocationsInput,
  FeedlotManureInput,
  FertiliserInputInorganicScope1Method1,
  FertiliserInputInorganicScope1Method2,
  FreightMethod1Input,
  FreightMethod2Input,
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
  OrganicFertilisersInput,
  OrganicFertiliserTracedInput,
  OtherLivestockClassInput,
  OtherLivestockManureAndEntericHerdInput,
  OtherPurchasedGoodOrServiceInput,
  PastureResidueInput,
  PastureResiduesInput,
  PerennialCropClearingMethod1Input,
  PerennialCropClearingMethod2Input,
  PerennialCropFullMethod2StemDensityInput,
  PerennialCropMethod1Input,
  PerennialCropPlantingInput,
  PigsAnaerobicLagoonAllocationInput,
  PigsAnaerobicLagoonTreatmentStage2AllocationsInput,
  PigsClassLivestockInput,
  PigsClassManureAllocationLivestockInput,
  PigsDeepLitterAllocationInput,
  PigsDeepLitterTreatmentStage2AllocationsInput,
  PigsDigesterAllocationInput,
  PigsDigesterTreatmentStage2AllocationsInput,
  PigsHerdClassesLivestockInput,
  PigsHerdLivestockInput,
  PigsPitStorageAllocationInput,
  PigsPitStorageTreatmentStage2AllocationsInput,
  PigsSolidStorageAllocationInput,
  PigsSolidStorageTreatmentStage2AllocationsInput,
  PoultryClassesLivestockInput,
  PoultryClassInput,
  PoultryFlockLivestockInput,
  PoultryMMS2AllocationInput,
  PoultryMMSAllocationInput,
  PurchasedFeedAustralianInput,
  PurchasedFeedMethod2Input,
  PurchasedMineralSupplementMethod1Input,
  PurchasedMineralSupplementMethod2Input,
  PurchasedPackagingByUnitsMethod1Input,
  PurchasedPackagingByUnitsMethod2Input,
  QualityTable,
  RefrigerantInput,
  RiceCropInput,
  RiceCropResiduesInput,
  RiceCultivationOrganicAmendmentInput,
  SheepClassesSeasonalInput,
  SheepClassPeriodInput,
  SheepClassSeasonalInput,
  SheepClassWithLambingPeriodInput,
  SheepClassWithLambingSeasonalInput,
  SheepClassWithProportionLambsBornPeriodInput,
  SheepClassWithProportionLambsBornSeasonalInput,
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
} from '@aginnovationaustralia/emissions-calculators/all-modules';

// These examples build two AllModulesInput objects with one entry in every array:
//
// - `allModulesInputDataMethod1` uses only method 1 inputs. Every optional method 2 key
//   is left out, and wherever there is a choice of method the method 1 alternative is
//   used.
// - `allModulesInputDataMethod2` uses method 2 inputs wherever they are available, and
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

// -------- Beef --------

const beefClassPeriodMethod1: BeefClassPeriodInput = {
  head: { value: 100, quality },
};

const beefClassPeriodMethod2: BeefClassPeriodInput = {
  ...beefClassPeriodMethod1,
  method2Liveweight: { value: 450 },
  method2LiveweightGain: { value: 0.5 },
  method2DurationDays: { value: 91 },
  method2DryMatterIntake: { value: 9 },
  method2DryMatterDigestibility: { value: 0.65 },
  method2CrudeProteinContent: { value: 0.12 },
};

const beefCalfClassPeriodMethod1: BeefCalfClassPeriodInput = {
  ...beefClassPeriodMethod1,
  proportionCalvesBornThisSeason: { value: 0.6 },
  proportionCalvesBornPreviousSeason: { value: 0.4 },
};

const beefCalfClassPeriodMethod2: BeefCalfClassPeriodInput = {
  ...beefCalfClassPeriodMethod1,
  ...beefClassPeriodMethod2,
};

const beefClassWithCalvesPeriodMethod1: BeefClassPeriodWithCalvesInput = {
  ...beefClassPeriodMethod1,
  proportionCowsThisSeasonInCalf: { value: 0.3 },
  proportionCowsPreviousSeasonInCalf: { value: 0.2 },
};

const beefClassWithCalvesPeriodMethod2: BeefClassPeriodWithCalvesInput = {
  ...beefClassWithCalvesPeriodMethod1,
  ...beefClassPeriodMethod2,
};

const beefClassMethod1: BeefClassSeasonalInput = {
  spring: beefClassPeriodMethod1,
  summer: beefClassPeriodMethod1,
  autumn: beefClassPeriodMethod1,
  winter: beefClassPeriodMethod1,
};

const beefClassMethod2: BeefClassSeasonalInput = {
  spring: beefClassPeriodMethod2,
  summer: beefClassPeriodMethod2,
  autumn: beefClassPeriodMethod2,
  winter: beefClassPeriodMethod2,
};

const beefCalfClassMethod1: BeefCalfClassSeasonalInput = {
  spring: beefCalfClassPeriodMethod1,
  summer: beefCalfClassPeriodMethod1,
  autumn: beefCalfClassPeriodMethod1,
  winter: beefCalfClassPeriodMethod1,
};

const beefCalfClassMethod2: BeefCalfClassSeasonalInput = {
  spring: beefCalfClassPeriodMethod2,
  summer: beefCalfClassPeriodMethod2,
  autumn: beefCalfClassPeriodMethod2,
  winter: beefCalfClassPeriodMethod2,
};

const beefClassWithCalvesMethod1: BeefClassWithCalvesSeasonalInput = {
  spring: beefClassWithCalvesPeriodMethod1,
  summer: beefClassWithCalvesPeriodMethod1,
  autumn: beefClassWithCalvesPeriodMethod1,
  winter: beefClassWithCalvesPeriodMethod1,
};

const beefClassWithCalvesMethod2: BeefClassWithCalvesSeasonalInput = {
  spring: beefClassWithCalvesPeriodMethod2,
  summer: beefClassWithCalvesPeriodMethod2,
  autumn: beefClassWithCalvesPeriodMethod2,
  winter: beefClassWithCalvesPeriodMethod2,
};

const beefClassesMethod1: BeefClassesSeasonalInput = {
  period: 'seasonal',
  bullsLt1: beefCalfClassMethod1,
  bullsGt1: beefClassMethod1,
  cowsLt1: beefCalfClassMethod1,
  cows1To2Years: beefClassWithCalvesMethod1,
  cows2To3Years: beefClassWithCalvesMethod1,
  cowsGt3Years: beefClassWithCalvesMethod1,
  steersLt1: beefCalfClassMethod1,
  steers1To2Years: beefClassMethod1,
  steers2To3Years: beefClassMethod1,
  steersGt3Years: beefClassMethod1,
};

const beefClassesMethod2: BeefClassesSeasonalInput = {
  period: 'seasonal',
  bullsLt1: beefCalfClassMethod2,
  bullsGt1: beefClassMethod2,
  cowsLt1: beefCalfClassMethod2,
  cows1To2Years: beefClassWithCalvesMethod2,
  cows2To3Years: beefClassWithCalvesMethod2,
  cowsGt3Years: beefClassWithCalvesMethod2,
  steersLt1: beefCalfClassMethod2,
  steers1To2Years: beefClassMethod2,
  steers2To3Years: beefClassMethod2,
  steersGt3Years: beefClassMethod2,
};

const beefMethod1: AllModulesBeefInput = {
  region: 'NSW',
  classes: beefClassesMethod1,
  breed: 'Hereford or Shorthorn',
  grazingSystem: 'Non-irrigated pasture',
  climateZone: 'Warm temperate moist',
  isInLeachingZone: true,
  excludedFromNaturalWater: false,
  isFebruaryInLeapYear: false,
};

const beefMethod2: AllModulesBeefInput = {
  ...beefMethod1,
  classes: beefClassesMethod2,
  method2MeanAnnualTemperature: '18',
};

// -------- Dairy --------

const dairyClassMethod1: DairyClassInput = {
  head: { value: 200 },
};

const dairyClassMethod2: DairyClassInput = {
  ...dairyClassMethod1,
  method2Liveweight: { value: 550 },
  method2LiveweightGain: { value: 0.2 },
  method2DurationDays: { value: 365 },
  method2DryMatterDigestibility: { value: 0.7 },
  method2CrudeProtein: { value: 0.18 },
};

const dairyClassesMethod1: DairyClassesInput = {
  milkingCows: dairyClassMethod1,
  heifersGt1: dairyClassMethod1,
  heifersLt1PreWeaned: dairyClassMethod1,
  heifersLt1Weaned: dairyClassMethod1,
  bullsGt1: dairyClassMethod1,
  bullsLt1PreWeaned: dairyClassMethod1,
  bullsLt1Weaned: dairyClassMethod1,
};

const dairyClassesMethod2: DairyClassesInput = {
  milkingCows: dairyClassMethod2,
  heifersGt1: dairyClassMethod2,
  heifersLt1PreWeaned: dairyClassMethod2,
  heifersLt1Weaned: dairyClassMethod2,
  bullsGt1: dairyClassMethod2,
  bullsLt1PreWeaned: dairyClassMethod2,
  bullsLt1Weaned: dairyClassMethod2,
};

const dairyMilkProductionMethod1: DairyMilkVolumeInput = {
  litresPerHeadPerDay: { value: 25 },
};

const dairyMilkProductionMethod2: DairyMilkSolidsInput = {
  kgSolidsPerHeadPerDay: { value: 2 },
  fatContent: { value: 4.2 },
  proteinContent: { value: 3.4 },
};

const dairyMMSAllocation: DairyMMSAllocationInner = {
  anaerobicLagoon: { value: 0.4 },
  sumpDispersal: { value: 0.3 },
  drainToPaddock: { value: 0.2 },
  solidStorage: { value: 0.1 },
};

const dairyManureAllocationsMethod1: DairyManureAllocationsInput = {
  milkingShedMMSAllocation: dairyMMSAllocation,
  feedPadMMSAllocation: dairyMMSAllocation,
  solidsSeparatedPreTreatment: true,
};

const dairyManureAllocationsMethod2: DairyManureAllocationsInput = {
  milkingShedMMSAllocation: dairyMMSAllocation,
  feedPadMMSAllocation: dairyMMSAllocation,
  fractionSolidsSeparatedPreTreatment: { value: 0.1 },
};

const dairyTimeSpentInLocations: DairyTimeSpentInLocationsInput = {
  timeSpentOnPasture: { value: 0.8 },
  timeSpentOnFeedpad: { value: 0.1 },
  timeSpentOnMilkingShed: { value: 0.1 },
};

const dairyMethod1: DairyHerdLivestockInput = {
  classes: dairyClassesMethod1,
  milkProduction: dairyMilkProductionMethod1,
  breed: 'Holstein-Friesian',
  manureAllocations: dairyManureAllocationsMethod1,
  system: 'Limited feedpad',
  isInLeachingZone: true,
  grazingSystem: 'Irrigated pasture',
  climateZone: 'Warm temperate moist',
  state: 'VIC',
};

const dairyMethod2: DairyHerdLivestockInput = {
  classes: dairyClassesMethod2,
  milkProduction: dairyMilkProductionMethod2,
  breed: 'Holstein-Friesian',
  manureAllocations: dairyManureAllocationsMethod2,
  method2TimeSpentInLocations: dairyTimeSpentInLocations,
  isInLeachingZone: true,
  method2MeanAnnualTemperature: '16',
  grazingSystem: 'Irrigated pasture',
  climateZone: 'Warm temperate moist',
  state: 'VIC',
};

// -------- Sheep --------

const sheepClassPeriodMethod1: SheepClassPeriodInput = {
  head: { value: 500 },
};

const sheepClassPeriodMethod2: SheepClassPeriodInput = {
  ...sheepClassPeriodMethod1,
  method2Liveweight: { value: 60 },
  method2LiveweightGain: { value: 0.1 },
  method2DryMatterAvailability: { value: 2 },
  method2DryMatterDigestibility: { value: 0.6 },
  method2AverageDurationDays: { value: 91 },
  method2CrudeProteinContent: { value: 0.15 },
};

const sheepClassWithLambingPeriodMethod1: SheepClassWithLambingPeriodInput = {
  ...sheepClassPeriodMethod1,
  percentLambing: { value: 90 },
  percentLambMarking: { value: 85 },
};

const sheepClassWithLambingPeriodMethod2: SheepClassWithLambingPeriodInput = {
  ...sheepClassWithLambingPeriodMethod1,
  ...sheepClassPeriodMethod2,
};

const sheepClassWithProportionLambsBornPeriodMethod1: SheepClassWithProportionLambsBornPeriodInput =
  {
    ...sheepClassPeriodMethod1,
    proportionOfLambsBorn: { value: 0.25 },
  };

const sheepClassWithProportionLambsBornPeriodMethod2: SheepClassWithProportionLambsBornPeriodInput =
  {
    ...sheepClassWithProportionLambsBornPeriodMethod1,
    ...sheepClassPeriodMethod2,
  };

const sheepClassMethod1: SheepClassSeasonalInput = {
  greasyWoolProduction: { value: 5 },
  cleanWoolYieldProportion: { value: 0.65 },
  spring: sheepClassPeriodMethod1,
  summer: sheepClassPeriodMethod1,
  autumn: sheepClassPeriodMethod1,
  winter: sheepClassPeriodMethod1,
};

const sheepClassMethod2: SheepClassSeasonalInput = {
  ...sheepClassMethod1,
  spring: sheepClassPeriodMethod2,
  summer: sheepClassPeriodMethod2,
  autumn: sheepClassPeriodMethod2,
  winter: sheepClassPeriodMethod2,
};

const sheepClassWithLambingMethod1: SheepClassWithLambingSeasonalInput = {
  greasyWoolProduction: { value: 5 },
  cleanWoolYieldProportion: { value: 0.65 },
  spring: sheepClassWithLambingPeriodMethod1,
  summer: sheepClassWithLambingPeriodMethod1,
  autumn: sheepClassWithLambingPeriodMethod1,
  winter: sheepClassWithLambingPeriodMethod1,
};

const sheepClassWithLambingMethod2: SheepClassWithLambingSeasonalInput = {
  ...sheepClassWithLambingMethod1,
  spring: sheepClassWithLambingPeriodMethod2,
  summer: sheepClassWithLambingPeriodMethod2,
  autumn: sheepClassWithLambingPeriodMethod2,
  winter: sheepClassWithLambingPeriodMethod2,
};

const sheepClassWithProportionLambsBornMethod1: SheepClassWithProportionLambsBornSeasonalInput =
  {
    greasyWoolProduction: { value: 3 },
    cleanWoolYieldProportion: { value: 0.65 },
    spring: sheepClassWithProportionLambsBornPeriodMethod1,
    summer: sheepClassWithProportionLambsBornPeriodMethod1,
    autumn: sheepClassWithProportionLambsBornPeriodMethod1,
    winter: sheepClassWithProportionLambsBornPeriodMethod1,
  };

const sheepClassWithProportionLambsBornMethod2: SheepClassWithProportionLambsBornSeasonalInput =
  {
    ...sheepClassWithProportionLambsBornMethod1,
    spring: sheepClassWithProportionLambsBornPeriodMethod2,
    summer: sheepClassWithProportionLambsBornPeriodMethod2,
    autumn: sheepClassWithProportionLambsBornPeriodMethod2,
    winter: sheepClassWithProportionLambsBornPeriodMethod2,
  };

const sheepClassesMethod1: SheepClassesSeasonalInput = {
  period: 'seasonal',
  breedingEwes: sheepClassWithLambingMethod1,
  lambsHoggets: sheepClassWithProportionLambsBornMethod1,
  maidenEwes: sheepClassWithLambingMethod1,
  otherEwes: sheepClassMethod1,
  rams: sheepClassMethod1,
  wethers: sheepClassMethod1,
};

const sheepClassesMethod2: SheepClassesSeasonalInput = {
  period: 'seasonal',
  breedingEwes: sheepClassWithLambingMethod2,
  lambsHoggets: sheepClassWithProportionLambsBornMethod2,
  maidenEwes: sheepClassWithLambingMethod2,
  otherEwes: sheepClassMethod2,
  rams: sheepClassMethod2,
  wethers: sheepClassMethod2,
};

const sheepMethod1: AllModulesSheepInput = {
  classes: sheepClassesMethod1,
  state: 'NSW',
  excludedFromNaturalWater: false,
  isInLeachingZone: true,
  climateZone: 'Warm temperate moist',
  grazingSystem: 'Non-irrigated pasture',
  isFebruaryInLeapYear: false,
};

const sheepMethod2: AllModulesSheepInput = {
  ...sheepMethod1,
  classes: sheepClassesMethod2,
  method2MeanAnnualTemperature: '17',
};

// -------- Pigs --------

const pigsSolidStorageTreatmentStage2Allocations: PigsSolidStorageTreatmentStage2AllocationsInput =
  {
    directApplication: { value: 1 },
    anaerobicLagoon: { value: 0 },
    digester: { value: 0 },
    pitStorage: { value: 0 },
  };

const pigsSolidStorageAllocation: PigsSolidStorageAllocationInput = {
  manureAllocated: { value: 0.1 },
  treatmentStage2Allocations: pigsSolidStorageTreatmentStage2Allocations,
};

const pigsDeepLitterTreatmentStage2Allocations: PigsDeepLitterTreatmentStage2AllocationsInput =
  {
    directApplication: { value: 0 },
    anaerobicLagoon: { value: 0 },
    digester: { value: 0 },
    pitStorage: { value: 0 },
    solidStorage: { value: 1 },
  };

const pigsDeepLitterAllocation: PigsDeepLitterAllocationInput = {
  manureAllocated: { value: 0.2 },
  treatmentStage2Allocations: pigsDeepLitterTreatmentStage2Allocations,
};

const pigsAnaerobicLagoonTreatmentStage2Allocations: PigsAnaerobicLagoonTreatmentStage2AllocationsInput =
  {
    directApplication: { value: 0 },
    digester: { value: 0 },
    pitStorage: { value: 0 },
    solidStorage: { value: 1 },
  };

const pigsAnaerobicLagoonAllocationMethod1: PigsAnaerobicLagoonAllocationInput =
  {
    manureAllocated: { value: 0.3 },
    treatmentStage2Allocations: pigsAnaerobicLagoonTreatmentStage2Allocations,
    solidsSeparatedPreTreatment: true,
  };

const pigsAnaerobicLagoonAllocationMethod2: PigsAnaerobicLagoonAllocationInput =
  {
    manureAllocated: { value: 0.3 },
    treatmentStage2Allocations: pigsAnaerobicLagoonTreatmentStage2Allocations,
    fractionNitrogenSeparatedPreTreatment: { value: 0.1 },
    fractionSolidsSeparatedPreTreatment: { value: 0.2 },
  };

const pigsDigesterTreatmentStage2Allocations: PigsDigesterTreatmentStage2AllocationsInput =
  {
    directApplication: { value: 0 },
    anaerobicLagoon: { value: 1 },
    pitStorage: { value: 0 },
    solidStorage: { value: 0 },
  };

const pigsDigesterAllocationMethod1: PigsDigesterAllocationInput = {
  manureAllocated: { value: 0.2 },
  treatmentStage2Allocations: pigsDigesterTreatmentStage2Allocations,
  solidsSeparatedPreTreatment: false,
};

const pigsDigesterAllocationMethod2: PigsDigesterAllocationInput = {
  manureAllocated: { value: 0.2 },
  treatmentStage2Allocations: pigsDigesterTreatmentStage2Allocations,
  fractionNitrogenSeparatedPreTreatment: { value: 0.1 },
  fractionSolidsSeparatedPreTreatment: { value: 0.2 },
};

const pigsPitStorageTreatmentStage2Allocations: PigsPitStorageTreatmentStage2AllocationsInput =
  {
    directApplication: { value: 0 },
    anaerobicLagoon: { value: 0 },
    digester: { value: 0 },
    solidStorage: { value: 1 },
  };

const pigsPitStorageAllocationMethod1: PigsPitStorageAllocationInput = {
  manureAllocated: { value: 0.1 },
  treatmentStage2Allocations: pigsPitStorageTreatmentStage2Allocations,
  solidsSeparatedPreTreatment: false,
};

const pigsPitStorageAllocationMethod2: PigsPitStorageAllocationInput = {
  manureAllocated: { value: 0.1 },
  treatmentStage2Allocations: pigsPitStorageTreatmentStage2Allocations,
  fractionNitrogenSeparatedPreTreatment: { value: 0.1 },
  fractionSolidsSeparatedPreTreatment: { value: 0.2 },
};

const pigsManureAllocationsMethod1: PigsClassManureAllocationLivestockInput = {
  outdoorAndFreeRange: { value: 0.1 },
  solidStorage: pigsSolidStorageAllocation,
  deepLitter: pigsDeepLitterAllocation,
  anaerobicLagoon: pigsAnaerobicLagoonAllocationMethod1,
  digester: pigsDigesterAllocationMethod1,
  pitStorage: pigsPitStorageAllocationMethod1,
};

const pigsManureAllocationsMethod2: PigsClassManureAllocationLivestockInput = {
  outdoorAndFreeRange: { value: 0.1 },
  solidStorage: pigsSolidStorageAllocation,
  deepLitter: pigsDeepLitterAllocation,
  anaerobicLagoon: pigsAnaerobicLagoonAllocationMethod2,
  digester: pigsDigesterAllocationMethod2,
  pitStorage: pigsPitStorageAllocationMethod2,
};

const pigsClassMethod1: PigsClassLivestockInput = {
  head: { value: 1000 },
  days: { value: 365 },
  manureAllocations: pigsManureAllocationsMethod1,
};

const pigsClassMethod2: PigsClassLivestockInput = {
  ...pigsClassMethod1,
  method2NitrogenWasteProductionRate: { value: 0.03 },
  method2AverageFeedIntake: { value: 2.5 },
  method2VolatileSolidProductionRate: { value: 0.3 },
  manureAllocations: pigsManureAllocationsMethod2,
};

const pigsClassesMethod1: PigsHerdClassesLivestockInput = {
  boars: pigsClassMethod1,
  sows: pigsClassMethod1,
  gilts: pigsClassMethod1,
  slaughterPigs: pigsClassMethod1,
};

const pigsClassesMethod2: PigsHerdClassesLivestockInput = {
  boars: pigsClassMethod2,
  sows: pigsClassMethod2,
  gilts: pigsClassMethod2,
  slaughterPigs: pigsClassMethod2,
};

const pigsMethod1: PigsHerdLivestockInput = {
  classes: pigsClassesMethod1,
  isInLeachingZone: false,
  state: 'QLD',
  grazingSystem: 'Non-irrigated pasture',
};

const pigsMethod2: PigsHerdLivestockInput = {
  ...pigsMethod1,
  classes: pigsClassesMethod2,
  method2MeanAnnualTemperature: '22',
};

// -------- Poultry --------

const poultryMMS2Allocation: PoultryMMS2AllocationInput = {
  solidStorage: { value: 0.2 },
  composting: { value: 0.2 },
  digester: { value: 0.2 },
  directProcessing: { value: 0.2 },
  directApplication: { value: 0.2 },
};

const poultryClassManureAllocation: PoultryMMSAllocationInput = {
  manureWithLitter: {
    manureAllocated: { value: 0.4 },
    treatmentStage2Allocations: poultryMMS2Allocation,
  },
  beltManureRemoval: {
    manureAllocated: { value: 0.3 },
    treatmentStage2Allocations: poultryMMS2Allocation,
  },
  manureStoredInHouse: {
    manureAllocated: { value: 0.2 },
    treatmentStage2Allocations: poultryMMS2Allocation,
  },
  pastureRangeAndPaddock: { value: 0.1 },
};

const poultryClassMethod1: PoultryClassInput = {
  head: { value: 20000 },
  days: { value: 365 },
  manureAllocations: poultryClassManureAllocation,
};

const poultryClassMethod2: PoultryClassInput = {
  ...poultryClassMethod1,
  method2DryMatterIntake: { value: 0.1 },
  method2CrudeProtein: { value: 0.2 },
  method2DryMatterDigestibility: { value: 0.8 },
};

const poultryClassesMethod1: PoultryClassesLivestockInput = {
  layers: poultryClassMethod1,
  meatChickenGrowers: poultryClassMethod1,
  meatChickenBreeders: poultryClassMethod1,
  meatOther: poultryClassMethod1,
};

const poultryClassesMethod2: PoultryClassesLivestockInput = {
  layers: poultryClassMethod2,
  meatChickenGrowers: poultryClassMethod2,
  meatChickenBreeders: poultryClassMethod2,
  meatOther: poultryClassMethod2,
};

const poultryMethod1: PoultryFlockLivestockInput = {
  classes: poultryClassesMethod1,
  isInLeachingZone: false,
  state: 'SA',
  climateZone: 'Warm temperate dry',
  grazingSystem: 'Non-irrigated pasture',
};

const poultryMethod2: PoultryFlockLivestockInput = {
  ...poultryMethod1,
  classes: poultryClassesMethod2,
  method2MeanAnnualTemperature: '17',
};

// -------- Other livestock --------

const otherLivestockClass: OtherLivestockClassInput = {
  type: 'Goats',
  head: { value: 50 },
};

const otherLivestockMethod1: OtherLivestockManureAndEntericHerdInput = {
  livestock: [otherLivestockClass],
  excludedFromNaturalWater: false,
  isInLeachingZone: false,
  state: 'WA',
  climateZone: 'Warm temperate dry',
  grazingSystem: 'Non-irrigated pasture',
};

const otherLivestockMethod2: OtherLivestockManureAndEntericHerdInput = {
  ...otherLivestockMethod1,
  method2MeanAnnualTemperature: '19',
};

// -------- Feedlot --------

const feedlotGroupManureAllocations: FeedlotGroupManureAllocationsInput = {
  solidStorage: { value: 0.5 },
  composting: { value: 0.3 },
  directApplication: { value: 0.2 },
};

const feedlotGroupMethod1: FeedlotGroupLivestockInput = {
  head: { value: 1000 },
  averageLengthOfStayDays: { value: 100 },
  manureAllocations: feedlotGroupManureAllocations,
};

const feedlotGroupMethod2: FeedlotGroupLivestockInput = {
  ...feedlotGroupMethod1,
  method2DryMatterIntake: { value: 10 },
  method2CrudeProtein: { value: 0.14 },
  method2NitrogenRetentionRate: { value: 0.1 },
  method2AverageNeutralDetergentFibrePercentage: { value: 30 },
  method2DryMatterDigestibility: { value: 0.75 },
};

const feedlotMethod1: FeedlotLotLivestockInput = {
  groups: [feedlotGroupMethod1],
  state: 'QLD',
  grazingSystem: 'Non-irrigated pasture',
};

const feedlotMethod2: FeedlotLotLivestockInput = {
  ...feedlotMethod1,
  groups: [feedlotGroupMethod2],
  method2MeanAnnualTemperature: '21',
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

const fertiliserDetailsMethod1: FertiliserInputInorganicScope1Method1 = {
  productionSystem: 'Non-irrigated crop (low rainfall)',
  inorganic: inorganicFertilisersMethod1,
  organic: organicFertilisersMethod1,
};

const fertiliserDetailsMethod2: FertiliserInputInorganicScope1Method2 = {
  productionSystem: 'Non-irrigated crop (high rainfall)',
  inorganic: inorganicFertilisersMethod2,
  organic: organicFertilisersMethod2,
};

const fertiliserMethod1: AllModulesFertiliserInput = {
  isInLeachingZone: true,
  climateZone: 'Warm temperate moist',
  fertiliser: fertiliserDetailsMethod1,
};

const fertiliserMethod2: AllModulesFertiliserInput = {
  ...fertiliserMethod1,
  fertiliser: fertiliserDetailsMethod2,
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

// -------- Crop and pasture residues --------

const cropResiduesMethod1: CropResiduesInput = {
  calculationMethod: '1',
};

const cropResiduesMethod2: CropResiduesInput = {
  calculationMethod: '2',
  fractionCropResidueRemoved: { value: 0.2 },
};

const cropResidueMethod1: CropResidueInput = {
  type: 'Wheat',
  totalYieldKg: { value: 300000 },
  fractionOfAnnualCropBurnt: { value: 0 },
  residues: cropResiduesMethod1,
};

const cropResidueMethod2: CropResidueInput = {
  ...cropResidueMethod1,
  residues: cropResiduesMethod2,
};

const cropMethod1: AllModulesCropInput = {
  crop: cropResidueMethod1,
  state: 'NSW',
  climateZone: 'Warm temperate moist',
};

const cropMethod2: AllModulesCropInput = {
  ...cropMethod1,
  crop: cropResidueMethod2,
};

const pastureResiduesMethod1: PastureResiduesInput = {
  calculationMethod: '1',
};

const pastureResiduesMethod2: PastureResiduesInput = {
  calculationMethod: '2',
  averageYieldPerHectare: { value: 2 },
};

const pastureResidueMethod1: PastureResidueInput = {
  type: 'Lucerne',
  areaManaged: { value: 100 },
  fractionOfAnnualCropBurnt: { value: 0 },
  residues: pastureResiduesMethod1,
};

const pastureResidueMethod2: PastureResidueInput = {
  ...pastureResidueMethod1,
  residues: pastureResiduesMethod2,
};

const pastureMethod1: AllModulesPastureInput = {
  pasture: pastureResidueMethod1,
  climateZone: 'Warm temperate moist',
  state: 'NSW',
  isInLeachingZone: true,
};

const pastureMethod2: AllModulesPastureInput = {
  ...pastureMethod1,
  pasture: pastureResidueMethod2,
};

// -------- Rice --------

const riceCropResiduesMethod1: RiceCropResiduesInput = {
  calculationMethod: '1',
};

const riceCropResiduesMethod2: RiceCropResiduesInput = {
  calculationMethod: '2',
  massCropResidueRemoved: { value: 1000 },
};

const riceOrganicAmendment: RiceCultivationOrganicAmendmentInput = {
  type: 'Compost',
  rateOfApplication: { value: 1000 },
};

const riceCropMethod1: RiceCropInput = {
  totalYieldKg: { value: 500000 },
  fractionOfAnnualCropBurnt: { value: 0 },
  residues: riceCropResiduesMethod1,
  areaSown: { value: 50 },
  preSeasonWaterRegimeType: 'Non flooded pre-season <180 days',
  waterRegimeType: 'Continuously flooded',
  organicAmendments: [riceOrganicAmendment],
  cultivationPeriodDays: { value: 150 },
};

const riceCropMethod2: RiceCropInput = {
  ...riceCropMethod1,
  residues: riceCropResiduesMethod2,
};

const riceMethod1: AllModulesRiceInput = {
  crop: riceCropMethod1,
  state: 'NSW',
  climateZone: 'Warm temperate moist',
  isInLeachingZone: true,
};

const riceMethod2: AllModulesRiceInput = {
  ...riceMethod1,
  crop: riceCropMethod2,
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

const fuelUse: FuelInput = {
  transport: [transportFuel],
  stationary: [stationaryFuel],
};

const fuel: AllModulesFuelInput = {
  state: 'NSW',
  fuel: fuelUse,
};

const services: AllModulesServicesInput = {
  state: 'NSW',
  fuel: fuelUse,
};

// -------- Refrigerants --------

const refrigerant: RefrigerantInput = {
  refrigerant: 'HFC-23 (R-23)',
  chargeSize: { value: 2 },
  refrigerationType: 'Domestic refrigerators',
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
  facilityType: 'Deep anaerobic lagoon',
  wastewaterVolume: { value: 1000 },
  fractionRemoved: { value: 0.1 },
  commodityType: 'Dairy products',
};

const wastewaterMethod2: WastewaterTreatmentMethod2Input = {
  facilityType: 'Deep anaerobic lagoon',
  wastewaterVolume: { value: 1000 },
  fractionRemoved: { value: 0.1 },
  inletCOD: { value: 3 },
  outletCOD: { value: 0.5 },
  fractionSludge: { value: 0.1 },
  methaneCaptured: { value: 0.2 },
  methaneFlared: { value: 0.1 },
  methaneOut: { value: 0.05 },
};

// -------- Electricity --------

const electricityMethod1: LocationBasedElectricityInputs = {
  method: 'location',
  electricityPurchasedKWh: { value: 50000 },
  region: 'NSW',
};

const electricityMethod2: MarketBasedElectricityInputs = {
  method: 'market',
  electricityPurchasedKWh: { value: 50000 },
  recsSurrendered: { value: 10 },
  recsOnsite: { value: 5 },
  region: 'NSW',
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

const purchasedPackagingMethod1: PurchasedPackagingByUnitsMethod1Input = {
  type: '25 kg polypropylene bag',
  amountUnits: { value: 100 },
};

const purchasedPackagingMethod2: PurchasedPackagingByUnitsMethod2Input = {
  amountUnits: { value: 100 },
  customEmissionsFactor: { value: 0.2 },
};

// -------- Freight --------

const freightMethod1: FreightMethod1Input = {
  calculationMethod: '1',
  freightType: 'Truck > 3.5 tonnes non-refrigerated (diesel)',
  distance: { value: 200 },
  weight: { value: 10 },
};

const freightMethod2: FreightMethod2Input = {
  calculationMethod: '2',
  freightType: 'Truck > 3.5 tonnes non-refrigerated (diesel)',
  fuel: transportFuel,
};

// -------- Agrichemicals --------

const chemicalMethod1: AgrichemicalInput = {
  type: 'Insecticide',
  amountKg: { value: 50 },
};

const chemicalMethod2: AgrichemicalInput = {
  ...chemicalMethod1,
  customEmissionsFactor: { value: 10 },
};

// -------- Aquaculture --------

const fishery: AquacultureSystemInput = {
  amountProduced: { value: 1000 },
  location: 'Coastal wetland habitat',
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

export const allModulesInputDataMethod1: AllModulesInput = {
  beef: beefMethod1,
  dairy: dairyMethod1,
  sheep: sheepMethod1,
  pigs: pigsMethod1,
  poultry: poultryMethod1,
  otherLivestock: otherLivestockMethod1,
  feedlot: feedlotMethod1,
  fertiliser: fertiliserMethod1,
  lime: limeMethod1,
  crop: cropMethod1,
  pasture: pastureMethod1,
  rice: riceMethod1,
  fuel,
  services,
  refrigerants: [refrigerant],
  waste: wasteMethod1,
  wastewater: wastewaterMethod1,
  supplementaryCO2Kg: { value: 100 },
  electricity: electricityMethod1,
  purchasedLivestock: [purchasedLivestockMethod1],
  purchasedFeed: [purchasedFeedMethod1],
  purchasedMineralSupplements: [purchasedMineralSupplementMethod1],
  otherPurchasedGoodsAndServices: [otherPurchasedGoodOrService],
  purchasedPackaging: [purchasedPackagingMethod1],
  freight: [freightMethod1],
  chemicals: [chemicalMethod1],
  fishery,
  landUse: landUseMethod1,
};

export const allModulesInputDataMethod2: AllModulesInput = {
  beef: beefMethod2,
  dairy: dairyMethod2,
  sheep: sheepMethod2,
  pigs: pigsMethod2,
  poultry: poultryMethod2,
  otherLivestock: otherLivestockMethod2,
  feedlot: feedlotMethod2,
  fertiliser: fertiliserMethod2,
  lime: limeMethod2,
  crop: cropMethod2,
  pasture: pastureMethod2,
  rice: riceMethod2,
  fuel,
  services,
  refrigerants: [refrigerant],
  waste: wasteMethod2,
  wastewater: wastewaterMethod2,
  supplementaryCO2Kg: { value: 100 },
  electricity: electricityMethod2,
  purchasedLivestock: [purchasedLivestockMethod2],
  purchasedFeed: [purchasedFeedMethod2],
  purchasedMineralSupplements: [purchasedMineralSupplementMethod2],
  otherPurchasedGoodsAndServices: [otherPurchasedGoodOrService],
  purchasedPackaging: [purchasedPackagingMethod2],
  freight: [freightMethod2],
  chemicals: [chemicalMethod2],
  fishery,
  landUse: landUseMethod2,
};
