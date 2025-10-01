import { v3_0_0 } from '@aginnovationaustralia/emissions-calculators';
import { beefInputData } from './input';
const { calculateBeef } = v3_0_0.Calculators;
const { BeefInput } = v3_0_0.Types;

const beefInput300 = new BeefInput();
beefInput300.beef = beefInputData.beef;
beefInput300.state = beefInputData.state;
beefInput300.northOfTropicOfCapricorn = beefInputData.northOfTropicOfCapricorn;
beefInput300.rainfallAbove600 = beefInputData.rainfallAbove600;
beefInput300.burning = beefInputData.burning;
beefInput300.vegetation = beefInputData.vegetation;

export const calculateBeef300 = () => calculateBeef(beefInput300);
