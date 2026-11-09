import { calculateFarmEmissions } from './farm-emissions';

const result = calculateFarmEmissions({
  freightKm: 200,
  fertilisedHectares: 50,
  nitrogenKgPerHa: 100,
  herdSize: 100,
  dryMatterKgPerHeadPerDay: 12,
  methaneReductionPercent: 10,
});

for (const [key, container] of Object.entries(result)) {
  console.log(
    `${key}: ${container.value.toFixed(2)} ${JSON.stringify(container.unit)}`,
  );
}
