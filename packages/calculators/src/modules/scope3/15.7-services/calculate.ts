import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { ExecutionContext } from '@/calculators/Grains/constants/executionContext';
import { selectConstant } from '@/tools/constants';
import { sum } from '@/tools/sum';
import {
  isServiceAreaBased,
  ServiceByAreaInputTransformed,
  ServiceByHourInputTransformed,
  ServicesInputTransformed,
} from './services.input';

const calculateScope3ServiceByArea = (
  service: ServiceByAreaInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  const area = service.areaServicedHa;
  const efp = selectConstant(
    constants.COMMON,
    'SERVICE_EMISSIONS_BY_AREA',
    service.serviceType,
  );
  return efp.multiply(area);
};

const calculateScope3ServiceByHour = (
  service: ServiceByHourInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  const time = service.serviceTimeHours;
  const efp = selectConstant(
    constants.COMMON,
    'SERVICE_EMISSIONS_BY_HOUR',
    service.serviceType,
  );
  return efp.multiply(time);
};

export const calculateScope3Services = (
  crop: ServicesInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  /*
  15.7.1.1 Method 1 -- Purchased Services and Contractors
  (1) Emissions of purchased services and contractor operations is calculated E (t CO2e)
  as:
  Where E = SUMp Ap * EF p * 10^-3
  Ap= activity data of the service that was purchased (either in area of land
  serviced (ha) or time of operation (hours), depending on the service
  purchased)
  EF p = life cycle emission factor for the purchased service (kgCO2e/ha or kgCO2e/hr)
  */

  const emissionRecords = crop.services.map((service) => {
    if (isServiceAreaBased(service)) {
      return calculateScope3ServiceByArea(service, context);
    } else {
      return calculateScope3ServiceByHour(service, context);
    }
  });
  return sum(emissionRecords);
};
