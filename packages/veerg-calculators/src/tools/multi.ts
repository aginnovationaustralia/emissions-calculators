import { BaseContainer, Metadata, NumberContainer } from './containers';
import { NumberUnit, VoidUnit } from './units';
import { mergeSeeds, ValueStore } from './value-store';

/**
 * Container for capturing both a container for default method 1 calculations, and an optional container for method 2 calculations.
 * This just stores the containers that provided the method 1 and 2 based values, not the values themselves.
 */
export class Method1And2Container<
  U extends NumberUnit,
> extends BaseContainer<U> {
  originType: 'method1and2';
  method1: NumberContainer<U>;
  method2: NumberContainer<U> | undefined;
  constructor(
    method1: NumberContainer<U>,
    method2: NumberContainer<U> | undefined,
    baseOrigin?: Metadata,
  ) {
    // Prefer method 2's computed value when present (entity-specific / higher tier).
    // Both method trees are retained for provenance via ValueStore.
    // Always take method1's method-1 track (not `.value`), so nested dual stores
    // don't leak a method-2 intermediate into the method-1 slot.
    const source = method2 ?? method1;
    const newUnit = {
      ...source.unit,
      store: new ValueStore(mergeSeeds(method1, method2)),
    };
    super(newUnit, baseOrigin);
    this.originType = 'method1and2';
    this.method1 = method1;
    this.method2 = method2;
  }

  switchUnit<UN extends U extends NumberUnit ? U : never, V extends NumberUnit>(
    converter: (from: UN) => V,
  ): Method1And2Container<V> {
    return new Method1And2Container(
      this.method1.switchUnit(converter),
      this.method2?.switchUnit(converter),
      this.core,
    );
  }
}

/**
 * Container for a value that can only be calculated via method 2, because no method 1 equivalent
 * of the calculation exists. The method 2 value can come from an arbitrary tree of containers, so
 * the method 2 track is asserted here rather than relying on method 2 inputs deeper in the tree.
 */
export class Method2Container<U extends NumberUnit> extends BaseContainer<U> {
  originType: 'method2';
  method2: NumberContainer<U>;
  constructor(method2: NumberContainer<U>, baseOrigin?: Metadata) {
    const newUnit = {
      ...method2.unit,
      store: new ValueStore({ valueMethod2: method2.unit.store.value }),
    };
    super(newUnit, baseOrigin);
    this.originType = 'method2';
    this.method2 = method2;
  }

  switchUnit<UN extends U extends NumberUnit ? U : never, V extends NumberUnit>(
    converter: (from: UN) => V,
  ): Method2Container<V> {
    return new Method2Container(this.method2.switchUnit(converter), this.core);
  }
}

const isVoidUnit = (
  value: NumberContainer<NumberUnit> | VoidUnit,
): value is VoidUnit => '__unitType' in value && value.__unitType === 'Void';

/**
 * Handle branching of logic to calculate method 1 vs 2 values. In general, method 1 values should always be available, and method 2 values can be supplied via optional inputs from the user.
 * There are some cases where method 1 is not possible if method 2 was chosen, and this is the reason for passing a VoidUnit as the method 1 value.
 * @param method1Value - The method 1 value to capture, or voidUnit if no value is possible.
 * @param method2Value - The method 2 value to capture, or undefined if no value is available.
 * @returns Returns the method1 container if method 2 is not provided, a method2 container if method 1 is void, and a method1and2 container if both are provided.
 */
export function captureMethod1Or2Value<U extends NumberUnit>(
  method1Value: VoidUnit,
  method2Value: NumberContainer<U>,
): NumberContainer<U>;
export function captureMethod1Or2Value<U extends NumberUnit>(
  method1Value: NumberContainer<U>,
  method2Value: NumberContainer<U> | undefined,
): NumberContainer<U>;
export function captureMethod1Or2Value<U extends NumberUnit>(
  method1Value: NumberContainer<U> | VoidUnit,
  method2Value: NumberContainer<U> | undefined,
): NumberContainer<U> {
  if (method2Value === undefined) {
    return method1Value as NumberContainer<U>;
  }
  if (isVoidUnit(method1Value)) {
    return new Method2Container(method2Value);
  }
  return new Method1And2Container(method1Value, method2Value);
}
