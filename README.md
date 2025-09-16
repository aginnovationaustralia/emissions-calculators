# emissions-calculators

🚧 This readme is a work in progress 🚧

The emissions-calculators project aims to make it easy to calculate carbon emissions using the [Greenhouse Accounting Framework (GAF) Tools for Australian Primary Industries](https://piccc.org.au/resources/Tools.html). It is developed and maintained by [Agricultural Innovation Australia](https://aginnovationaustralia.com.au).

The project implements the GAF tools as a javascript package that can be readily imported and used for calculations. The calculators are also available as an API as part of the [Environmental Accounting Platform (EAP)](https://www.aiaeap.com/). Implementation of these tools is a key aspect of delivering the [Improving Consistency of On-farm Emissions Estimates](https://www.agriculture.gov.au/agriculture-land/farm-food-drought/climatechange/greenhouse-gas-accounting/grant-program) grant program.

# Installation

```bash
npm install @aginnovationaustralia/emissions-calculators
```

# Usage

You can find more details on using the NPM package in its [README](./packages/calculators/README.md) file. It can be as simple as:

```javascript
import { calculateBeef } from '@aginnovationaustralia/emissions-calculators/calculators';
import { BeefInput } from '@aginnovationaustralia/emissions-calculators/types/Beef/input';

export const beefInputData = {
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

const beefResults = calculateBeef(beefInputLatest);
```

# Data and metrics collection

These tools includes functionality to collect anonymous metrics on how often features are being used. Understanding how the tools are being used is an important aspect of the [Improving Consistency of On-farm Emissions Estimates](https://www.agriculture.gov.au/agriculture-land/farm-food-drought/climatechange/greenhouse-gas-accounting/grant-program) grant program.

# Contributing and support

TODO

# Code of conduct

TODO

# Publishing packages to NPM

The process to publish packages is wrapped up with a few top level commands:

```bash
pnpm run version:bump
pnpm run publish:dry
pnpm run publish:packages
```

This will require you to authenticate, then will publish the new version to the NPM registry.

# License

![Creative Commons Attribution No Derivatives](./doc/assets/by-nd.png)

This project is licensed under a [Creative Commons Attribution No Derivatives 4.0](https://creativecommons.org/licenses/by-nd/4.0/) license.