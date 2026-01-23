import { ExecutionContext } from "@/calculators/executionContext";
import { ConstantsForGrainsCalculator } from "@/calculators/Grains/constants";
import { rootOrigin } from "@/tools/origins";
import { output, Output } from "@/tools/outputs";
import { mass } from "@/tools/units";
import { GrainsCropTransformed } from "@/types/Grains/crop.input";
import Decimal from "decimal.js-light";

export const calculateScope3Lime = (crop: GrainsCropTransformed, context: ExecutionContext<ConstantsForGrainsCalculator>) => {
    const zeroCO2 = rootOrigin(mass('CO2e', new Decimal(0)), { name: 'zero', valueType: 'constant' });
    const lime: Output<3, 'CO2e'> = output('lime', 3, zeroCO2);
    return {
        lime,
    }
}