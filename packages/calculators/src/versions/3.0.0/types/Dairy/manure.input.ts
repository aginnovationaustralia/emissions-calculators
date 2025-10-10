import { z } from 'zod';

export const ManureManagementSchema = z
  .object({
    pasture: z.number().min(0).max(100),
    anaerobicLagoon: z.number().min(0).max(100),
    sumpAndDispersal: z.number().min(0).max(100),
    drainToPaddocks: z.number().min(0).max(100),
    soildStorage: z.number().min(0).max(100),
  })
  .meta({
    description:
      'Manure management for each type, each value is a percentage of all excreta, from 0 to 100',
  });

export type ManureManagement = z.infer<typeof ManureManagementSchema>;
