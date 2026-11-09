# emissions-calculators

The [AIA Environmental Accounting Platform (EAP)](https://www.aiaeap.com/) is an on-farm GHG emissions calculation engine developed by [Agricultural Innovation Australia](https://aginnovationaustralia.com.au). Free access to AIA’s open-source code is supported by the Australian Government through funding from the _Improving Consistency of On-Farm Emissions Estimates Program_.

The objectives of this program are to:

- Support adoption and consistent incorporation of the Voluntary Emissions Estimation and Reporting Guidelines (VEERG) into third-party GHG accounting tools and calculators
- Provide a product that is freely available to third-party GHG accounting tool and calculator providers, encapsulates as many commodities as possible, and is suitable for mixed farming enterprises.
- Provide a product that is maintained and updated regularly until June 2028 to ensure it aligns with the guidelines.
- Improve producer and farm adviser access to GHG accounting tools to increase the proportion of producers that know and understand their business’s net emissions profile.

To deliver on the program’s objectives and ensure the Code remains consistent with the guidelines, it is recommended that:

- Users integrating the Code into their own systems, tools, or applications, retain the integrity of the original.
- Any enhancements to user interfaces, reporting layers, or data inputs do not interfere with or alter the functioning of the calculation logic.

If a user needs to adapt the Code to ensure it is compatible with their own platform or product, it is recommended that they first contact AIA to discuss any deviations required from the original Code.

On 19 October 2026, AIA released a beta-version of the open-source code aligned to the soft-release version of the Australian Government's Voluntary Emissions Estimation and Reporting Guidelines. The Guidelines-aligned code is published as the [`@aginnovationaustralia/veerg-calculators`](./packages/veerg-calculators/README.md) package. Users of the previous calculations code can transfer to the Guidelines-aligned code at their own pace, see [Choosing a package](#choosing-a-package).

The beta period is designed to help users prepare for the new Guidelines. We encourage code users to get familiar with the Guidelines and review AIA's [Documentation Site](https://docs.aiaplatform.com.au) to view the new NPM-package implemented in practice and access support information. The Guidelines are available to anyone on request by emailing Ag.Land-EmissionsReduction@dcceew.gov.au. Under the grant program, AIA also provides free API access to the EAP calculation engine.

As users test the code, we anticipate making further updates in response to feedback.

<p align='center'>
  <a href='https://aginnovationaustralia.com.au'>
    <img src='./assets/logo-light.svg' alt='Agricultural Innovation Australia' />
  </a>
</p>

# Choosing a package

This repository publishes two calculator packages to NPM. New integrations should use `veerg-calculators`.

|            | [`@aginnovationaustralia/veerg-calculators`](./packages/veerg-calculators/README.md)                           | [`@aginnovationaustralia/emissions-calculators`](./packages/calculators/README.md)               |
| ---------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Implements | The Voluntary Emissions Estimation and Reporting Guidelines (VEERG)                                            | The Greenhouse Accounting Framework (GAF) tools (`3.x`), plus early VEERG previews (`4.x` betas) |
| Status     | Actively developed, and the focus of all new features and Guidelines updates                                   | Maintained for existing users while they move to the Guidelines                                  |
| Structure  | Each chapter of the Guidelines is a module, composed into industry calculators and an `all-modules` calculator | One calculator per GAF spreadsheet (`3.x`)                                                       |
| Versioning | Starts at `1.0.0`, versioned against releases of the Guidelines                                                | Major and minor versions follow releases of the GAF spreadsheets                                 |
| REST API   | `/veerg/{version}`                                                                                             | `/calculator/{version}`                                                                          |

The `4.x` beta releases of `emissions-calculators` were the first preview of the Guidelines implementation. That work now continues in `veerg-calculators`, so if you are using a `4.x` beta, switch to `veerg-calculators`. The calculators, inputs and outputs are the same, apart from the package name in your imports.

The input and output shapes of the VEERG calculators differ from the GAF calculators, so moving from `emissions-calculators@3.x` will need changes to the data you supply. The OpenAPI specs in [`packages/veerg-calculators/openapi`](./packages/veerg-calculators/openapi) describe every input and output.

# Installation

```bash
npm install @aginnovationaustralia/veerg-calculators
```

# Usage

You can find more details on using the NPM package in its [README](./packages/veerg-calculators/README.md) file. It can be as simple as:

```typescript
import { calculateEmissions } from '@aginnovationaustralia/veerg-calculators';
import type { BeefInput } from '@aginnovationaustralia/veerg-calculators/beef';

const beefInputData: BeefInput = {
  herds: [
    {
      // herd details, classes and activities
      ...
    },
  ],
  ...
};

const emissionsResult = calculateEmissions('beef', beefInputData);

if (emissionsResult.status === 'OK') {
  console.log('Here are your emissions!', emissionsResult.emissions);
} else if (emissionsResult.status === 'INVALID_INPUT') {
  console.error('Input was not valid', emissionsResult.message);
} else {
  console.error('Error calculating emissions', emissionsResult.error.message);
}
```

The repo also includes [examples](./examples) to help you get started consuming the package.

## Research use

The [`@aginnovationaustralia/emissions-calculator-research`](./packages/research/README.md) package runs the same calculators with custom values for any of the constants, for research and sensitivity analysis. Results produced with overridden constants are not aligned with any VEERG guidance.

# Data and metrics collection

Understanding usage of the open source code provides AIA and the Australian Government with valuable insights to support and enhance its availability and utility.
The tools includes functionality to collect anonymous metrics on how often features are being used. The data collected is not associated with specific users or organisations and includes no personally identifying information like email addresses. It is only to understand the runtime adoption and usage of each calculator.

More details on configuring or disabling the metrics collection is available in the package [README](./packages/veerg-calculators/README.md#data-and-metrics-collection).

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

The project has very strict requirements on following the principles of [semantic versioning](https://semver.org) for each release. For `veerg-calculators`, the major and minor release numbers published to NPM stay in alignment with the corresponding releases of the Guidelines. Patch version numbers are available for issuing fixes and corrections to restore alignment with the Guidelines. The `emissions-calculators` package keeps its existing alignment with the GAF spreadsheets.

Each release of a package will trigger branching and tagging of the released commit.

# Publishing releases

New versions of the package are published to the NPM registry via a [Github action](./.github/workflows/publish.yml). The action will run when a new version tag is pushed to the repository. Only limited users have permission to push a tag for a new version.

- When a version is ready to be released, update the version number of the calculators [package.json](./packages/calculators/package.json) to the new desired version
- The most common release will be a patch version bump. You can run `pnpm run version:bump` to achieve this
- Submit your changes using the regular PR approval workflow
- Tag the latest commit with the new version ie `v1.5.17`
- Push the new tag with `git push --tags`
- The automated publish will trigger when the new tag is detected

The [veerg-calculators package](./packages/veerg-calculators/package.json) is versioned independently, and its tags include the package name, ie `veerg-calculators-v1.0.0-beta.1`. The same publish action handles these tags, publishing from `packages/veerg-calculators` instead.

The [research package](./packages/research/package.json) is versioned independently, and its tags include the package name, ie `emissions-calculator-research-v0.1.0`. It depends on the exact version of the calculators package it was published with, so release it after each calculators release.

# License

![Creative Commons Attribution](./assets/by.png)

This project is licensed under a [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/) license.

All users of the Code must acknowledge AIA as the source and maintainer of the EAP Calculator Engine code. All users of the Code must acknowledge that free access to the Code is supported by the Australian Government through funding from the Improving Consistency of On-Farm Emissions Estimates Program.

The acknowledgement must be displayed in documentation, digital interfaces, or product materials where attribution of technical components is ordinarily provided.

This includes the right to display the [‘Powered by EAP’](https://www.aiaeap.com/branding) logo in any systems which directly or indirectly use the open-source code, in a way which is clearly visible to third-party clients/customers/users of those systems.

At a minimum, the acknowledgement must state:

> “This product incorporates the EAP Calculator Engine open-source code developed and maintained by Agricultural Innovation Australia Ltd. Free access to AIA’s open-source code is supported by the Australian Government through funding from the Improving Consistency of On-Farm Emissions Estimates Program”

Users may not imply or state endorsement by AIA, unless explicit written consent from AIA has been granted. Users must not imply or state endorsement by the Australian Government.

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
