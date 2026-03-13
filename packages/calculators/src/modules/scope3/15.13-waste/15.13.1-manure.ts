import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { ExecutionContext } from '@/calculators/Grains/constants/executionContext';
import { GrainsCropTransformed } from '@/calculators/Grains/types/crop.input';
import { isDefined } from '@/common/filters';
import { calculateMassOfNitrogenAppliedToSoils } from '@/modules/scope1/4-manure-management';
import {
  extendedToBaseProductionSystem,
  FertiliserInputTransformed,
} from '@/modules/scope1/5-fertiliser';
import { selectConstant } from '@/tools/constants';
import { one, zero } from '@/tools/sentinels';
import { sum } from '@/tools/sum';

const calculateScope3WasteOffsiteManureDirectN2O = (
  input: GrainsCropTransformed & FertiliserInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  const { applications } = input.organicFertilisers;
  const emissionRecords = applications
    .map((application) => {
      const origin = application.origin;
      // REVISIT: This is assuming that only local sourced fertiliser generates scope 3 outside the farm boundary
      if (origin.origin !== 'Local') {
        return undefined;
      }
      /*
      Refer to Chapter 5 equation 5.2.1.1 (1) for the calculation of EN2O and replace MNSoiljf for the value of MNSoilscope3, the mass of nitrogen applied to soils outside of the boundary, as calculated in Chapter 4.

      5.2.1.1 Method 1 - Organic Fertiliser Application N2O Emissions
      (1) Nitrous oxide emissions for all organic fertiliser types f and all production systems j, EN2O (t N2O), are calculated as:
      EN2O = SUMj SUMf (MNSoiljf * EF N2O,i * CN2O * 10^-3)
      Where MNSoiljf = mass of nitrogen in organic fertiliser type f applied to production system j (kg N)
      EF N2O,i = emission factor for direct nitrous oxide emissions from organic fertiliser applied to soils and aquatic systems in climate zone i (kg N2O-N/kg N).
      CN2O = factor to convert elemental mass of nitrous oxide to molecular mass (dimensionless)
      Where the organic fertiliser is manure and the manure is generated from a manure management system within the boundary of the entity, the value of MNSoil should be calculated using the methods provided in the Manure Management module (Chapter 4).
      */

      const mnSoilScope3 = calculateMassOfNitrogenAppliedToSoils(
        origin.details,
        input,
        constants,
      ).scope3;
      const efN2Oi = selectConstant(
        constants.CROP,
        'EF_RESIDUES_RETURNED_TO_SOIL',
        input.rainfallAbove600,
      );
      const cn2o = selectConstant(constants.COMMON, 'GWP_FACTORSC15');
      return mnSoilScope3.multiply(efN2Oi).multiply(cn2o);
    })
    .filter(isDefined);

  return sum(emissionRecords, { name: 'E N2O', references: [`5.2.1.1 (238)`] });
};

export const calculateScope3WasteOffsiteManureAtmosphericDepositionN2O = (
  input: GrainsCropTransformed & FertiliserInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  /*
  Refer to Chapter 5 equations 5.4.1.3 (1) and (2) for the calculation of Ead and replace MNSoiljf in equation 5.4.1.3 (2) for the value of MNSoilscope3.

  5.4.1.3 Method 1 - Organic Fertiliser Atmospheric Deposition N 2O Emissions
  (1) Nitrous oxide emissions from atmospheric deposition of all organic fertiliser types f
  and all production systems j, Ead,organic (t N2O), is calculated as:
  Ead,organic = SUMj SUMf (Mvol,organic,jf * EF N2O,j * CN2O * 10^-3)
  Where Mvol,organic,jf = mass of nitrogen volatilised from organic fertiliser applied to production system (kg N)
  EF N2O,j= emission factor for atmospheric deposition in production system j (kg N2O-N/(kg N)
  (2) Mass of nitrogen volatilised from organic fertiliser applied to production systems Mvol,organic,jf (kg N), is calculated as:
  Mvol,organic,jf = MNSoiljf * FracGASMsoil
  Where MNSoiljf = mass of nitrogen in organic fertiliser type f applied to production system j (kg N) (calculated in Section 5.1.2)
  FracGASMsoil = fraction of organic fertiliser N that volatilises ((kg NH3-N + NOx-N)/kg N)
  */

  const baseProductionSystem = extendedToBaseProductionSystem(
    input.inorganicFertilisers.productionSystem,
  );

  const { applications } = input.organicFertilisers;
  const emissionRecords = applications
    .map((application) => {
      const origin = application.origin;
      // REVISIT: This is assuming that only local sourced fertiliser generates scope 3 outside the farm boundary
      if (origin.origin !== 'Local') {
        return undefined;
      }

      const mnSoilScope3 = calculateMassOfNitrogenAppliedToSoils(
        origin.details,
        input,
        constants,
      ).scope3;
      const fracGASMsoil = selectConstant(
        constants.CROP,
        'FRACTION_N_VOLATILISED_ORGANIC_FERTILISER',
      );
      const mVolOrganic = mnSoilScope3.multiply(fracGASMsoil);
      const efN2Oj = selectConstant(
        constants.CROP,
        'EF_N2O_PRODUCTION_SYSTEM',
        baseProductionSystem,
      );
      const cn2o = selectConstant(constants.COMMON, 'GWP_FACTORSC15');
      return mVolOrganic.multiply(efN2Oj).multiply(cn2o);
    })
    .filter(isDefined);
  return sum(emissionRecords, {
    name: 'E ad,organic',
    references: [`5.4.1.3 (339)`],
  });
};

