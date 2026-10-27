import {
  AllModulesInput,
  AllModulesInputSchema,
  AllModulesInputTransformed,
} from '@/calculators/AllModules/types/input';
import { PigsClassManureAllocationLivestockInput } from '@/calculators/Pigs/types/manure-allocations.input';

import { PoultryMMS2AllocationInput } from '@/calculators/Poultry/types/mms-allocation.input';
import { AquacultureSystemInput } from '@/modules/scope1/13-aquatic';
import { FertiliserInput } from '@/modules/scope1/5-fertiliser/fertiliser.input';
import { InorganicFertilisersScope1Method1Input } from '@/modules/scope1/5-fertiliser/inorganic-fertilisers.input';
import { LimeInput } from '@/modules/scope1/5-fertiliser/lime.input';
import { OrganicFertilisersInput } from '@/modules/scope1/5-fertiliser/organic-fertilisers.input';
import {
  CropResidueInput,
  PastureResidueInput,
} from '@/modules/scope1/6-residue-mgmt/crop-residue.input';
import { HasRiceCultivationInput } from '@/modules/scope1/7-rice-cultivation/rice-cultivation.input';
import { FuelInput } from '@/modules/scope1/8-fuel-use';
import { RefrigerantInput } from '@/modules/scope1/9-refrigerant-use/refrigerant.input';
import { DairyMMSAllocationInner } from '@/modules/scope1/shared/dairy/input';
import { HasSolidWasteInput } from '@/modules/scope1/shared/solid-waste/input';
import { PurchasedLivestockInput } from '@/modules/scope3/15.1-purchased-livestock/input';
import { PurchasedFeedMethod2Input } from '@/modules/scope3/15.2-purchased-feed/method2-purchased-feed.input';
import { PurchasedMineralSupplementMethod1Input } from '@/modules/scope3/15.3-purchased-mineral-supplements/method1-purchased-mineral-supplement.input';
import { AgrichemicalInput } from '@/modules/scope3/15.5-agrichemicals/agrichemical.input';
import { nv } from '@/tools/inputs';

// Shared zeroed-out building blocks reused across the many activities that embed the
// same shared modules (fuel, lime, pasture residue, fertiliser, manure allocations,
// etc.), so that every field in a schema can be exercised with the minimal valid
// ("all zero") shape. Kept in one place (rather than scattered next to each schema)
// so tests across the whole package have a single, discoverable source of these
// building blocks instead of re-deriving them.

export const zeroDairyMMSAllocation: DairyMMSAllocationInner = {
  anaerobicLagoon: nv(0),
  sumpDispersal: nv(0),
  drainToPaddock: nv(0),
  solidStorage: nv(0),
};

export const zeroPigsManureAllocation: PigsClassManureAllocationLivestockInput =
  {
    deepLitter: {
      manureAllocated: nv(0),
      treatmentStage2Allocations: {
        directApplication: nv(0),
        anaerobicLagoon: nv(0),
        digester: nv(0),
        pitStorage: nv(0),
        solidStorage: nv(0),
      },
    },
    digester: {
      manureAllocated: nv(0),
      treatmentStage2Allocations: {
        directApplication: nv(0),
        anaerobicLagoon: nv(0),
        pitStorage: nv(0),
        solidStorage: nv(0),
      },
      solidsSeparatedPreTreatment: false,
    },
    pitStorage: {
      manureAllocated: nv(0),
      treatmentStage2Allocations: {
        directApplication: nv(0),
        anaerobicLagoon: nv(0),
        digester: nv(0),
        solidStorage: nv(0),
      },
      solidsSeparatedPreTreatment: false,
    },
    solidStorage: {
      manureAllocated: nv(0),
      treatmentStage2Allocations: {
        directApplication: nv(0),
        anaerobicLagoon: nv(0),
        digester: nv(0),
        pitStorage: nv(0),
      },
    },
    anaerobicLagoon: {
      manureAllocated: nv(0),
      treatmentStage2Allocations: {
        directApplication: nv(0),
        digester: nv(0),
        pitStorage: nv(0),
        solidStorage: nv(0),
      },
      solidsSeparatedPreTreatment: false,
    },
    outdoorAndFreeRange: nv(1),
  };

export const zeroPoultryMMS2Allocation: PoultryMMS2AllocationInput = {
  solidStorage: nv(0),
  composting: nv(0),
  digester: nv(0),
  directProcessing: nv(0),
  directApplication: nv(0),
};

