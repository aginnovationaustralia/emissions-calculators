import { z } from 'zod';
import { percentage } from '../schemas';

export const ManureManagementSchema = z
  .object({
    pasture: percentage(),
    anaerobicLagoon: percentage(),
    sumpAndDispersal: percentage(),
    drainToPaddocks: percentage(),
    solidStorage: percentage(),
  })
  .meta({
    description:
      'Manure management for each type, each value is a percentage of all excreta, from 0 to 100',
  });

export type ManureManagement = z.infer<typeof ManureManagementSchema>;
