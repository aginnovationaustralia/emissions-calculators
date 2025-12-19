# emissions-calculators

The [AIA Environmental Accounting Platform (EAP)](https://www.aiaeap.com/) is an on-farm GHG emissions calculation engine developed by [Agricultural Innovation Australia](https://aginnovationaustralia.com.au). Free access to AIA’s open-source code is supported by the Australian Government through funding from the _Improving Consistency of On-Farm Emissions Estimates Program_.

The objectives of this program are to:

- Support adoption and consistent incorporation of the forthcoming guidelines (and in the meantime, the Greenhouse Accounting Framework tools) into third-party GHG accounting tools and calculators
- Provide a product that is freely available to third-party GHG accounting tool and calculator providers, encapsulates as many commodities as possible, and is suitable for mixed farming enterprises.
- Provide a product that is maintained and updated regularly until June 2028 to ensure it aligns with the guidelines once available and the GAF tools in the meantime.
- Improve producer and farm adviser access to GHG accounting tools to increase the proportion of producers that know and understand their business’s net emissions profile.

Currently, the EAP implements the GAF tools as a JavaScript package that can be readily imported and used for calculations and will transition to the Australian Government’s guidelines once they are available.
Under the grant program, AIA also provides [free API access to the EAP calculation engine](https://www.aiaeap.com/partner).

<p align='center'>
  <a href='https://aginnovationaustralia.com.au'>
    <img src='./assets/logo-light.svg' alt='Agricultural Innovation Australia' />
  </a>
</p>

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

Understanding usage of the open source code provides AIA and the Australian Government with valuable insights to support and enhance its availability and utility.
The tools includes functionality to collect anonymous metrics on how often features are being used. The data collected is not associated with specific users or organisations and includes no personally identifying information like email addresses. It is only to understand the runtime adoption and usage of each calculator.

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

# Use of code and making contributions

Organisations, users, developers, and software products that integrate or make use of the Code, whether directly or indirectly, should first read the [AIA EAP Open Source Code Use Policy](https://www.aiaeap.com/_files/ugd/78d843_9e54854b615f4d5b891a58453fe2829a.pdf), which establishes the terms of use for the code.

# Support

There are several support resources available to you.

We aim to make the tools as easy to use as possible out of the box, and for users to be able to self service their own questions. We have detailed developer documentation available here in the repo. Documentation for consuming the REST API is available online [here](https://docs.aiaplatform.com.au/).

If you still have a question, feel free to [open a github issue](https://github.com/aginnovationaustralia/emissions-calculators/issues/new) and fill in the template with as much context as possible. We aim to have a response to your question within 24 hours.

# Versioning

The project has very strict requirements on following the principles of [semantic versioning](https://semver.org) for each release. The major and minor release numbers for packages published to NPM are required to stay in alignment with the corresponding releases of GAF spreadsheets. Patch version numbers are available for issuing fixes and corrections to restore alignment with the reference sheets.

Each release of a package will trigger branching and tagging of the released commit.

# License

[Creative Commons Attribution](./assets/by.png)

This project is licensed under a [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/) license.

---

<p align="center">
Made with ❤️ by
</p>

<p align="center">
    <a href="https://exogee.com">
        <picture>
            <source media="(prefers-color-scheme: dark)" srcset="./assets/exogee-white.svg">
            <img src="./assets/exogee-black.svg" alt="Exogee">
        </picture>
    </a>
</p>
