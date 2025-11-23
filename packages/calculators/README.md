# emissions-calculators

The emissions-calculators package aims to make it easy to calculate carbon emissions using the [Greenhouse Accounting Framework (GAF) Tools for Australian Primary Industries](https://piccc.org.au/resources/Tools.html). It is developed and maintained by [Agricultural Innovation Australia](https://aginnovationaustralia.com.au).

The project implements the GAF tools as a javascript package that can be readily imported and used for calculations. The calculators are also available as an API as part of the [Environmental Accounting Platform (EAP)](https://www.aiaeap.com/).

# Installation

```bash
npm install @aginnovationaustralia/emissions-calculators
```

# Usage

```javascript
import { Calculators, Types } from '@aginnovationaustralia/emissions-calculators';

const { calculateBeef } = Calculators;
const { BeefInput, BeefOutput } = Types;

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

const beefResults: BeefOutput = calculateBeef(beefInputLatest);
```

You can also use specific nested exports if you only need a single calculator. This should allow for a smaller bundle size via tree shaking:

```javascript
import { calculateBeef } from '@aginnovationaustralia/emissions-calculators/beef';
import type { BeefInput } from '@aginnovationaustralia/emissions-calculators/beef';
```

As well as the calculators and their types, there are some other resources that are useful for building a robust calculator:

```javascript
import {
  CalculatorNames,
  validateCalculatorInput,
} from '@aginnovationaustralia/emissions-calculators/tools';
```

The input objects required for a calculation are deeply nested objects with strict type requirements. The outputs are also nested objects with very specific types. You can access classes for all the input and output types via the `Types`:

```javascript
import { Types } from '@aginnovationaustralia/emissions-calculators';

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

# License

![Creative Commons Attribution No Derivatives](./doc/assets/by-nd.png)

This project is licensed under a [Creative Commons Attribution No Derivatives 4.0](https://creativecommons.org/licenses/by-nd/4.0/) license.
