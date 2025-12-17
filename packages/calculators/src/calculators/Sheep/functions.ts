export function getMilkIntake(
  milkProduced: number,
  ewesHead: number,
  totalLambsHead: number,
) {
  return totalLambsHead > 0 ? (milkProduced * ewesHead) / totalLambsHead : 0;
}

export function getNFertiliserUreaOtherIrrigated(
  fertiliserTotalOtherIrrigated: number,
  fracWetMultiplier: number,
  fracLeach: number,
) {
  return fertiliserTotalOtherIrrigated * fracWetMultiplier * fracLeach;
}