export const zeroFuel: FuelInput = {
  transport: [
    {
      vehicleType: 'Cars and light commercial vehicles',
      fuelType: 'Diesel oil',
      amountKilolitres: nv(0),
    },
  ],
  stationary: [
    {
      fuelClass: 'Gaseous fuels',
      fuelType: 'Natural gas',
      amountKilolitres: nv(0),
    },
  ],
};

export const zeroLime: LimeInput = {
  applications: [
    {
      massAppliedKg: nv(0),
      limestoneFraction: nv(0),
      type: 'Limestone',
    },
  ],
};

export const zeroPastureResidue: PastureResidueInput = {
  type: 'Annual grass',
  areaManaged: nv(0),
  fractionOfAnnualCropBurnt: nv(0),
  residues: { calculationMethod: '1' },
};

export const zeroCropResidue: CropResidueInput = {
  type: 'Wheat',
  totalYieldKg: nv(0),
  fractionOfAnnualCropBurnt: nv(0),
  residues: { calculationMethod: '1' },
};

export const zeroRefrigerants: RefrigerantInput[] = [
  {
    refrigerant: 'R-400 50/50',
    chargeSize: nv(0),
    refrigerationType: 'Domestic refrigerators',
  },
];

export const zeroPurchasedFeed: PurchasedFeedMethod2Input[] = [
  { amount: nv(0), customEmissionsFactor: nv(0) },
];

export const zeroPurchasedMineralSupplements: PurchasedMineralSupplementMethod1Input[] =
  [{ type: 'Lick block, dry season mix', amount: nv(0) }];

export const zeroAgrichemicals: AgrichemicalInput[] = [
  { type: 'Herbicide (paraquat, diquat, glyphosate)', amountKg: nv(0) },
];

export const zeroWaste: HasSolidWasteInput['waste'] = {};

export const zeroInorganicFertiliserMethod1: InorganicFertilisersScope1Method1Input =
  {
    calculationMethodScope1: '1',
    applications: [
      {
        massAppliedKg: nv(0),
        fertiliserType: 'Urea',
        calculationMethodScope3: '1',
      },
    ],
  };

export const zeroOrganicFertiliser: OrganicFertilisersInput = {
  applications: [
    {
      origin: {
        origin: 'Untraced',
        massAppliedKg: nv(0),
        organicFertiliserType: 'Dairy cattle',
      },
    },
  ],
};

export const zeroFertiliser: FertiliserInput = {
  productionSystem: 'Non-irrigated pasture',
  inorganic: zeroInorganicFertiliserMethod1,
  organic: zeroOrganicFertiliser,
};

// Every numeric field on a purchase (headPurchased, and both method 2
// overrides) is constrained to be strictly positive, so unlike the other
// "zero" arrays above there's no populated entry that nets to zero - an
// empty array is the only valid zero representation here.
export const zeroLivestockPurchases: PurchasedLivestockInput[] = [];

export const zeroFishery: AquacultureSystemInput = {
  amountProduced: nv(0),
  location: 'Other',
};

export const zeroRice: HasRiceCultivationInput = {
  crop: {
    totalYieldKg: nv(0),
    fractionOfAnnualCropBurnt: nv(0),
    residues: { calculationMethod: '1' },
    areaSown: nv(0),
    preSeasonWaterRegimeType: 'Non flooded pre-season <180 days',
    waterRegimeType: 'Paddy rotation',
    // Unlike every other zeroed number below, this is enforced to be at least 1 day by
    // the schema, so it can't be zeroed - it has no effect on totals since areaSown and
    // totalYieldKg are both zero.
    cultivationPeriodDays: nv(1),
  },
};

