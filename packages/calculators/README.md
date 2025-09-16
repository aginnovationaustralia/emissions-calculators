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

# License

![Creative Commons Attribution No Deriviatives](./doc/assets/by-nd.png)

This project is licensed under a [Creative Commons Attribution No Derivatives 4.0](https://creativecommons.org/licenses/by-nd/4.0/) license.