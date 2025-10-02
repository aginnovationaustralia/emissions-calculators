# emissions-calculators

The emissions-calculators project aims to make it easy to calculate carbon emissions using the [Greenhouse Accounting Framework (GAF) Tools for Australian Primary Industries](https://piccc.org.au/resources/Tools.html). It is developed and maintained by [Agricultural Innovation Australia](https://aginnovationaustralia.com.au).

The project implements the GAF tools as a javascript package that can be readily imported and used for calculations. The calculators are also available as an API as part of the [Environmental Accounting Platform (EAP)](https://www.aiaeap.com/). Implementation of these tools is a key aspect of delivering the [Improving Consistency of On-farm Emissions Estimates](https://www.agriculture.gov.au/agriculture-land/farm-food-drought/climatechange/greenhouse-gas-accounting/grant-program) grant program.

# Installation

```bash
npm install @aginnovationaustralia/emissions-calculators
```

# Usage

You can find more details on using the NPM package in its [README](./packages/calculators/README.md) file. It can be as simple as:

```javascript
import { v3_0_0 } from '@aginnovationaustralia/emissions-calculators';

const { calculateBeef } = v3_0_0.Calculators;
const { BeefInput, BeefOutput } = v3_0_0.Types;

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

The repo also includes [examples](./examples) to help you get started consuming the package.

# Data and metrics collection

These tools include functionality to collect anonymous metrics on how often key features are being used. Understanding how the tools are being used is an important requirement for the [Improving Consistency of On-farm Emissions Estimates](https://www.agriculture.gov.au/agriculture-land/farm-food-drought/climatechange/greenhouse-gas-accounting/grant-program) grant program, to ensure the tools are useful and accessible for all potential users.

More details on configuring or disabling the metrics collection is available in the package [README](./packages/calculators/README.md#data-and-metrics-collection).

# Contributing and support

If you are looking for help using the tools available here, there are a number of resources available to you.

First of all, we aim to make the tools as easy to use as possible out of the box, and for users to be able to self service their own questions. We have detailed developer documentation available here in the repo. Documentation for consuming the REST API is available online [here](https://docs.aiaplatform.com.au).

If you still have a question, feel free to [open a github issue](https://github.com/aginnovationaustralia/emissions-calculators/issues/new) and fill in the template with as much context as possible. We aim to have a response to your question within 24 hours.

If you would like to get involved and contribute to the project, you can find more details [here](./CONTRIBUTING.md).

# Code of conduct

All community members are expected to understand and respect out [code of conduct](./CODE_OF_CONDUCT.MD). Our code of conduct is based on the [Contributor Covenant](https://www.contributor-covenant.org/version/3/0/).

# Versioning

The project has very strict requirements on following the principles of [semantic versioning](https://semver.org) for each release. The major and minor release numbers for packages published to NPM are required to stay in alignment with the corresponding releases of GAF spreadsheets. Patch version numbers are available for issuing fixes and corrections to restore alignment with the reference sheets.

Each release of a package will trigger branching and tagging of the released commit.

# License

![Creative Commons Attribution No Derivatives](./doc/assets/by-nd.png)

This project is licensed under a [Creative Commons Attribution No Derivatives 4.0](https://creativecommons.org/licenses/by-nd/4.0/) license.
