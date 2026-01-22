import { ExecutionContext } from "@/calculators/executionContext"
import { ConstantsForGrainsCalculator } from "@/calculators/Grains/constants"
import { rootOrigin } from "@/tools/origins";
import { scope1Output, Scope1Output } from "@/tools/outputs"
import { mass } from "@/tools/units";
import { GrainsCropTransformed } from "@/types/Grains/crop.input"
import Decimal from "decimal.js-light";

export const calculateScope1FertiliserUse = (crop: GrainsCropTransformed, context: ExecutionContext<ConstantsForGrainsCalculator>) => {
    const zeroCO2 = rootOrigin(mass('CO2', new Decimal(0)), { name: 'zero', valueType: 'constant' });
    const zeroN2O = rootOrigin(mass('N2O', new Decimal(0)), { name: 'zero', valueType: 'constant' });
    const ureaCO2: Scope1Output<'CO2'> = scope1Output('ureaCO2', zeroCO2);
    const limeCO2: Scope1Output<'CO2'> = scope1Output('limeCO2', zeroCO2);
    const fertiliserN2O: Scope1Output<'N2O'> = scope1Output('fertiliserN2O', zeroN2O);
    const atmosphericDepositionN2O: Scope1Output<'N2O'> = scope1Output('atmosphericDepositionN2O', zeroN2O);
    const leachingAndRunoffN2O: Scope1Output<'N2O'> = scope1Output('leachingAndRunoffN2O', zeroN2O);
    return {
        ureaCO2,
        limeCO2,
        fertiliserN2O,
        atmosphericDepositionN2O,
        leachingAndRunoffN2O,
    }
}