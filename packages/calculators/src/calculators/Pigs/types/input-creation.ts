import type { Prop } from '../../types/input-creation/type-helpers';
import type { PigsClassManureAllocationLivestockInput } from './manure-allocations.input';

export type { PigsHerdLivestockInput } from '@/modules/scope1/shared/pigs/input';
export type { PigsClassManureAllocationLivestockInput } from './manure-allocations.input';
export type { PigsClassLivestockInput } from './pigs-class.input';
export type { PigsHerdClassesLivestockInput } from './pigs-classes.input';
export type PigsSolidStorageAllocationInput = Prop<
  PigsClassManureAllocationLivestockInput,
  'solidStorage'
>;
export type PigsSolidStorageTreatmentStage2AllocationsInput = Prop<
  PigsSolidStorageAllocationInput,
  'treatmentStage2Allocations'
>;
export type PigsDeepLitterAllocationInput = Prop<
  PigsClassManureAllocationLivestockInput,
  'deepLitter'
>;
export type PigsDeepLitterTreatmentStage2AllocationsInput = Prop<
  PigsDeepLitterAllocationInput,
  'treatmentStage2Allocations'
>;
export type PigsAnaerobicLagoonAllocationInput = Prop<
  PigsClassManureAllocationLivestockInput,
  'anaerobicLagoon'
>;
export type PigsAnaerobicLagoonTreatmentStage2AllocationsInput = Prop<
  PigsAnaerobicLagoonAllocationInput,
  'treatmentStage2Allocations'
>;
export type PigsDigesterAllocationInput = Prop<
  PigsClassManureAllocationLivestockInput,
  'digester'
>;
export type PigsDigesterTreatmentStage2AllocationsInput = Prop<
  PigsDigesterAllocationInput,
  'treatmentStage2Allocations'
>;
export type PigsPitStorageAllocationInput = Prop<
  PigsClassManureAllocationLivestockInput,
  'pitStorage'
>;
export type PigsPitStorageTreatmentStage2AllocationsInput = Prop<
  PigsPitStorageAllocationInput,
  'treatmentStage2Allocations'
>;
