import { FullCAMAreaInputTransformed } from './input';
import { generateTemplateForSpatialUpdate } from './templates/spatial-update';

export const SIMULATION_API_URL =
  'https://api.climatechange.gov.au/climate/carbon-accounting/2024/plot/v1/2024/fullcam-simulator/run-plotsimulation';
export const SPATIAL_UPDATE_API_URL =
  'https://api.climatechange.gov.au/climate/carbon-accounting/2024/data/v1/2024/data-builder/update-spatialdata';

const plotFileName = 'fullcam-emissions-calculator.plo';

export async function updateSpatial(
  inputs: FullCAMAreaInputTransformed,
  apiKey: string,
): Promise<string> {
  const plotContent = generateTemplateForSpatialUpdate(inputs);

  const formData = new FormData();
  const file = new File([plotContent], plotFileName, {
    type: 'application/xml',
  });
  formData.append('file', file);

  const response = await fetch(SPATIAL_UPDATE_API_URL, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': apiKey,
    },
    body: formData,
  });

  const bodyText = await response.text();

  if (!response.ok) {
    throw new Error(
      `FullCAM update-spatialdata failed: ${response.status} ${response.statusText}`,
    );
  }

  return bodyText;
}

export async function runSimulation(
  plotContent: string,
  apiKey: string,
): Promise<string> {
  const formData = new FormData();
  const file = new File([plotContent], plotFileName, {
    type: 'application/xml',
  });
  formData.append('file', file);

  const response = await fetch(SIMULATION_API_URL, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': apiKey,
    },
    body: formData,
  });

  const bodyText = await response.text();

  if (!response.ok) {
    throw new Error(
      `FullCAM run-plotsimulation failed: ${response.status} ${response.statusText}`,
    );
  }

  return bodyText;
}
