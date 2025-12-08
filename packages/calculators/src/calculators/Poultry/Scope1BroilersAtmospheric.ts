import { BroilerGroup } from '@/types/Poultry/group.input';
import { PoultryClass } from '@/types/enums';
import { ExecutionContext } from '../executionContext';
import { ConstantsForPoultryCalculator } from './constants';
import {
  getBroilerProductionSystemEF,
  getBroilerTotalBirdNumbers,
} from './functions';

function calculateNitrogenExcretion(
  type: Exclude<PoultryClass, 'layers'>,
  birdNumbers: number,
  averageLengthOfStay50: number,
  averageLengthOfStay100: number,
  context: ExecutionContext<ConstantsForPoultryCalculator>,
  dryMatter?: number,
  crudeProtein?: number,
  nitrogenRetention?: number,
  percentLitterRecycled?: number,
  recyclesPerYear?: number,
) {
  const { constants } = context;

  const totalBirdNumbers = getBroilerTotalBirdNumbers(
    birdNumbers,
    percentLitterRecycled,
    recyclesPerYear,
  );

  const {
    dryMatterIntake,
    crudeProtein: crudeProteinConstant,
    nitrogenRetentionRate,
  } = constants.POULTRY.DIET_PROPERTIES[type];

  const dryMatterInput = dryMatter ?? dryMatterIntake;
  const crudeProteinInput = crudeProtein ?? crudeProteinConstant;
  const nitrogenRetentionInput = nitrogenRetention ?? nitrogenRetentionRate;

  const nitrogenIntake =
    totalBirdNumbers === 0 ? 0 : (dryMatterInput * crudeProteinInput) / 6.25;

  const nitrogenExcretion50Depletion =
    totalBirdNumbers === 0
      ? 0
      : nitrogenIntake *
        (1 - nitrogenRetentionInput) *
        averageLengthOfStay50 *
        10 ** -6;

  const depletion50 = 0.5;
  const birdsAfter50Depletion = totalBirdNumbers * depletion50;

  const lengthOfStay100Depletion =
    averageLengthOfStay100 - averageLengthOfStay50;

  const nitrogenExcretion100Depletion =
    birdsAfter50Depletion === 0
      ? 0
      : nitrogenIntake *
        (1 - nitrogenRetentionInput) *
        lengthOfStay100Depletion *
        10 ** -6;

  const { iFracGASM } = constants.POULTRY.MEATLAYER_EF.meat_chickens;

  const massOfWasteVolatised =
    totalBirdNumbers * nitrogenExcretion50Depletion * iFracGASM +
    birdsAfter50Depletion * nitrogenExcretion100Depletion * iFracGASM;

  const EF_MEAT_CHICKEN = getBroilerProductionSystemEF(context);

  const annualAtmosphericDeposition =
    massOfWasteVolatised * EF_MEAT_CHICKEN * constants.COMMON.GWP_FACTORSC15;

  const totalSeasonalFaecalNitrogenExcreted =
    totalBirdNumbers * nitrogenExcretion50Depletion +
    birdsAfter50Depletion * nitrogenExcretion100Depletion;

  return {
    totalSeasonalFaecalNitrogenExcreted,
    massOfWasteVolatised,
    annualAtmosphericDeposition,
  };
}

export function calculateScope1BroilersAtmospheric(
  groups: BroilerGroup[],
  context: ExecutionContext<ConstantsForPoultryCalculator>,
  litterRecycled: number,
  litterRecycleFrequency: number,
) {
  const { constants } = context;

  const n2OTotal = groups.reduce(
    (acc, group) => {
      const seasonalFaecalGrowers = calculateNitrogenExcretion(
        'meat_chicken_growers',
        group.meatChickenGrowers.birds,
        group.meatChickenGrowers.averageStayLength50,
        group.meatChickenGrowers.averageStayLength100,
        context,
        group.meatChickenGrowers.dryMatterIntake,
        group.meatChickenGrowers.crudeProtein,
        group.meatChickenGrowers.nitrogenRetentionRate,
        litterRecycled,
        litterRecycleFrequency,
      );

      const seasonalFaecalLayers = calculateNitrogenExcretion(
        'meat_chicken_layers',
        group.meatChickenLayers.birds,
        group.meatChickenLayers.averageStayLength50,
        group.meatChickenLayers.averageStayLength100,
        context,
        group.meatChickenLayers.dryMatterIntake,
        group.meatChickenLayers.crudeProtein,
        group.meatChickenLayers.nitrogenRetentionRate,
        litterRecycled,
        litterRecycleFrequency,
      );

      const seasonalFaecalOther = calculateNitrogenExcretion(
        'meat_other',
        group.meatOther.birds,
        group.meatOther.averageStayLength50,
        group.meatOther.averageStayLength100,
        context,
        group.meatOther.dryMatterIntake,
        group.meatOther.crudeProtein,
        group.meatOther.nitrogenRetentionRate,
        litterRecycled,
        litterRecycleFrequency,
      );

      const totalFaecal =
        seasonalFaecalGrowers.totalSeasonalFaecalNitrogenExcreted +
        seasonalFaecalLayers.totalSeasonalFaecalNitrogenExcreted +
        seasonalFaecalOther.totalSeasonalFaecalNitrogenExcreted;

      const totalAtmospheric =
        seasonalFaecalGrowers.annualAtmosphericDeposition +
        seasonalFaecalLayers.annualAtmosphericDeposition +
        seasonalFaecalOther.annualAtmosphericDeposition;

      const massNVolatised = constants.LIVESTOCK.FRAC_GASM * totalFaecal;

      const nitrousOxideProduction =
        massNVolatised *
        constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_NONIRRIGATEDPASTURE *
        constants.COMMON.GWP_FACTORSC15;

      return {
        massNVolatised: acc.massNVolatised + massNVolatised,
        nitrousOxideProduction:
          acc.nitrousOxideProduction + nitrousOxideProduction,
        annualAtmosphericDeposition:
          acc.annualAtmosphericDeposition + totalAtmospheric,
      };
    },
    {
      massNVolatised: 0,
      nitrousOxideProduction: 0,
      annualAtmosphericDeposition: 0,
    },
  );

  const totalIndirectNO2 = n2OTotal.annualAtmosphericDeposition;

  const totalIndirectNO2Gg = totalIndirectNO2 * constants.COMMON.GWP_FACTORSC6;

  const totalIndirectNO2Tonnes = totalIndirectNO2Gg * 10 ** 3;

  const totalAtmosphericN2O = n2OTotal.nitrousOxideProduction;

  const totalAtmosphericN2OGg =
    totalAtmosphericN2O * constants.COMMON.GWP_FACTORSC6;

  const totalAtmosphericN2OTonnes = totalAtmosphericN2OGg * 10 ** 3;

  const scope1BroilerAtmosphericDeposition =
    totalIndirectNO2Tonnes + totalAtmosphericN2OTonnes;

  return scope1BroilerAtmosphericDeposition;
}
