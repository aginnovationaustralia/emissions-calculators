import { Month, Season } from '@/constants/enums';

export const monthSeasonMap: Record<Month, Season> = {
  january: 'summer',
  february: 'summer',
  march: 'autumn',
  april: 'autumn',
  may: 'autumn',
  june: 'winter',
  july: 'winter',
  august: 'winter',
  september: 'spring',
  october: 'spring',
  november: 'spring',
  december: 'summer',
};

export const monthDurationMap: Record<Month, number> = {
  january: 31,
  february: 28,
  march: 31,
  april: 30,
  may: 31,
  june: 30,
  july: 31,
  august: 31,
  september: 30,
  october: 31,
  november: 30,
  december: 31,
};
