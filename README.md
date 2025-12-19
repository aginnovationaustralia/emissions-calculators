# emissions-calculators

The [AIA Environmental Accounting Platform (EAP)](https://www.aiaeap.com/) is an on-farm GHG emissions calculation engine developed by [Agricultural Innovation Australia](https://aginnovationaustralia.com.au). Free access to AIA’s open-source code is supported by the Australian Government through funding from the _Improving Consistency of On-Farm Emissions Estimates Program_.

The objectives of this program are to:

- Support adoption and consistent incorporation of the forthcoming guidelines (and in the meantime, the Greenhouse Accounting Framework tools) into third-party GHG accounting tools and calculators
- Provide a product that is freely available to third-party GHG accounting tool and calculator providers, encapsulates as many commodities as possible, and is suitable for mixed farming enterprises.
- Provide a product that is maintained and updated regularly until June 2028 to ensure it aligns with the guidelines once available and the GAF tools in the meantime.
- Improve producer and farm adviser access to GHG accounting tools to increase the proportion of producers that know and understand their business’s net emissions profile.

To deliver on the program’s objectives and ensure the Code remains consistent with the forthcoming guidelines, and in the meantime the GAF tools, it is recommended that:

- Users integrating the Code into their own systems, tools, or applications, retain the integrity of the original.
- Any enhancements to user interfaces, reporting layers, or data inputs do not interfere with or alter the functioning of the calculation logic.

If a user needs to adapt the Code to ensure it is compatible with their own platform or product, it is recommended that they first contact AIA to discuss any deviations required from the original Code.

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

You can find more details on using the NPM package in its [README](./packages/calculators/README.md) file. It can be as simple as:

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

The repo also includes [examples](./examples) to help you get started consuming the package.

# Data and metrics collection

Understanding usage of the open source code provides AIA and the Australian Government with valuable insights to support and enhance its availability and utility.
The tools includes functionality to collect anonymous metrics on how often features are being used. The data collected is not associated with specific users or organisations and includes no personally identifying information like email addresses. It is only to understand the runtime adoption and usage of each calculator.

More details on configuring or disabling the metrics collection is available in the package [README](./packages/calculators/README.md#data-and-metrics-collection).

# Use of code and making contributions

Organisations, users, developers, and software products that integrate or make use of the Code, whether directly or indirectly, should first read the [AIA EAP Open Source Code Use Policy](https://www.aiaeap.com/_files/ugd/78d843_9e54854b615f4d5b891a58453fe2829a.pdf), which establishes the terms of use for the code.

By providing a contribution to us, you agree to be bound by the terms and conditions contained in the [AIA EAP Open Source Code Contributor Licence Agreement](https://www.aiaeap.com/_files/ugd/78d843_76f5b1cec5034ca18188d96f977704a7.pdf).

All community members are expected to understand and respect out [code of conduct](./CODE_OF_CONDUCT.md). Our code of conduct is based on the [Contributor Covenant](https://www.contributor-covenant.org/version/3/0/).

# Support

There are several support resources available to you.

We aim to make the tools as easy to use as possible out of the box, and for users to be able to self service their own questions. We have detailed developer documentation available here in the repo. Documentation for consuming the REST API is available online [here](https://docs.aiaplatform.com.au/).

If you still have a question, feel free to [open a github issue](https://github.com/aginnovationaustralia/emissions-calculators/issues/new) and fill in the template with as much context as possible. We aim to have a response to your question within 24 hours.

If you would like to get involved and contribute to the project, you can find more details [here](./CONTRIBUTING.md).

# Terms and Conditions

By providing a contribution to us, you agree to be bound by the terms and conditions contained in the [AIA EAP Open Source Code Contributor Licence Agreement](https://www.aiaeap.com/_files/ugd/78d843_76f5b1cec5034ca18188d96f977704a7.pdf).

All community members are expected to understand and respect out [code of conduct](./CODE_OF_CONDUCT.md). Our code of conduct is based on the [Contributor Covenant](https://www.contributor-covenant.org/version/3/0/).

# Versioning

The project has very strict requirements on following the principles of [semantic versioning](https://semver.org) for each release. The major and minor release numbers for packages published to NPM are required to stay in alignment with the corresponding releases of GAF spreadsheets. Patch version numbers are available for issuing fixes and corrections to restore alignment with the reference sheets.

Each release of a package will trigger branching and tagging of the released commit.

# Publishing releases

New versions of the package are published to the NPM registry via a [Github action](./.github/workflows/publish.yml). The action will run when a new version tag is pushed to the repository. Only limited users have permission to push a tag for a new version.

- When a version is ready to be released, update the version number of the calculators [package.json](./packages/calculators/package.json) to the new desired version
- The most common release will be a patch version bump. You can run `pnpm run version:bump` to achieve this
- Submit your changes using the regular PR approval workflow
- Tag the latest commit with the new version ie `v1.5.17`
- Push the new tag with `git push --tags`
- The automated publish will trigger when the new tag is detected

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
