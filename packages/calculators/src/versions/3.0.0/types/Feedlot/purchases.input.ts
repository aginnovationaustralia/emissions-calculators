import { Transform, plainToClass } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import 'reflect-metadata';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { FeedlotPurchase } from './purchase.input';

const TransformPurchasesArray = () =>
  Transform(({ value }: { value: FeedlotPurchase | FeedlotPurchase[] }) =>
    Array.isArray(value)
      ? value.map((p) => plainToClass(FeedlotPurchase, p))
      : [plainToClass(FeedlotPurchase, value)],
  );

@SchemaDescription(
  'Note: passing a single `FeedlotPurchase` for each class is now deprecated, please pass an array (`FeedlotPurchases[]`) instead',
)
export class FeedlotPurchases {
  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(
    () => FeedlotPurchase,
    'Livestock purchases for bulls whose age is greater than 1 year old',
  )
  @TransformPurchasesArray()
  @IsOptional()
  bullsGt1?: FeedlotPurchase[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(
    () => FeedlotPurchase,
    'Livestock purchases for traded bulls whose age is greater than 1 year old',
  )
  @TransformPurchasesArray()
  @IsOptional()
  bullsGt1Traded?: FeedlotPurchase[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(
    () => FeedlotPurchase,
    'Livestock purchases for Steers whose age is less than 1 year old',
  )
  @TransformPurchasesArray()
  @IsOptional()
  steersLt1?: FeedlotPurchase[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(
    () => FeedlotPurchase,
    'Livestock purchases for traded Steers whose age is less than 1 year old',
  )
  @TransformPurchasesArray()
  @IsOptional()
  steersLt1Traded?: FeedlotPurchase[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(
    () => FeedlotPurchase,
    'Livestock purchases for Steers whose age is between 1 and 2 years old',
  )
  @TransformPurchasesArray()
  @IsOptional()
  steers1To2?: FeedlotPurchase[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(
    () => FeedlotPurchase,
    'Livestock purchases for traded Steers whose age is between 1 and 2 years old',
  )
  @TransformPurchasesArray()
  @IsOptional()
  steers1To2Traded?: FeedlotPurchase[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(
    () => FeedlotPurchase,
    'Livestock purchases for Steers whose age is greater than 2 years old',
  )
  @TransformPurchasesArray()
  @IsOptional()
  steersGt2?: FeedlotPurchase[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(
    () => FeedlotPurchase,
    'Livestock purchases for traded Steers whose age is greater than 2 years old',
  )
  @TransformPurchasesArray()
  @IsOptional()
  steersGt2Traded?: FeedlotPurchase[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(
    () => FeedlotPurchase,
    'Livestock purchases for Cows whose age is greater than 2 years old',
  )
  @TransformPurchasesArray()
  @IsOptional()
  cowsGt2?: FeedlotPurchase[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(
    () => FeedlotPurchase,
    'Livestock purchases for traded Cows whose age is greater than 2 years old',
  )
  @TransformPurchasesArray()
  @IsOptional()
  cowsGt2Traded?: FeedlotPurchase[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(
    () => FeedlotPurchase,
    'Livestock purchases for Heifers whose age is less than 1 year old',
  )
  @TransformPurchasesArray()
  @IsOptional()
  heifersLt1?: FeedlotPurchase[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(
    () => FeedlotPurchase,
    'Livestock purchases for traded Heifers whose age is less than 1 year old',
  )
  @TransformPurchasesArray()
  @IsOptional()
  heifersLt1Traded?: FeedlotPurchase[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(
    () => FeedlotPurchase,
    'Livestock purchases for Heifers whose age is between 1 and 2 years old',
  )
  @TransformPurchasesArray()
  @IsOptional()
  heifers1To2?: FeedlotPurchase[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(
    () => FeedlotPurchase,
    'Livestock purchases for traded Heifers whose age is between 1 and 2 years old',
  )
  @TransformPurchasesArray()
  @IsOptional()
  heifers1To2Traded?: FeedlotPurchase[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(
    () => FeedlotPurchase,
    'Livestock purchases for Heifers whose age is greater than 2 years old',
  )
  @TransformPurchasesArray()
  @IsOptional()
  heifersGt2?: FeedlotPurchase[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(
    () => FeedlotPurchase,
    'Livestock purchases for traded Heifers whose age is greater than 2 years old',
  )
  @TransformPurchasesArray()
  @IsOptional()
  heifersGt2Traded?: FeedlotPurchase[];
}