// A single raw AllModulesInput that populates every field in the schema with the
// minimal valid ("all zero") shape: every numeric input is nv(0), every required
// array has exactly one item, and every optional field is omitted.
export const ZERO_ALL_MODULES_INPUT: Required<AllModulesInput> = {
  beef: {
    region: 'NSW',
    classes: {},
    breed: 'Hereford or Shorthorn',
    grazingSystem: 'Non-irrigated pasture',
    climateZone: 'dry',
    isInLeachingZone: false,
    excludedFromNaturalWater: false,
    isFebruaryInLeapYear: false,
  },
  dairy: {
    classes: {},
    // gt(0) is enforced by the schema for milk production, so this cannot be zeroed;
    // it has no effect on totals since `classes` has no milkingCows entry (head count
    // of zero drives every downstream calculation to zero regardless).
    milkProduction: { litresPerHeadPerDay: nv(1) },
    breed: 'Medium Friesian',
    manureAllocations: {
      milkingShedMMSAllocation: zeroDairyMMSAllocation,
      feedPadMMSAllocation: zeroDairyMMSAllocation,
      solidsSeparatedPreTreatment: false,
    },
    grazingSystem: 'Non-irrigated pasture',
    climateZone: 'dry',
    state: 'NSW',
    isInLeachingZone: false,
    system: 'Grazed only',
  },
  sheep: {
    classes: {},
    state: 'NSW',
    excludedFromNaturalWater: false,
    isInLeachingZone: false,
    climateZone: 'dry',
    grazingSystem: 'Non-irrigated pasture',
    isFebruaryInLeapYear: false,
  },
  pigs: {
    state: 'NSW',
    classes: {},
    grazingSystem: 'Non-irrigated pasture',
    isInLeachingZone: false,
  },
  poultry: {
    classes: {},
    isInLeachingZone: false,
    state: 'NSW',
    grazingSystem: 'Non-irrigated pasture',
    climateZone: 'dry',
  },
  otherLivestock: {
    livestock: [{ type: 'Camels', head: nv(0) }],
    excludedFromNaturalWater: false,
    isInLeachingZone: false,
    climateZone: 'dry',
    state: 'NSW',
    grazingSystem: 'Non-irrigated pasture',
  },
  feedlot: {
    groups: [
      {
        head: nv(0),
        averageLengthOfStayDays: nv(0),
        manureAllocations: {
          solidStorage: nv(1),
          composting: nv(0),
          directApplication: nv(0),
        },
      },
    ],
    grazingSystem: 'Non-irrigated pasture',
    state: 'NSW',
  },
  fertiliser: {
    isInLeachingZone: false,
    climateZone: 'dry',
    fertiliser: zeroFertiliser,
  },
  lime: zeroLime,
  crop: {
    crop: zeroCropResidue,
    state: 'NSW',
    climateZone: 'dry',
  },
  pasture: {
    pasture: zeroPastureResidue,
    climateZone: 'dry',
    state: 'NSW',
    isInLeachingZone: false,
  },
  rice: {
    ...zeroRice,
    state: 'NSW',
    climateZone: 'dry',
    isInLeachingZone: false,
  },
  fuel: {
    state: 'NSW',
    fuel: zeroFuel,
  },
  refrigerants: zeroRefrigerants,
  waste: zeroWaste,
  wastewater: {
    facilityType: 'Managed aerobic treatment',
    wastewaterVolume: nv(0),
    inletCOD: nv(0),
    outletCOD: nv(0),
    fractionSludge: nv(0),
    fractionRemoved: nv(0),
    methaneCaptured: nv(0),
    methaneFlared: nv(0),
    methaneOut: nv(0),
  },
  supplementaryCO2Kg: nv(0),
  electricity: {
    method: 'location',
    electricityPurchasedKWh: nv(0),
    region: 'NSW',
  },
  purchasedLivestock: zeroLivestockPurchases,
  purchasedFeed: zeroPurchasedFeed,
  purchasedMineralSupplements: zeroPurchasedMineralSupplements,
  services: {
    state: 'NSW',
    fuel: zeroFuel,
  },
  otherPurchasedGoodsAndServices: [{ quantity: nv(0), emissionsFactor: nv(0) }],
  purchasedPackaging: [
    { type: '1 tonne polypropylene bag', amountUnits: nv(0) },
  ],
  freight: [
    {
      freightType: 'Cargo ship (bulk carrier)',
      distance: nv(0),
      weight: nv(0),
      calculationMethod: '1',
    },
  ],
  chemicals: zeroAgrichemicals,
  fishery: zeroFishery,
  landUse: {
    activities: [
      {
        type: 'revegetationByPlanting',
        activityAreaHectares: nv(0.25),
        carbonMassInTreesCurrentYear: nv(0),
        carbonMassInTreesPreviousYear: nv(0),
        carbonMassInDebrisCurrentYear: nv(0),
        carbonMassInDebrisPreviousYear: nv(0),
      },
    ],
    burning: [],
    perennialCrops: [],
  },
};

// The same all-zero input, parsed into its transformed shape.
export const ZERO_ALL_MODULES_INPUT_TRANSFORMED = AllModulesInputSchema.parse(
  ZERO_ALL_MODULES_INPUT,
) as Required<AllModulesInputTransformed>;
