# emissions-calculators

The emissions-calculators package aims to make it easy to calculate carbon emissions using the [Greenhouse Accounting Framework (GAF) Tools for Australian Primary Industries](https://piccc.org.au/resources/Tools.html). It is developed and maintained by [Agricultural Innovation Australia](https://aginnovationaustralia.com.au).

[![Agricultural Innovation Australia](./assets/logo-light.svg)](https://aginnovationaustralia.com.au)

The project implements the GAF tools as a javascript package that can be readily imported and used for calculations. The calculators are also available as an API as part of the [Environmental Accounting Platform (EAP)](https://www.aiaeap.com/).

# Installation

```bash
npm install @aginnovationaustralia/emissions-calculators
```

# Usage

If you're looking to make an emissions calculation with the least amount of setup required, you can simply pass your calculator input to `calculateEmissions`:

```javascript
import { calculateEmissions } from '@aginnovationaustralia/emissions-calculators';

export const beefInputData: BeefInput = {
  state: 'nsw' as const,
  northOfTropicOfCapricorn: true,
  rainfallAbove600: true,
  beef: [
    {
      classes: {
        bullsGt1: {
          autumn: {
            head: 50,
            liveweight: 600,
            liveweightGain: 50,
            crudeProtein: 12,
            dryMatterDigestibility: 65
          },
          ...
        }
      }
    }
  ]
}

const emissionsResult = calculateEmissions('beef', beefInputLatest);

if (result.status === 'OK') {
  console.log('Here are your emissions!', emissionsResult.emissions);
} else if (result.status === 'INVALID_INPUT') {
  console.error('Input was not valid', result.message);
} else {
  console.error('Error calculating emissions', result.error.message);
}
```

As well as the calculators and their types, there are some other resources that are important for building a robust calculator. You might want to perform the validation yourself, or make use of the `zod` validation schema:

```javascript
import {
  BeefInputSchema,
  validateCalculatorInput,
} from '@aginnovationaustralia/emissions-calculators';

const validation = validateCalculatorInput(BeefInputSchema, rawInput);

if (validation.valid) {
  console.log('Ready to use the input value', validation.result);
else {
  console.error('The input was not valid', validation.error);
}
```

You can also use specific nested exports if you only need a single calculator. This should allow for a smaller bundle size via tree shaking:

```javascript
import {
  calculateBeef,
  BeefInputSchema,
} from '@aginnovationaustralia/emissions-calculators/beef';
import type { BeefInput } from '@aginnovationaustralia/emissions-calculators/beef';
import { validateCalculatorInput } from '@aginnovationaustralia/emissions-calculators/validate';
```

The inputs required for a calculation are deeply nested objects with strict type requirements. The outputs are also nested objects with very specific types. You can access classes for all the input and output types via the top level exports, under `/types` or under each calculator nested import path:

```javascript
import { BeefClasses } from '@aginnovationaustralia/emissions-calculators';
import { BeefComplete } from '@aginnovationaustralia/emissions-calculators/beef';
import { BeefInput } from '@aginnovationaustralia/emissions-calculators/types';

const { BeefInput, BeefComplete, BeefClasses, BeefScope1Output } = Types;

const classes: BeefClasses = {
  steersGt2: {
    ...
  }
}

const beefEnterprise1: BeefComplete = {
  classes,
  limestone: 200,
  ...
}

export const beefInputData: BeefInput = {
  state: 'nsw' as const,
  northOfTropicOfCapricorn: true,
  rainfallAbove600: true,
  beef: [beefEnterprise1]
  ...
}
```

# Data and metrics collection

This package includes functionality to collect anonymous metrics on how often features are being used. The data collected is not associated with specific users or organisations, and includes no personally identifying information like email addresses. It is only to understand the runtime adoption and usage of each calculator.

If you don't want the library to report details of which calculators are being used, all reporting can be disabled by setting the environment variable `DISABLE_CALCULATOR_METRICS` to the value `true`. You can also supply it as a function parameter when calling a calculator.

The tool used to collect the usage metrics is [MixPanel](https://mixpanel.com/home/). The specific details that are collected is limited to:

- the calculator being used
- the version of the calculator
- the NPM package version in use
- whether the calculator succeeded or failed
- if you define it, the organisation using the package
- the `MixPanel` client will include the IP address of the machine sending the metrics, which in turn is used for basic geolocation of the origin

If you want to associate the execution of a calculator with your organisation, you can set a value for the environment variable `CALCULATOR_METRICS_ORGANISATION`. This is entirely optional. You might want to consider this to help with the process of getting support, if you are having problems or seeing errors.

The calculator functions also accept an optional `options` parameter which allows controlling these features.

# License

![Creative Commons Attribution No Derivatives](./assets/by.png)

This project is licensed under a [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/) license.

Made with ❤️ by <a href="https://exogee.com"><picture><source media="(prefers-color-scheme: dark)" srcset="./assets/exogee-white.svg"><img src="./assets/exogee-black.svg" alt="Exogee"></picture></a>
