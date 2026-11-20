import { calculateEmissions } from '@/calculators';
import { FeedlotGroupLivestockInput } from '@/calculators/Feedlot/types/feedlot-group.input';
import { FeedlotLotInput } from '@/calculators/Feedlot/types/feedlot-lot.input';
import {
  calculateMassOfNitrogenAppliedToSoilsForDairy,
  DairyManureInputSchema,
} from '@/modules/scope1/4-manure-management/4.3-dairy-manure';
import {
  calculateMassOfNitrogenAppliedToSoilsForPigs,
  PigsManureInputSchema,
} from '@/modules/scope1/4-manure-management/4.5-pigs-manure';
import {
  calculateMassOfNitrogenAppliedToSoilsForPoultry,
  PoultryManureInputSchema,
} from '@/modules/scope1/4-manure-management/4.6-poultry-manure';
import {
  createDairyHerdInput,
  createFeedlotInput,
  createPigsInput,
  createPoultryInput,
} from '@/modules/test/factory';
import { testContext } from '@/test/Grains/context';
import {
  zeroPigsManureAllocation,
  zeroPoultryMMS2Allocation,
} from '@/test/inputs/zero-input';
import { nv } from '@/tools/inputs';

const kg = (container: { unit: { store: { toNumber(): number } } }) =>
  container.unit.store.toNumber();

/**
 * AIA-76: the livestock calculators whose manure can be reused (feedlot, dairy, pigs,
 * poultry) report `outputs.massOfNitrogenInManureApplicableToSoilsKilograms`, the kg of
 * nitrogen left in the manure after its management that can be applied to soils locally,
 * sold to another enterprise, or disposed of as waste. It is MNSoil,scope1 before the
 * fraction applied within the activity boundary (PF), so it needs no new inputs.
 */

const electricity = {
  method: 'location',
  electricityPurchasedKilowattHours: nv(0),
  region: 'NSW',
} as const;

type Outputs = {
  outputs: {
    massOfNitrogenInManureApplicableToSoilsKilograms: { value: number };
  };
  intermediate: {
    outputs: {
      massOfNitrogenInManureApplicableToSoilsKilograms: { value: number };
    };
  }[];
};

const run = (name: 'feedlot' | 'dairy' | 'pigs' | 'poultry', input: object) => {
  const result = calculateEmissions(name, input as never, {
    disableMetrics: true,
  });
  if (result.status !== 'OK') {
    throw new Error(`${name} calculation failed: ${JSON.stringify(result)}`);
  }
  const emissions = result.emissions as unknown as Outputs;
  return {
    total:
      emissions.outputs.massOfNitrogenInManureApplicableToSoilsKilograms.value,
    perActivity: emissions.intermediate.map(
      (i) => i.outputs.massOfNitrogenInManureApplicableToSoilsKilograms.value,
    ),
  };
};

/**
 * ManureManagement.Feedlot, Default scenario: WA, non-irrigated
 * pasture, 1,000 head for 75, 150 and 250 days, stage 2 shares solid storage 0.2,
 * composting 0.2, direct application 0.6, and 2% runoff to the anaerobic lagoon. With every
 * MMS's manure applied within the feedlot (PF = 1), '4.1.1.9 Manure applied to
 * soils' gives 26,233.9843657728 kg N.
 */
const FEEDLOT_DEFAULT_MN_APPLICABLE_KG = 26233.9843657728;

const groups: FeedlotGroupLivestockInput[] = [75, 150, 250].map((days) => ({
  head: nv(1000),
  averageLengthOfStayDays: nv(days),
  manureAllocations: {
    solidStorage: nv(0.2),
    composting: nv(0.2),
    directApplication: nv(0.6),
  },
}));

const feedlotLot = (partial: Partial<FeedlotLotInput> = {}) =>
  createFeedlotInput({
    state: 'WA',
    grazingSystem: 'Non-irrigated pasture',
    groups,
    ...partial,
  });

