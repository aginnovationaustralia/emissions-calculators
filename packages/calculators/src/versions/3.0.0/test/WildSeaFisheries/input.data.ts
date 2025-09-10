import { WildSeaFisheriesEnterprise } from '../../types/WildSeaFisheries/enterprise.input';
import { WildSeaFisheriesInput } from '../../types/WildSeaFisheries/input';

const enterprise1: WildSeaFisheriesEnterprise = {
  state: 'tas',
  totalWholeWeightCaught: 5600,
  diesel: 100,
  petrol: 500,
  lpg: 20,
  electricityUse: 1500,
  electricityRenewable: 0,
  refrigerants: [
    {
      refrigerant: 'HFC-32',
      annualRecharge: 60,
    },
  ],
  carbonOffset: 8,
  electricitySource: 'State Grid',
  custombait: [
    {
      emissionsIntensity: 0.08,
      purchased: 15,
    },
  ],
  bait: [
    {
      type: 'Whole Fish',
      purchased: 15,
      additionalIngredient: 0.1,
      emissionsIntensity: 1,
    },
    {
      type: 'Squid',
      purchased: 15,
      additionalIngredient: 0.5,
      emissionsIntensity: 0.2,
    },
    {
      type: 'Squid',
      purchased: 5,
      additionalIngredient: 0.1,
      emissionsIntensity: 0.1,
    },
  ],

  flights: [
    {
      commercialFlightPassengers: 1,
      totalFlightDistance: 700,
    },
  ],
  transports: [
    {
      type: 'Small Car',
      fuel: 'Gasoline',
      distance: 100,
    },
    {
      type: 'Heavy Bus',
      fuel: 'Diesel oil',
      distance: 200,
    },
    {
      type: 'Courier Van-Utility',
      fuel: 'Diesel oil',
      distance: 500,
    },
  ],
};

const enterprise2: WildSeaFisheriesEnterprise = {
  state: 'nt',
  totalWholeWeightCaught: 850,
  diesel: 10,
  petrol: 20,
  lpg: 50,
  electricityUse: 260,
  electricityRenewable: 0.2,
  refrigerants: [
    {
      refrigerant: 'R-22',
      annualRecharge: 12.5,
    },
  ],
  carbonOffset: 4,
  electricitySource: 'State Grid',
  custombait: [
    {
      emissionsIntensity: 2,
      purchased: 3,
    },
  ],
  bait: [
    {
      type: 'Whole Fish',
      purchased: 10,
      additionalIngredient: 0.1,
      emissionsIntensity: 0.34,
    },
    {
      type: 'Fish Heads',
      purchased: 10,
      additionalIngredient: 0.05,
      emissionsIntensity: 0.22,
    },
    {
      type: 'Fish Frames',
      purchased: 50,
      additionalIngredient: 0.05,
      emissionsIntensity: 0.11,
    },
  ],
  flights: [
    {
      commercialFlightPassengers: 10,
      totalFlightDistance: 800,
    },
  ],
  transports: [
    {
      type: 'Small Car',
      fuel: 'Fuel oil',
      distance: 500,
    },
  ],
};

const enterprise3: WildSeaFisheriesEnterprise = {
  state: 'sa',
  totalWholeWeightCaught: 1150,
  diesel: 850,
  petrol: 650,
  lpg: 120,
  electricityUse: 3200,
  electricityRenewable: 0,
  refrigerants: [
    {
      refrigerant: 'Ammonia (R-717)',
      annualRecharge: 41.1,
    },
  ],
  carbonOffset: 3,
  electricitySource: 'State Grid',
  custombait: [
    {
      emissionsIntensity: 1,
      purchased: 1,
    },
  ],
  bait: [
    {
      type: 'Whole Fish',
      purchased: 15,
      additionalIngredient: 0.1,
      emissionsIntensity: 0.05,
    },
    {
      type: 'Sardines',
      purchased: 5,
      additionalIngredient: 0.05,
      emissionsIntensity: 0.02,
    },
    {
      type: 'Whole Fish',
      purchased: 23,
      additionalIngredient: 0.05,
      emissionsIntensity: 0.1,
    },
  ],
  flights: [
    {
      commercialFlightPassengers: 10,
      totalFlightDistance: 1200,
    },
  ],
  transports: [
    {
      type: 'Small Car',
      fuel: 'Diesel oil',
      distance: 100,
    },
    {
      type: 'Heavy Bus',
      fuel: 'Renewable diesel',
      distance: 260,
    },
    {
      type: 'Medium Rigid',
      fuel: 'Ethanol',
      distance: 180,
    },
  ],
};

export const fisheriesTestData: WildSeaFisheriesInput = {
  enterprises: [enterprise1, enterprise2, enterprise3],
};
