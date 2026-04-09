import { AllConstants } from '@/constants/types';
import { WastewaterTreatmentInputTransformed } from './wastewater-treatment.input';
import { ExecutionContext } from '@/calculators/executionContext';
import { num, value } from '@/tools/containers';
import { selectConstant } from '@/tools/constants';
import { massPerVolume } from '@/tools/units';

export const calculateScope1WastewaterCH4 = (
  wastewater: WastewaterTreatmentInputTransformed,
  context: ExecutionContext<AllConstants>,
) => {
  const { constants } = context;

  const facilityWastewaterMethaneCorrectionFactor = selectConstant(
    constants.AQUACULTURE,
    'WASTEWATER_TREATMENT',
    'WASTEWATER_METHANE_CORRECTION_FACTORS',
    wastewater.facilityType,
  );
  const wastewaterEF = selectConstant(
    constants.AQUACULTURE,
    'WASTEWATER_TREATMENT',
    'WASTEWATER_EF',
  );

  /**
   * 𝐶𝑂𝐷𝑖𝑛 × (1 − 𝐹𝑠𝑙𝑢𝑑𝑔𝑒) − 𝐶𝑂𝐷𝑜𝑢𝑡
   */
  const codTreatedAtFacility = num(1)
    .minus(wastewater.fractionSludge)
    .named('1 - F_sludge')
    .multiply(wastewater.inletCOD)
    .minus(wastewater.outletCOD);

  /**
   * {𝑊𝑡 × [𝐶𝑂𝐷𝑖𝑛 × (1 − 𝐹𝑠𝑙𝑢𝑑𝑔𝑒 ) − 𝐶𝑂𝐷𝑜𝑢𝑡 ] × 𝐶𝐹𝑤𝑤,𝑡 × 𝐸𝐹𝑤𝑤}
   */
  const methaneFromWastewaterTreatedAtFacility = codTreatedAtFacility
    .multiply(wastewater.wastewaterVolume)
    .multiply(facilityWastewaterMethaneCorrectionFactor)
    .multiply(wastewaterEF);

  const facilitySludgeMethaneCorrectionFactor = selectConstant(
    constants.AQUACULTURE,
    'WASTEWATER_TREATMENT',
    'SLUDGE_METHANE_CORRECTION_FACTORS',
    wastewater.facilityType,
  );
  const sludgeEF = selectConstant(
    constants.AQUACULTURE,
    'WASTEWATER_TREATMENT',
    'SLUDGE_EF',
  );

  /**
   * 𝐶𝑂𝐷𝑖𝑛 × (𝐹𝑠𝑙𝑢𝑑𝑔𝑒 − 𝐹𝑟𝑒𝑚𝑜𝑣𝑒𝑑)
   */
  const codSludge = wastewater.inletCOD.multiply(
    wastewater.fractionSludge.minus(wastewater.fractionRemoved),
  );

  const methaneFromSludgeTreatedAtFacility = codSludge
    .multiply(wastewater.wastewaterVolume)
    .multiply(facilitySludgeMethaneCorrectionFactor)
    .multiply(sludgeEF);

  /**
   * This value comes from the [National Greenhouse and Energy Reporting (Measurement) Determination 2008](https://www.legislation.gov.au/F2008L02309/latest/text),
   * Chapter 5, Section 5.4:
   * > *"γ is the factor **6.784 × 10^‑4** × GWPmethane converting cubic metres of methane
   * > at standard conditions to CO2‑e tonnes."*
   *
   * Omitting the 'GWPmethane' factor, the unit of this value is t CH4/m^3, which is equivalent to
   * kg/L.
   */
  const methaneVolumeConversionFactor = value(
    massPerVolume('CH4', 'CH4', 6.784 * 10 ** -4),
  );

  const totalMethaneVolume = wastewater.methaneCaptured
    .plus(wastewater.methaneFlared)
    .plus(wastewater.methaneOut);

  /**
   * 6.784 × 10^−4 × [𝑄𝑐𝑎𝑝 + 𝑄𝑓𝑙𝑎𝑟𝑒𝑑 + 𝑄𝑜𝑢𝑡]
   */
  const totalMethaneMass =
    methaneVolumeConversionFactor.multiply(totalMethaneVolume);

  const sludgeBiogasEnergyContentFlared = selectConstant(
    constants.AQUACULTURE,
    'WASTEWATER_TREATMENT',
    'SLUDGE_BIOGAS_ENERGY_CONTENT',
  );

  const sludgeBiogasEFCH4 = selectConstant(
    constants.AQUACULTURE,
    'WASTEWATER_TREATMENT',
    'SLUDGE_BIOGAS_CH4_EF',
  );

  /**
   * 𝑄𝑓𝑙𝑎𝑟𝑒𝑑 × [𝐸𝐶𝑓𝑙𝑎𝑟𝑒𝑑 × 𝐸𝐹𝑓𝑙𝑎𝑟𝑒𝑑,𝐶𝐻4]
   */
  const methaneFromFlaredSludge = sludgeBiogasEFCH4.multiply(
    sludgeBiogasEnergyContentFlared.multiply(wastewater.methaneFlared),
  );

  /**
   * {𝑊𝑡 × [𝐶𝑂𝐷𝑖𝑛 × (1 − 𝐹𝑠𝑙𝑢𝑑𝑔𝑒 ) − 𝐶𝑂𝐷𝑜𝑢𝑡] × 𝐶𝐹𝑤𝑤,𝑡 × 𝐸𝐹𝑤𝑤} +
   * {𝑊𝑡 × [𝐶𝑂𝐷𝑖𝑛 × (𝐹𝑠𝑙𝑢𝑑𝑔𝑒− 𝐹𝑟𝑒𝑚𝑜𝑣𝑒𝑑)] × 𝐶𝐹𝑠𝑙𝑢𝑑𝑔𝑒,𝑡 × 𝐸𝐹𝑠𝑙𝑢𝑑𝑔𝑒} -
   * {6.784 × 10−4 × [𝑄𝑐𝑎𝑝 + 𝑄𝑓𝑙𝑎𝑟𝑒𝑑 + 𝑄𝑜𝑢𝑡]} + {𝑄𝑓𝑙𝑎𝑟𝑒𝑑 × [𝐸𝐶 𝑓𝑙𝑎𝑟𝑒𝑑 × 𝐸𝐹 𝑓𝑙𝑎𝑟𝑒𝑑,𝐶𝐻4]}
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
   * 11.1.3 Method 1 – Nitrous oxide emissions from onsite Wastewater Management
   * 𝑄𝑓𝑙𝑎𝑟𝑒𝑑/1000 × [𝐸𝐶𝑓𝑙𝑎𝑟𝑒𝑑 × 𝐸𝐹𝑓𝑙𝑎𝑟𝑒𝑑,𝑁2𝑂]
   * NOTE: The division by 1000 is accounted for by the containers.
   */
  const { constants } = context;

  const sludgeBiogasEnergyContentFlared = selectConstant(
    constants.AQUACULTURE,
    'WASTEWATER_TREATMENT',
    'SLUDGE_BIOGAS_ENERGY_CONTENT',
  );

  const sludgeBiogasEFN2O = selectConstant(
    constants.AQUACULTURE,
    'WASTEWATER_TREATMENT',
    'SLUDGE_BIOGAS_N2O_EF',
  );

  return sludgeBiogasEFN2O.multiply(
    sludgeBiogasEnergyContentFlared.multiply(wastewater.methaneFlared),
  );
};
