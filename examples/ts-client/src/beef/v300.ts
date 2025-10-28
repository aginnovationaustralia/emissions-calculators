import { V3_0_0 } from '@aginnovationaustralia/emissions-calculators';
import { beefInputData } from './input';
const { calculateBeef } = V3_0_0.Calculators;

export const calculateBeef300 = () => calculateBeef(beefInputData);
