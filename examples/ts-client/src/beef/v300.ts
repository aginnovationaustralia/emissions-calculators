import { calculateBeef } from '@aginnovationaustralia/emissions-calculators/versions/3.0.0/calculators';
import { BeefInput } from '@aginnovationaustralia/emissions-calculators/versions/3.0.0/types/Beef/input';
import { beefInput } from './input';

const beefInput300: BeefInput = beefInput

export const calculateBeef300 = () => calculateBeef(beefInput300);