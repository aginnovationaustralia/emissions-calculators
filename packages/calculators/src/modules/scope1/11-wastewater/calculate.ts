import { AllConstants } from '@/constants/types';
import { WastewaterTreatmentInputTransformed } from './wastewater-treatment.input';
import { ExecutionContext } from '@/calculators/executionContext';
import { selectConstant } from '@/tools/constants';
import { oneMinus } from '@/tools/sentinels';

export const calculateScope1WastewaterCH4 = (
  wastewater: WastewaterTreatmentInputTransformed,
  context: ExecutionContext<AllConstants>,
) => {
  const { constants } = context;

  const facilityWastewaterMethaneCorrectionFactor = selectConstant(
    constants.COMMON,
    'WASTEWATER_TREATMENT',
    'WASTEWATER_METHANE_CORRECTION_FACTORS',
    wastewater.facilityType,
  );
  const wastewaterEF = selectConstant(
    constants.COMMON,
    'WASTEWATER_TREATMENT',
    'WASTEWATER_EF',
  );

  /**
   * CODin * (1 - Fsludge) - CODout
   */
  const codTreatedAtFacility = oneMinus(wastewater.fractionSludge)
    .named('1 - F_sludge')
    .multiply(wastewater.inletCOD)
    .minus(wastewater.outletCOD);

  /**
   * Wt * [CODin * (1 - Fsludge ) - CODout ] * CFww,t * EFww
   */
  const methaneFromWastewaterTreatedAtFacility = codTreatedAtFacility
    .multiply(wastewater.wastewaterVolume)
    .multiply(facilityWastewaterMethaneCorrectionFactor)
    .multiply(wastewaterEF)
    .named('methaneFromWastewaterTreatedAtFacility');

  const facilitySludgeMethaneCorrectionFactor = selectConstant(
    constants.COMMON,
    'WASTEWATER_TREATMENT',
    'SLUDGE_METHANE_CORRECTION_FACTORS',
    wastewater.facilityType,
  );
  const sludgeEF = selectConstant(
    constants.COMMON,
    'WASTEWATER_TREATMENT',
    'SLUDGE_EF',
  );

  /**
   * CODin * (Fsludge - Fremoved)
   */
  const codSludge = wastewater.inletCOD.multiply(
    wastewater.fractionSludge.minus(wastewater.fractionRemoved),
  );

  /**
   * Wt * [CODin * (Fsludge - Fremoved)] * CFsludge,t * EFsludge
   */
  const methaneFromSludgeTreatedAtFacility = codSludge
    .multiply(wastewater.wastewaterVolume)
    .multiply(facilitySludgeMethaneCorrectionFactor)
    .multiply(sludgeEF)
    .named('methaneFromSludgeTreatedAtFacility');

  /**
   * This value comes from the [National Greenhouse and Energy Reporting (Measurement)
   * Determination 2008](https://www.legislation.gov.au/F2008L02309/latest/text),
   * Chapter 5, Section 5.4:
   * > *"γ is the factor **6.784 * 10^‑4** * GWPmethane converting cubic metres of
   * > methane at standard conditions to CO2‑e tonnes."*
   *
   * Omitting the 'GWPmethane' factor, the unit of this value is t CH4/m^3, which is
   * equivalent to kg/L.
   *
   * NOTE: This value gets defined properly in another chapter, so we can actually just
   * use the constant here.
   */
  const methaneVolumeConversionFactor = selectConstant(
    constants.COMMON,
    'DENSITY_OF_METHANE',
  );

  /**
   * 6.784 * 10^-4 * [Qcap + Qflared + Qout]
   */
  const totalMethaneMass = methaneVolumeConversionFactor
    .multiply(
      wastewater.methaneCaptured
        .plus(wastewater.methaneFlared)
        .plus(wastewater.methaneOut),
    )
    .named('Total methane mass');

  const sludgeBiogasEnergyContentFlared = selectConstant(
    constants.COMMON,
    'WASTEWATER_TREATMENT',
    'SLUDGE_BIOGAS_ENERGY_CONTENT',
  );

  const sludgeBiogasEFCH4 = selectConstant(
    constants.COMMON,
    'WASTEWATER_TREATMENT',
    'SLUDGE_BIOGAS_CH4_EF',
  );

  /**
   * Qflared * [ECflared * EFflared,CH4]
   */
  const methaneFromFlaredSludge = sludgeBiogasEFCH4.multiply(
    sludgeBiogasEnergyContentFlared.multiply(wastewater.methaneFlared),
  );

  /**
   * (Wt * [CODin * (1 - Fsludge ) - CODout] * CFww,t * EFww) +
   * (Wt * [CODin * (Fsludge- Fremoved)] * CFsludge,t * EFsludge) -
   * (6.784 * 10^-4 * [Qcap + Qflared + Qout]) +
   * (Qflared * [EC flared * EF flared,CH4])
   */

  const wastewaterCH4 = methaneFromWastewaterTreatedAtFacility
    .plus(methaneFromSludgeTreatedAtFacility)
    .minus(totalMethaneMass)
    .plus(methaneFromFlaredSludge);
  return wastewaterCH4;
};

export const calculateScope1WastewaterN2O = (
  wastewater: WastewaterTreatmentInputTransformed,
  context: ExecutionContext<AllConstants>,
) => {
  /**
   * 11.1.3 Method 1 - Nitrous oxide emissions from onsite Wastewater Management
   * Qflared/1000 * (ECflared * EFflared,N2O)
   * NOTE: The division by 1000 is accounted for by the containers.
   */
  const { constants } = context;

  const sludgeBiogasEnergyContentFlared = selectConstant(
    constants.COMMON,
    'WASTEWATER_TREATMENT',
    'SLUDGE_BIOGAS_ENERGY_CONTENT',
  );

  const sludgeBiogasEFN2O = selectConstant(
    constants.COMMON,
    'WASTEWATER_TREATMENT',
    'SLUDGE_BIOGAS_N2O_EF',
  );

  return sludgeBiogasEFN2O.multiply(
    sludgeBiogasEnergyContentFlared.multiply(wastewater.methaneFlared),
  );
};
