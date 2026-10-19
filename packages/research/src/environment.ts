import {
  AllConstants,
  applyConstantOverrides,
  CalculatorOptions,
  ConstantOverrides,
  loadConstants,
  NodeEnvironment,
} from '@aginnovationaustralia/emissions-calculators/internal';

export type { ConstantOverrides };

export type ResearchCalculatorOptions = CalculatorOptions & {
  overrides?: ConstantOverrides;
};

/**
 * A Node.js Environment that loads constants with the overrides from the current ResearchEnvironment.
 */
class ResearchNodeEnvironment extends NodeEnvironment {
  private overrides?: ConstantOverrides;

  constructor(options?: ResearchCalculatorOptions) {
    super(options);
    this.overrides = options?.overrides;
  }

  loadConstants(): AllConstants {
    const { constants, warnings } = applyConstantOverrides(
      loadConstants(),
      this.overrides,
    );

    for (const warning of warnings) {
      // eslint-disable-next-line no-console
      console.warn(`[ResearchEnvironment] ${warning}`);
    }

    return constants;
  }
}

export { ResearchNodeEnvironment };
