import {
  BeefHerdInput,
  BeefHerdInputSchema,
  BeefHerdInputTransformed,
} from '@/calculators/Beef/types/beef-herd.input';
import {
  BeefInput,
  BeefInputSchema,
  BeefInputTransformed,
} from '@/calculators/Beef/types/input';
import {
  DairyHerdInput,
  DairyHerdInputSchema,
  DairyHerdInputTransformed,
} from '@/calculators/Dairy/types/herd.input';
import { FeedlotLotInput } from '@/calculators/Feedlot/types/feedlot-lot.input';
import { OtherLivestockHerdInput } from '@/calculators/OtherLivestock/types/herd.input';
import { PigsHerdInput } from '@/calculators/Pigs/types/pigs-herd.input';
import { PoultryFlockInput } from '@/calculators/Poultry/types/poultry-flock.input';
import { SheepFlockInput } from '@/calculators/Sheep/types/sheep-flock.input';
import {
  HasIsFebruaryInLeapYearInput,
  HasIsFebruaryInLeapYearInputSchemaForBeef,
  HasIsFebruaryInLeapYearInputTransformed,
} from '@/calculators/types/has-is-february-in-leap-year.input';
import { DairySystems } from '@/constants/enums';
import { nv } from '@/tools/inputs';
import { merge } from 'ts-deepmerge';
import { z } from 'zod';
import { HasFertiliserInput } from '../scope1/5-fertiliser';
import { HasLimeInput } from '../scope1/5-fertiliser/lime.input';
import { HasPastureResidueInput } from '../scope1/6-residue-mgmt';
import { HasFuelInput } from '../scope1/8-fuel-use';
import {
  DairyHerdLivestockInput,
  DairyHerdLivestockInputSchema,
  DairyHerdLivestockInputTransformed,
  dairyTimeInLocationsInnerSchema,
} from '../scope1/shared/dairy/input';

function emptyServices() {
  return {
    fuel: { stationary: [], transport: [] },
  };
}

// Per-module defaults. Factories list each key explicitly (rather than spreading a
// shared bag of fields) so excess-property checks catch keys a schema no longer has.
function emptyFuel(): HasFuelInput['fuel'] {
  return { transport: [], stationary: [] };
}

function defaultPasture(areaManaged = 0): HasPastureResidueInput['pasture'] {
  return {
    type: 'Annual grass',
    areaManaged: nv(areaManaged),
    fractionOfAnnualCropBurnt: nv(0),
    residues: {
      calculationMethod: '1',
    },
  };
}

function defaultLime(): HasLimeInput['lime'] {
  return {
    applications: [
      {
        massAppliedKg: nv(0),
        limestoneFraction: nv(0),
        type: 'Limestone',
      },
    ],
  };
}

function defaultFertiliser(): HasFertiliserInput['fertiliser'] {
  return {
    productionSystem: 'Non-irrigated pasture',
    inorganic: {
      applications: [],
      calculationMethodScope1: '1',
    },
    organic: {
      applications: [],
    },
  };
}

export function createBeefHerdInput(
  overrides: Partial<BeefHerdInput> = {},
): BeefHerdInput {
  const defaultInput: BeefHerdInput = {
    fertiliser: defaultFertiliser(),
    excludedFromNaturalWater: false,
    breed: 'Hereford or Shorthorn',
    region: 'NSW',
    lime: defaultLime(),
    fuel: emptyFuel(),
    pasture: defaultPasture(),
    classes: {},

    electricityAllocation: nv(0),
    liveweightSoldKg: nv(0),
    climateZone: 'Boreal dry',
    isInLeachingZone: false,
    grazingSystem: 'Irrigated crop',
    purchasedLivestock: [],
    purchasedFeed: [],
    chemicals: [],
    purchasedMineralSupplements: [],
    services: emptyServices(),
    waste: {},
  };

  return merge(defaultInput, overrides) as BeefHerdInput;
}

export function createBeefHerdInputTransformed(
  overrides: Partial<BeefHerdInput> = {},
  leapYearOverrides: Partial<HasIsFebruaryInLeapYearInput> = {},
): BeefHerdInputTransformed & HasIsFebruaryInLeapYearInputTransformed {
  const mergedInput = createBeefHerdInput(overrides);

  return {
    ...BeefHerdInputSchema.parse(mergedInput),
    ...HasIsFebruaryInLeapYearInputSchemaForBeef.parse({
      isFebruaryInLeapYear: false,
      ...leapYearOverrides,
    }),
  };
}