export const calculateScope3WasteOffsiteManureLeachingN2O = (
  input: GrainsCropTransformed & FertiliserInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  /*
  Refer to Chapter 5 equation 5.5.1.1 (1) and (3) for the calculation of Eleach, set Mleach,inorganic,j = 0, and replace MNSoiljf in equation 5.5.1.1 (3) for the value of MNSoilscope3.

  5.5.1.1 Method 1 -- Fertiliser Leaching and Runoff N2O
  (1) Nitrous oxide emissions from nitrogen leaching and runoff from the application of all
  fertilisers (both organic and inorganic) across all production systems j, E fert,leach (tN2O), is calculated as:
  E fert,leach = SUMj (Mleach,inorganic,j + Mleach,organic,j * EF leach * CN2O * 10^-3)
  Where Mleach,inorganic,j = mass of nitrogen lost through leaching and runoff from inorganic fertiliser application in production system j (kg N)
  Mleach,organic,j = mass of nitrogen lost through leaching and runoff from organic fertiliser application (kg N)
  EF leach = emission factor for nitrogen leaching and runoff (kg N2O-N / kg N)
  CN2O = factor to convert elemental mass of nitrous oxide to molecular mass (dimensionless)
  */
  const { applications } = input.organicFertilisers;
  const nitrogenRecords = applications
    .map((application) => {
      const origin = application.origin;
      // REVISIT: This is assuming that only local sourced fertiliser generates scope 3 outside the farm boundary
      if (origin.origin !== 'Local') {
        return undefined;
      }

      const mnSoilScope3 = calculateMassOfNitrogenAppliedToSoils(
        origin.details,
        input,
        constants,
      ).scope3;
      // REVISIT: This ternary is discarding why 1 or 0 was chosen ie you can't trace to the input.isInLeachingZone
      const fracWetj = input.isInLeachingZone ? one : zero;
      const fracLeach = selectConstant(
        constants.CROP,
        'FRACTION_N_LOST_THROUGH_LEACHING_AND_RUNOFF',
      );
      return mnSoilScope3.multiply(fracWetj).multiply(fracLeach);
    })
    .filter(isDefined);

  const efLeach = selectConstant(constants.CROP, 'EF_N2O_LEACHING_AND_RUNOFF');
  const cn2o = selectConstant(constants.COMMON, 'GWP_FACTORSC15');

  return sum(nitrogenRecords)
    .multiply(efLeach)
    .multiply(cn2o, {
      name: 'E fert,leach',
      references: [`5.5.1.1 (378)`],
    });
};

export const calculateScope3WasteOffsiteManure = (
  crop: GrainsCropTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  /*
  15.13.1.1 Method 1 - Emissions from Manure Sent Off-Site
  Refer to Chapter 10.1 for estimation methodology from waste management
  (1) Emissions from manure from manure management systems that is sent off-site to be
  applied to soils in another farming system or enterprise, E (t N2O) is calculated as the
  sum of the direct nitrous oxide emissions from application of the manure to soil and
  indirect emissions from atmospheric deposition and leaching and runoff as:
  E = EN2O + Ead + Eleach
  Where EN2O = direct nitrous oxide emissions from application of manure to soils
  outside of the Scope 1 boundary (t N2O)
  Ead = nitrous oxide emissions from atmospheric deposition of manure to soils (t N2O)
  Eleach = nitrous oxide emissions from nitrogen leaching and runoff of manure to soils (t N2O)
  */
  const eN2O = calculateScope3WasteOffsiteManureDirectN2O(crop, context);
  const eAD = calculateScope3WasteOffsiteManureAtmosphericDepositionN2O(
    crop,
    context,
  );
  const eLeach = calculateScope3WasteOffsiteManureLeachingN2O(crop, context);

  const e = eN2O.plus(eAD).plus(eLeach);
  // REVISIT: This conversion from N2O to CO2e is not mentioned in 15.13.1.1, it has been assumed
  const efN2O = selectConstant(constants.COMMON, 'GWP_FACTORSC6');

  return e.multiply(efN2O);
};
