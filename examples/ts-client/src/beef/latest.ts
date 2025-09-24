import { calculateBeef } from '@aginnovationaustralia/emissions-calculators/calculators';
import { BeefInput } from '@aginnovationaustralia/emissions-calculators/types/Beef/input';
import { beefInputData } from './input';

const beefInputLatest: BeefInput = beefInputData;

export const calculateBeefLatest = () => calculateBeef(beefInputLatest);
