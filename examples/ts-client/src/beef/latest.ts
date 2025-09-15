import { calculateBeef } from '@aginnovationaustralia/emissions-calculators/latest/calculators';
import { BeefInput } from '@aginnovationaustralia/emissions-calculators/latest/types/Beef/input';
import { beefInput } from './input';

const beefInput300: BeefInput = beefInput

export const calculateBeef300 = () => calculateBeef(beefInput300);
