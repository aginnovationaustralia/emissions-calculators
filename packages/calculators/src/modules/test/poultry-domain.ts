import { PoultryClass, PoultryClasses } from '@/constants/enums';

export const checkPoultryClass = (
  className: string | undefined,
): PoultryClass => {
  if (!PoultryClasses.includes(className as PoultryClass)) {
    throw new Error(`Invalid poultry class: '${className}'`);
  }
  return className as PoultryClass;
};
