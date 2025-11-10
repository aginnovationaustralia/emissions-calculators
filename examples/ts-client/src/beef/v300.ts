import { Calculators } from '@aginnovationaustralia/emissions-calculators';
import { beefInputData } from './input';
const { calculateBeef } = Calculators;

export const calculateBeef300 = () => calculateBeef(beefInputData);