describe('outputs.massOfNitrogenInManureApplicableToSoilsKilograms (AIA-76)', () => {
  it('feedlot: matches 4.1.1.9 with all manure applied within the boundary (PF = 1)', () => {
    const { total, perActivity } = run('feedlot', {
      electricity,
      lots: [feedlotLot()],
    });
    expect(total).toBeCloseTo(FEEDLOT_DEFAULT_MN_APPLICABLE_KG, 6);
    expect(perActivity).toHaveLength(1);
    expect(perActivity[0]).toBeCloseTo(FEEDLOT_DEFAULT_MN_APPLICABLE_KG, 6);
  });

  it('feedlot: sums the lots, and reports each lot on its intermediate', () => {
    const halfGroups = groups.map((g) => ({ ...g, head: nv(500) }));
    const { total, perActivity } = run('feedlot', {
      electricity,
      lots: [feedlotLot(), feedlotLot({ groups: halfGroups })],
    });
    expect(perActivity[0]).toBeCloseTo(FEEDLOT_DEFAULT_MN_APPLICABLE_KG, 6);
    expect(perActivity[1]).toBeCloseTo(FEEDLOT_DEFAULT_MN_APPLICABLE_KG / 2, 6);
    expect(total).toBeCloseTo(perActivity[0] + perActivity[1], 6);
  });

  it('feedlot: reports 0 with no lots', () => {
    const { total, perActivity } = run('feedlot', { electricity, lots: [] });
    expect(total).toBe(0);
    expect(perActivity).toEqual([]);
  });

  it('dairy: equals MNSoil,scope1 (4.3.1.8) with PF = 1, for each herd', () => {
    const herd = (head: number) =>
      createDairyHerdInput({
        milkProduction: { litresPerHeadPerDay: nv(20) },
        classes: { milkingCows: { head: nv(head) } },
      });
    const herds = [herd(10), herd(20)];
    const { total, perActivity } = run('dairy', { electricity, herds });
    // The same herd as a traced organic fertiliser input: only the keys the nitrogen
    // calculation reads (solids separation affects volatile solids only, so is dropped)
    const asTracedHerd = (h: (typeof herds)[number]) => {
      const { milkingShedMMSAllocation, feedPadMMSAllocation } =
        h.manureAllocations;
      return {
        classes: h.classes,
        milkProduction: h.milkProduction,
        breed: h.breed,
        manureAllocations: { milkingShedMMSAllocation, feedPadMMSAllocation },
        isInLeachingZone: h.isInLeachingZone,
        ...('system' in h
          ? { system: h.system }
          : { method2TimeSpentInLocations: h.method2TimeSpentInLocations }),
        fractionAppliedToSoils: nv(1),
      };
    };
    const mnSoilAtPF1 = herds.map((h) =>
      kg(
        calculateMassOfNitrogenAppliedToSoilsForDairy(
          DairyManureInputSchema.parse({
            type: 'dairy',
            herds: [asTracedHerd(h)],
          }),
          testContext().constants,
        ),
      ),
    );
    expect(mnSoilAtPF1[0]).toBeGreaterThan(0);
    expect(perActivity).toHaveLength(2);
    expect(perActivity[0]).toBeCloseTo(mnSoilAtPF1[0], 6);
    expect(perActivity[1]).toBeCloseTo(mnSoilAtPF1[1], 6);
    expect(total).toBeCloseTo(mnSoilAtPF1[0] + mnSoilAtPF1[1], 6);
  });

  it('pigs: equals MNSoil,scope1 with PF = 1', () => {
    const classes = {
      slaughterPigs: {
        head: nv(100),
        durationDays: nv(365),
        manureAllocations: {
          ...zeroPigsManureAllocation,
          deepLitter: {
            manureAllocated: nv(1),
            treatmentStage2Allocations: {
              ...zeroPigsManureAllocation.deepLitter.treatmentStage2Allocations,
              solidStorage: nv(1),
            },
          },
          outdoorAndFreeRange: nv(0),
        },
      },
    };
    const { total, perActivity } = run('pigs', {
      electricity,
      herds: [createPigsInput({ classes })],
    });
    const mnSoilAtPF1 = kg(
      calculateMassOfNitrogenAppliedToSoilsForPigs(
        PigsManureInputSchema.parse({
          type: 'pigs',
          herds: [
            { classes, isInLeachingZone: false, fractionAppliedToSoils: nv(1) },
          ],
        }),
        testContext().constants,
      ),
    );
    expect(mnSoilAtPF1).toBeGreaterThan(0);
    expect(total).toBeCloseTo(mnSoilAtPF1, 6);
    expect(perActivity).toHaveLength(1);
    expect(perActivity[0]).toBeCloseTo(mnSoilAtPF1, 6);
  });

  it('poultry: equals MNSoil,scope1 (4.6.1.9) with PF = 1', () => {
    const classes = {
      layers: {
        head: nv(100),
        durationDays: nv(365),
        manureAllocations: {
          manureWithLitter: {
            manureAllocated: nv(1),
            treatmentStage2Allocations: {
              ...zeroPoultryMMS2Allocation,
              solidStorage: nv(1),
            },
          },
          beltManureRemoval: {
            manureAllocated: nv(0),
            treatmentStage2Allocations: zeroPoultryMMS2Allocation,
          },
          manureStoredInHouse: {
            manureAllocated: nv(0),
            treatmentStage2Allocations: zeroPoultryMMS2Allocation,
          },
          pastureRangeAndPaddock: nv(0),
        },
      },
    };
    const { total, perActivity } = run('poultry', {
      electricity,
      flocks: [createPoultryInput({ classes })],
    });
    const mnSoilAtPF1 = kg(
      calculateMassOfNitrogenAppliedToSoilsForPoultry(
        PoultryManureInputSchema.parse({
          type: 'poultry',
          flocks: [
            { classes, isInLeachingZone: false, fractionAppliedToSoils: nv(1) },
          ],
        }),
        testContext().constants,
      ),
    );
    expect(mnSoilAtPF1).toBeGreaterThan(0);
    expect(total).toBeCloseTo(mnSoilAtPF1, 6);
    expect(perActivity[0]).toBeCloseTo(mnSoilAtPF1, 6);
  });
});

