import { collectInputContainers, collectInputs } from './collect';
import {
  BaseContainer,
  BinaryContainer,
  Container,
  GenericContainer,
  InputKind,
  Metadata,
} from './containers';
import { AnyNumberUnit, AnyUnit } from './generic/units';
import { input, InputContainer } from './inputs';
import { sum } from './sum';
import {
  energyPerVolume,
  Mass,
  mass,
  massPerEnergy,
  Volume,
  volume,
} from './units';

/** An input container defined by another calculator, not derived from VEERG's InputContainer. */
class SectionInput<U extends AnyUnit> extends BaseContainer<U> {
  originType: 'input';
  sections: string[];

  constructor(unit: U, sections: string[], baseOrigin?: Metadata) {
    super(unit, baseOrigin);
    this.originType = 'input';
    this.sections = sections;
  }

  switchUnit<V extends AnyNumberUnit>(
    converter: (from: NoInfer<U>) => V,
  ): SectionInput<V> {
    return new SectionInput(converter(this.unit), this.sections, this.core);
  }
}

interface SectionInputKind extends InputKind {
  readonly container: SectionInput<this['unit']>;
}

/** Containers built only from SectionInputs, as a calculator would define for itself. */
type SectionContainer<U extends AnyUnit> = GenericContainer<
  U,
  SectionInputKind
>;

describe('a custom input container', () => {
  const quantity = new SectionInput(volume('Liquid fuel', 10), ['2.41'], {
    name: 'Qi',
  });
  const ec = new SectionInput(energyPerVolume('Liquid fuel', 3), ['2.41'], {
    name: 'ECi',
  });
  const ef = new SectionInput(massPerEnergy('CO2e', 2), ['2.41'], {
    name: 'EF',
  });

  it('works with the container arithmetic and keeps the unit types', () => {
    const emissions = ef.multiply(ec.multiply(quantity));
    const typed: BinaryContainer<Mass<'CO2e'>> = emissions;

    expect(typed.unit.store.toNumber()).toBe(60);
    expect(quantity.plus(quantity).unit.__unitType).toBe('Volume');
  });

  it('is accepted wherever the shared tools take a container', () => {
    const asContainer: Container<Volume<'Liquid fuel'>> = quantity;
    const total = sum([quantity, quantity]);
    const mixed = sum([
      quantity,
      input(volume('Liquid fuel', 1), { name: 'v', modules: [] }),
    ]);

    expect(asContainer.unit.store.toNumber()).toBe(10);
    expect(total.unit.store.toNumber()).toBe(20);
    expect(mixed.unit.store.toNumber()).toBe(11);
  });

  it('still catches substance mismatches', () => {
    const gas = new SectionInput(volume('Gaseous fuel', 1), ['2.41']);
    // @ts-expect-error a liquid fuel energy content cannot be applied to a gaseous fuel volume
    ec.multiply(gas);
  });

  it('keeps its own class through unit switches', () => {
    const switched = quantity.switchUnit(() => mass('Liquid fuel', 5));
    expect(switched).toBeInstanceOf(SectionInput);
    expect(switched.sections).toEqual(['2.41']);
  });

  it('is collected as an input', () => {
    const emissions = ef.multiply(ec.multiply(quantity));
    const inputs = collectInputContainers(emissions);

    expect(inputs.map((i) => i.core?.name)).toEqual(['EF', 'ECi', 'Qi']);
    expect(inputs.every((i) => i instanceof SectionInput)).toBe(true);
    expect(collectInputs(emissions)[0]).toEqual({
      name: 'EF',
      value: 2,
      method: '1',
      modules: [],
      quality: undefined,
    });
  });

  it('can be the only input container a narrowed container type accepts', () => {
    const veergInput = new InputContainer(volume('Liquid fuel', 1), '1', []);

    const ours: SectionContainer<Volume<'Liquid fuel'>> = quantity;
    const result: SectionContainer<Mass<'CO2e'>> = ef.multiply(
      ec.multiply(quantity),
    );
    // @ts-expect-error a VEERG input container is not a SectionInput
    const theirs: SectionContainer<Volume<'Liquid fuel'>> = veergInput;

    expect([ours, result, theirs]).toHaveLength(3);
  });
});
