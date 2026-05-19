import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { ExecutionContext } from '@/calculators/executionContext';
import { selectConstant } from '@/tools/constants';
import { sum } from '@/tools/sum';
import { convertWasteAmountToMass } from './solid-waste.input';
import { WasteInputTransformed } from './waste.input';

export const calculateScope3WasteSolidWaste = (
  crop: WasteInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  /*
  Refer to Chapter 10.1 for the estimation methodology from waste management.

  10.1.1 Method 1 - Solid Waste Treatment
  (1) Methane emissions from waste management Eg (t CO2e) are calculated as the sum
  of emissions from all types of waste w treated across different facilities t for each
  greenhouse gas g as:
  Eg = SUM SUM (Qwt * EF wtg)

  Where Qwt = quantity of solid waste of type w being sent to treatment facility t (t), on a wet weight basis
  EFwtg = emission factor for greenhouse gas g for the management of waste at
  the treatment facility (t CO2e/t)
  (2) If the mass of the waste Qwt is unknown, it can be calculated based on the volume of
  waste as:
  Qwt = V wt * VTMw
  Where V wt = volume of solid waste type w being sent to treatment facility t (m3)
  VTMw = conversion factor of volume to mass for waste type w (t/m3)
  */
  const { landfill, incineration, composting, anaerobicDigestion } =
    crop.waste.solidWaste;
  const eLandfill = landfill.map((landfill) => {
    const efLandfill = selectConstant(
      constants.COMMON,
      'SOLID_WASTE_LANDFILL_EF',
      landfill.type,
    );
    const massWaste = convertWasteAmountToMass(
      landfill,
      landfill.type,
      constants.COMMON,
    );
    return efLandfill.multiply(massWaste);
  });
  const eIncineration = incineration.map((incineration) => {
    const efIncineration = selectConstant(
      constants.COMMON,
      'SOLID_WASTE_INCINERATION_EF',
      incineration.type,
    );
    const massWaste = convertWasteAmountToMass(
      incineration,
      incineration.type,
      constants.COMMON,
    );
    return efIncineration.multiply(massWaste);
  });
  const eComposting = composting.map((composting) => {
    const efComposting = selectConstant(
      constants.COMMON,
      'SOLID_WASTE_COMPOSTING_EF',
    );
    const massWaste = convertWasteAmountToMass(
      composting,
      composting.type,
      constants.COMMON,
    );
    return efComposting.multiply(massWaste);
  });
  const eAnaerobicDigestion = anaerobicDigestion.map((anaerobicDigestion) => {
    const efAnaerobicDigestion = selectConstant(
      constants.COMMON,
      'SOLID_WASTE_ANAEROBIC_DIGESTION_EF',
    );
    const massWaste = convertWasteAmountToMass(
      anaerobicDigestion,
      anaerobicDigestion.type,
      constants.COMMON,
    );
    return efAnaerobicDigestion.multiply(massWaste);
  });

  const e = sum(
    eLandfill
      .concat(eIncineration)
      .concat(eComposting)
      .concat(eAnaerobicDigestion),
  );
  return e;
};
