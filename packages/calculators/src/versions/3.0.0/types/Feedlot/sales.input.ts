import { Transform, plainToClass } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import 'reflect-metadata';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { FeedlotSale } from './sale.input';

const TransformSalesArray = () =>
  Transform(({ value }: { value: FeedlotSale | FeedlotSale[] }) =>
    Array.isArray(value)
      ? value.map((p) => plainToClass(FeedlotSale, p))
      : [plainToClass(FeedlotSale, value)],
  );

@SchemaDescription(
  'Note: passing a single `FeedlotSale` for each class is now deprecated, please pass an array (`FeedlotSales[]`) instead',
)
export class FeedlotSales {
  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(
    () => FeedlotSale,
    'Livestock sales for bulls whose age is greater than 1 year old',
  )
  @TransformSalesArray()
  @IsDefined()
  bullsGt1!: FeedlotSale[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(
    () => FeedlotSale,
    'Livestock sales for traded bulls whose age is greater than 1 year old',
  )
  @TransformSalesArray()
  @IsDefined()
  bullsGt1Traded!: FeedlotSale[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(
    () => FeedlotSale,
    'Livestock sales for Steers whose age is less than 1 year old',
  )
  @TransformSalesArray()
  @IsDefined()
  steersLt1!: FeedlotSale[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(
    () => FeedlotSale,
    'Livestock sales for traded Steers whose age is less than 1 year old',
  )
  @TransformSalesArray()
  @IsDefined()
  steersLt1Traded!: FeedlotSale[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(
    () => FeedlotSale,
    'Livestock sales for Steers whose age is between 1 and 2 years old',
  )
  @TransformSalesArray()
  @IsDefined()
  steers1To2!: FeedlotSale[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(
    () => FeedlotSale,
    'Livestock sales for traded Steers whose age is between 1 and 2 years old',
  )
  @TransformSalesArray()
  @IsDefined()
  steers1To2Traded!: FeedlotSale[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(
    () => FeedlotSale,
    'Livestock sales for Steers whose age is greater than 2 years old',
  )
  @TransformSalesArray()
  @IsDefined()
  steersGt2!: FeedlotSale[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(
    () => FeedlotSale,
    'Livestock sales for traded Steers whose age is greater than 2 years old',
  )
  @TransformSalesArray()
  @IsDefined()
  steersGt2Traded!: FeedlotSale[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(
    () => FeedlotSale,
    'Livestock sales for Cows whose age is greater than 2 years old',
  )
  @TransformSalesArray()
  @IsDefined()
  cowsGt2!: FeedlotSale[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(
    () => FeedlotSale,
    'Livestock sales for traded Cows whose age is greater than 2 years old',
  )
  @TransformSalesArray()
  @IsDefined()
  cowsGt2Traded!: FeedlotSale[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(
    () => FeedlotSale,
    'Livestock sales for Heifers whose age is less than 1 year old',
  )
  @TransformSalesArray()
  @IsDefined()
  heifersLt1!: FeedlotSale[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(
    () => FeedlotSale,
    'Livestock sales for traded Heifers whose age is less than 1 year old',
  )
  @TransformSalesArray()
  @IsDefined()
  heifersLt1Traded!: FeedlotSale[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(
    () => FeedlotSale,
    'Livestock sales for Heifers whose age is between 1 and 2 years old',
  )
  @TransformSalesArray()
  @IsDefined()
  heifers1To2!: FeedlotSale[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(
    () => FeedlotSale,
    'Livestock sales for traded Heifers whose age is between 1 and 2 years old',
  )
  @TransformSalesArray()
  @IsDefined()
  heifers1To2Traded!: FeedlotSale[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(
    () => FeedlotSale,
    'Livestock sales for Heifers whose age is greater than 2 years old',
  )
  @TransformSalesArray()
  @IsDefined()
  heifersGt2!: FeedlotSale[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(
    () => FeedlotSale,
    'Livestock sales for traded Heifers whose age is greater than 2 years old',
  )
  @TransformSalesArray()
  @IsDefined()
  heifersGt2Traded!: FeedlotSale[];
}
