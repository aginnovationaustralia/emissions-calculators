# emissions-calculators

🚧 This readme is a work in progress 🚧

The emissions-calculators package aims to make it easy to calculate carbon emissions using the [Greenhouse Accounting Framework (GAF) Tools for Australian Primary Industries](https://piccc.org.au/resources/Tools.html). It is developed and maintained by [Agricultural Innovation Australia](https://aginnovationaustralia.com.au).

The project implements the GAF tools as a javascript package that can be readily imported and used for calculations. The calculators are also available as an API as part of the [Environmental Accounting Platform (EAP)](https://www.aiaeap.com/).

# Installation

```bash
npm install @aginnovationaustralia/emissions-calculators
```

# Usage

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

You can also choose specific versions with a longer, more specific path:
```javascript
import { calculateBeef } from '@aginnovationaustralia/emissions-calculators/versions/3.0.0/calculators';
import { BeefInput } from '@aginnovationaustralia/emissions-calculators/versions/3.0.0/types/Beef/input';

...
```

# Data and metrics collection

This package includes functionality to collect anonymous metrics on how often features are being used. The data collected is not associated with specific users or organisations, and includes no personally identifying information like email addresses. It is only to understand the runtime adoption and usage of each calculator.

If you don't want the library to report details of which calculators are being used, all reporting can be disabled by setting the environment variable `DISABLE_CALCULATOR_METRICS` to the value `true`.

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