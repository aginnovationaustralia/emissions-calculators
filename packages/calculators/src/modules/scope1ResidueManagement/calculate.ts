import { ExecutionContext } from "@/calculators/executionContext"
import { ConstantsForGrainsCalculator } from "@/calculators/Grains/constants"
import { rootOrigin } from "@/tools/origins";
import { scope1Output, Scope1Output } from "@/tools/outputs"
import { mass } from "@/tools/units";
import { GrainsCropTransformed } from "@/types/Grains/crop.input"
import Decimal from "decimal.js-light";

export const calculateScope1ResidueManagement = (crop: GrainsCropTransformed, context: ExecutionContext<ConstantsForGrainsCalculator>) => {
    const zeroCH4 = rootOrigin(mass('CH4', new Decimal(0)), { name: 'zero', valueType: 'constant' });
    const zeroN2O = rootOrigin(mass('N2O', new Decimal(0)), { name: 'zero', valueType: 'constant' });
    const cropResidueN2O: Scope1Output<'N2O'> = scope1Output('cropResidueN2O', zeroN2O);
    const fieldBurningN2O: Scope1Output<'N2O'> = scope1Output('fieldBurningN2O', zeroN2O);
    const fieldBurningCH4: Scope1Output<'CH4'> = scope1Output('fieldBurningCH4', zeroCH4);
    return {
        cropResidueN2O,
        fieldBurningN2O,
        fieldBurningCH4,
    }
}