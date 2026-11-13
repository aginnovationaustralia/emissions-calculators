# Changelog

## 1.1.0-beta.1 (2026-11-13)


### Features

* **calculators:** reverse sign on soil organic carbon loss changes ([#284](https://github.com/aginnovationaustralia/emissions-calculators/issues/284)) ([605ed6b](https://github.com/aginnovationaustralia/emissions-calculators/commit/605ed6b432785bab048109654aa98def566eec51))
* initial clone of calculators to veerg-calculators ([1f7d81a](https://github.com/aginnovationaustralia/emissions-calculators/commit/1f7d81a54080d4cdb5b932725ce238c05e5db18c))
* switch to v1.1.0 for the first release ([c89fd35](https://github.com/aginnovationaustralia/emissions-calculators/commit/c89fd3567c55ad3efb83f4091cd7a13910d6c437))
* updating root level files for new package ([989f9fd](https://github.com/aginnovationaustralia/emissions-calculators/commit/989f9fd48d630e240531a3a5957d67c25ea298d2))

## [1.1.0-beta.1] - 2026-11-10

Initial release of the `@aginnovationaustralia/veerg-calculators` package, implementing the Australian Government's Voluntary Emissions Estimation and Reporting Guidelines (VEERG).

- every chapter of the guidelines is implemented as an individual module
- modules are composed into industry specific calculators, following the module requirements in the guidelines
- the `all-modules` calculator accepts inputs for all modules in a single calculation
- emission factor constants use the 2026 National Greenhouse Accounts Factors
- zod input schemas and OpenAPI specs are published for every calculator.
