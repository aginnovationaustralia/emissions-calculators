import { z } from 'zod';

export const outputKey = (description?: string) => {
    return z.strictObject({
        value: z.number(),
        reference: z.string(),
    }).meta({ description });
}