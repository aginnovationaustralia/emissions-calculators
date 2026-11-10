import { DairyCattleBreed, DairyCattleBreeds } from '@/constants/enums';

export const checkDairyBreed = (
  breed: string | undefined,
): DairyCattleBreed => {
  if (!DairyCattleBreeds.includes(breed as DairyCattleBreed)) {
    throw new Error(`Invalid dairy breed: ${breed}`);
  }
  return breed as DairyCattleBreed;
};
