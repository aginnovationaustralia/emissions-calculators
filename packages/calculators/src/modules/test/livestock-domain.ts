import {
  DairySystem,
  DairySystems,
  FeedlotMMSType,
  FeedlotMMSTypes,
  SwineMMSType,
  SwineMMSTypes,
} from '@/constants/enums';

export const checkSwineMMSType = (type: string | undefined): SwineMMSType => {
  if (!SwineMMSTypes.includes(type as SwineMMSType)) {
    throw new Error(`Invalid swine MMS type: ${type}`);
  }
  return type as SwineMMSType;
};

export const checkFeedlotMMSType = (
  type: string | undefined,
): FeedlotMMSType => {
  if (!FeedlotMMSTypes.includes(type as FeedlotMMSType)) {
    throw new Error(`Invalid feedlot MMS type: ${type}`);
  }
  return type as FeedlotMMSType;
};

export const checkDairySystem = (system: string | undefined): DairySystem => {
  if (!DairySystems.includes(system as DairySystem)) {
    throw new Error(`Invalid dairy system: ${system}`);
  }
  return system as DairySystem;
};
