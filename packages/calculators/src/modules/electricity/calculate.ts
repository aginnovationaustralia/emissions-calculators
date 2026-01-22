import { ExecutionContext } from "@/calculators/executionContext"
import { ConstantsForGrainsCalculator } from "@/calculators/Grains/constants"
import { rootOrigin } from "@/tools/origins";
import { output, Output, scope1Output, Scope1Output } from "@/tools/outputs"
import { mass } from "@/tools/units";
import { GrainsCropTransformed } from "@/types/Grains/crop.input"
import { GrainsInputTransformed } from "@/types/Grains/input";
import Decimal from "decimal.js-light";

export const calculateElectricityScope2And3 = (input: GrainsInputTransformed, context: ExecutionContext<ConstantsForGrainsCalculator>) => {
    const zeroCO2 = rootOrigin(mass('CO2e', new Decimal(0)), { name: 'zero', valueType: 'constant' });
    const scope2 = zeroCO2;
    const scope3 = zeroCO2;
    return {
        scope2,
        scope3,
    }
}