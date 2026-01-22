import { ExecutionContext } from "@/calculators/executionContext"
import { ConstantsForGrainsCalculator } from "@/calculators/Grains/constants"
import { rootOrigin } from "@/tools/origins";
import { scope1Output, Scope1Output } from "@/tools/outputs"
import { mass } from "@/tools/units";
import { GrainsCropTransformed } from "@/types/Grains/crop.input"
import Decimal from "decimal.js-light";

export const calculateScope1Fuel = (crop: GrainsCropTransformed, context: ExecutionContext<ConstantsForGrainsCalculator>) => {
    const zero = rootOrigin(mass('CO2', new Decimal(0)), { name: 'zero', valueType: 'constant' });
    const fuelCO2: Scope1Output<'CO2'> = scope1Output('fuelCO2', zero);
    const fuelCH4: Scope1Output<'CH4'> = scope1Output('fuelCH4', zero);
    const fuelN2O: Scope1Output<'N2O'> = scope1Output('fuelN2O', zero);
    return {
        fuelCO2,
        fuelCH4,
        fuelN2O,
    }
}