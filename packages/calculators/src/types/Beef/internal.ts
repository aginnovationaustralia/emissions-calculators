export type BeefIntermediaryEmissions = {
  urine: number;
  faeces: number;
  intermediate: {
    actualIntake: number;
    seasonalMethaneProduction: number;
    totalCH4Production: number;
    manureCH4: number;
  };
};

export type BeefCompleteEmissions = {
  leechingRunoffN2O: number;
  atmosphericDepositionN2O: number;
  urineAndDungN2O: number;
  manureManagementCH4: number;
  entericCH4: number;
  fertiliserN2O: number;
  intermediate: {
    totalAtmosphericNDepositionFertiliser: number;
    totalN2OTonnes: number;
  };
};