describe('AllModules outputs (AIA-76)', () => {
  const allModulesOutputs = (input: object) => {
    const result = calculateEmissions('all-modules', input as never, {
      disableMetrics: true,
    });
    if (result.status !== 'OK') {
      throw new Error(`all-modules failed: ${JSON.stringify(result)}`);
    }
    return (
      result.emissions as unknown as {
        outputs: Record<
          'feedlot' | 'dairy' | 'pigs' | 'poultry',
          {
            massOfNitrogenInManureApplicableToSoilsKilograms: { value: number };
          }
        >;
      }
    ).outputs;
  };

  it('reports the feedlot under outputs.feedlot, and 0 for the livestock not given', () => {
    const outputs = allModulesOutputs({
      feedlot: {
        state: 'WA',
        grazingSystem: 'Non-irrigated pasture',
        groups,
      },
    });
    expect(
      outputs.feedlot.massOfNitrogenInManureApplicableToSoilsKilograms.value,
    ).toBeCloseTo(FEEDLOT_DEFAULT_MN_APPLICABLE_KG, 6);
    for (const livestock of ['dairy', 'pigs', 'poultry'] as const) {
      expect(
        outputs[livestock].massOfNitrogenInManureApplicableToSoilsKilograms
          .value,
      ).toBe(0);
    }
  });

  it('reports every output as 0 with no livestock', () => {
    const outputs = allModulesOutputs({});
    expect(Object.keys(outputs).sort()).toEqual([
      'dairy',
      'feedlot',
      'pigs',
      'poultry',
    ]);
    for (const value of Object.values(outputs)) {
      expect(value.massOfNitrogenInManureApplicableToSoilsKilograms.value).toBe(
        0,
      );
    }
  });
});
