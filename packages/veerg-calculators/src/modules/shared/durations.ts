import { Month, Season } from '@/constants/enums';
import { root } from '@/tools/containers';
import { ifTrueElse } from '@/tools/if-else';
import { InputContainer } from '@/tools/inputs';
import { days } from '@/tools/units';

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

const monthDurationMap: Record<Month, number> = {
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

export const daysInMonth = (
  month: Month,
  isLeapYear: InputContainer<boolean>,
) => {
  const nonLeapYearDays = monthDurationMap[month];

  return ifTrueElse(
    isLeapYear,
    root(days(month === 'february' ? 29 : nonLeapYearDays)),
    root(days(nonLeapYearDays)),
  );
};