export function createBeefInput(overrides: Partial<BeefInput> = {}): BeefInput {
  const defaultInput: BeefInput = {
    herds: [createBeefHerdInput()],
    electricity: {
      method: 'location',
      electricityPurchasedKWh: nv(0),
      region: 'NSW',
    },
    isFebruaryInLeapYear: false,
  };

  // ts-deepmerge concatenates arrays; herd lists must be replaced wholesale.
  const { herds, ...rest } = overrides;
  const merged = merge(defaultInput, rest) as BeefInput;
  if (herds !== undefined) {
    merged.herds = herds.map((herd) => createBeefHerdInput(herd));
  }
  return merged;
}

export function createBeefInputTransformed(
  overrides: Partial<BeefInput> = {},
): BeefInputTransformed {
  return BeefInputSchema.parse(createBeefInput(overrides));
}

type DairyTimeInLocationsInput = z.input<
  ReturnType<typeof dairyTimeInLocationsInnerSchema>
>;

/**
 * Partial loses xor-branch keys. Callers may still pass either time-in-location
 * branch plus manure/milk unions that must replace defaults.
 */
type DairyHerdXorOverrides = {
  system?: (typeof DairySystems)[number];
  method2TimeSpentInLocations?: DairyTimeInLocationsInput;
  manureAllocations?: DairyHerdLivestockInput['manureAllocations'];
  milkProduction?: DairyHerdLivestockInput['milkProduction'];
};

type DairyHerdLivestockInputOverrides = Partial<DairyHerdLivestockInput> &
  DairyHerdXorOverrides;

type DairyHerdInputOverrides = Partial<DairyHerdInput> & DairyHerdXorOverrides;

const defaultDairyHerdLivestockInput: DairyHerdLivestockInput = {
  state: 'NSW',
  grazingSystem: 'Irrigated crop',
  isInLeachingZone: false,
  climateZone: 'dry',
  system: 'Grazed only',
  manureAllocations: {
    feedPadMMSAllocation: {
      anaerobicLagoon: nv(0),
      sumpDispersal: nv(0),
      drainToPaddock: nv(0),
      solidStorage: nv(1),
    },
    milkingShedMMSAllocation: {
      anaerobicLagoon: nv(0),
      sumpDispersal: nv(0),
      drainToPaddock: nv(0),
      solidStorage: nv(1),
    },
    solidsSeparatedPreTreatment: false,
  },
  milkProduction: {
    litresPerHeadPerDay: nv(0),
  },
  breed: 'Ayrshire',
  classes: {},
};

/**
 * Fields on DairyHerdInput that are not part of DairyHerdLivestockInput.
 */
const defaultDairyHerdExtraInput = {
  electricityAllocation: nv(0),
  fertiliser: defaultFertiliser(),
  lime: defaultLime(),
  pasture: defaultPasture(),
  fuel: emptyFuel(),
  refrigerants: [],
  waste: {},
  purchasedLivestock: [],
  purchasedFeed: [],
  purchasedMineralSupplements: [],
  chemicals: [],
  services: emptyServices(),
  livestockSales: [],
};

/**
 * Union / xor fields must be replaced wholesale: deep-merge keeps keys from both
 * branches (e.g. system + method2TimeSpentInLocations) and Zod xor rejects them.
 */
function applyDairyHerdXorOverrides(
  merged: Record<string, unknown>,
  overrides: DairyHerdXorOverrides,
): void {
  const {
    manureAllocations,
    milkProduction,
    system,
    method2TimeSpentInLocations,
  } = overrides;

  if (manureAllocations !== undefined) {
    merged.manureAllocations = manureAllocations;
  }
  if (milkProduction !== undefined) {
    merged.milkProduction = milkProduction;
  }

  if (method2TimeSpentInLocations !== undefined) {
    delete merged.system;
    merged.method2TimeSpentInLocations = method2TimeSpentInLocations;
  } else if (system !== undefined) {
    delete merged.method2TimeSpentInLocations;
    merged.system = system;
  }
}

export function createDairyHerdLivestockInput(
  overrides: DairyHerdLivestockInputOverrides = {},
): DairyHerdLivestockInput {
  const {
    manureAllocations,
    milkProduction,
    system,
    method2TimeSpentInLocations,
    ...rest
  } = overrides;

  const merged = merge(defaultDairyHerdLivestockInput, rest) as Record<
    string,
    unknown
  >;

  applyDairyHerdXorOverrides(merged, {
    manureAllocations,
    milkProduction,
    system,
    method2TimeSpentInLocations,
  });

  return merged as DairyHerdLivestockInput;
}

export function createDairyHerdInput(
  overrides: DairyHerdInputOverrides = {},
): DairyHerdInput {
  const {
    manureAllocations,
    milkProduction,
    system,
    method2TimeSpentInLocations,
    ...rest
  } = overrides;

  const defaultInput: DairyHerdInput = {
    ...defaultDairyHerdLivestockInput,
    ...defaultDairyHerdExtraInput,
  };

  const merged = merge(defaultInput, rest) as Record<string, unknown>;

  applyDairyHerdXorOverrides(merged, {
    manureAllocations,
    milkProduction,
    system,
    method2TimeSpentInLocations,
  });

  return merged as DairyHerdInput;
}

export function createDairyHerdInputTransformed(
  overrides: DairyHerdInputOverrides = {},
): DairyHerdInputTransformed {
  return DairyHerdInputSchema.parse(createDairyHerdInput(overrides));
}

export function createDairyHerdLivestockInputTransformed(
  overrides: DairyHerdLivestockInputOverrides = {},
): DairyHerdLivestockInputTransformed {
  return DairyHerdLivestockInputSchema.parse(
    createDairyHerdLivestockInput(overrides),
  );
}

export const createSheepFlockInput = (
  partial: Partial<SheepFlockInput>,
): SheepFlockInput => {
  return {
    electricityAllocation: nv(0),
    services: emptyServices(),
    chemicals: [],
    purchasedMineralSupplements: [],
    purchasedFeed: [],
    waste: {},
    fuel: emptyFuel(),
    pasture: defaultPasture(100),
    lime: defaultLime(),
    fertiliser: defaultFertiliser(),
    liveweightSoldKg: nv(0),
    grazingSystem: 'Irrigated pasture',
    state: 'NSW',
    isInLeachingZone: true,
    climateZone: 'dry',
    excludedFromNaturalWater: false,
    classes: {},
    purchasedLivestock: [],
    ...partial,
  };
};

export const createPigsInput = (
  partial: Partial<PigsHerdInput>,
): PigsHerdInput => {
  return {
    electricityAllocation: nv(0),
    services: emptyServices(),
    purchasedFeed: [],
    waste: {},
    fuel: emptyFuel(),
    liveweightSoldKg: nv(0),
    state: 'NSW',
    classes: {},
    isInLeachingZone: false,
    grazingSystem: 'Non-irrigated pasture',
    purchasedLivestock: [],
    ...partial,
  };
};

export const createPoultryInput = (
  partial: Partial<PoultryFlockInput>,
): PoultryFlockInput => {
  return {
    electricityAllocation: nv(0),
    services: emptyServices(),
    purchasedFeed: [],
    waste: {},
    fuel: emptyFuel(),
    climateZone: 'dry',
    state: 'NSW',
    classes: {},
    isInLeachingZone: false,
    grazingSystem: 'Non-irrigated pasture',
    liveweightSoldKg: nv(0),
    eggsSoldKg: nv(0),
    purchasedLivestock: [],
    ...partial,
  };
};

export const createFeedlotInput = (
  partial: Partial<FeedlotLotInput>,
): FeedlotLotInput => {
  return {
    electricityAllocation: nv(0),
    state: 'NSW',
    grazingSystem: 'Irrigated crop',
    services: emptyServices(),
    purchasedMineralSupplements: [],
    purchasedFeed: [],
    purchasedLivestock: [],
    waste: {},
    fuel: emptyFuel(),
    groups: [],
    liveweightSoldKg: nv(0),
    ...partial,
  };
};

export const createOtherLivestockInput = (
  partial: Partial<OtherLivestockHerdInput>,
): OtherLivestockHerdInput => {
  return {
    electricityAllocation: nv(0),
    services: emptyServices(),
    chemicals: [],
    purchasedMineralSupplements: [],
    purchasedFeed: [],
    waste: {},
    fuel: emptyFuel(),
    pasture: defaultPasture(100),
    lime: defaultLime(),
    fertiliser: defaultFertiliser(),
    livestock: [],
    liveweightSoldKg: nv(0),
    purchasedLivestock: [],
    state: 'NSW',
    grazingSystem: 'Irrigated crop',
    climateZone: 'dry',
    isInLeachingZone: false,
    excludedFromNaturalWater: false,
    ...partial,
  };
};
