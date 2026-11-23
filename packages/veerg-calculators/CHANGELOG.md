# Changelog

## [1.1.0-beta.2](https://github.com/aginnovationaustralia/emissions-calculators/compare/veerg-calculators-v1.1.0-beta.1...veerg-calculators-v1.1.0-beta.2) (2026-11-23)


### Features

* **calculators:** reverse sign on soil organic carbon loss changes ([#284](https://github.com/aginnovationaustralia/emissions-calculators/issues/284)) ([605ed6b](https://github.com/aginnovationaustralia/emissions-calculators/commit/605ed6b432785bab048109654aa98def566eec51))
* **calculators:** tighten up nitrogen fractions from components ([#295](https://github.com/aginnovationaustralia/emissions-calculators/issues/295)) ([6b3a7eb](https://github.com/aginnovationaustralia/emissions-calculators/commit/6b3a7eb4fe9941fcb7e4d50e71bf8b438f3630db))
* initial clone of calculators to veerg-calculators ([1f7d81a](https://github.com/aginnovationaustralia/emissions-calculators/commit/1f7d81a54080d4cdb5b932725ce238c05e5db18c))
* switch to v1.1.0 for the first release ([c89fd35](https://github.com/aginnovationaustralia/emissions-calculators/commit/c89fd3567c55ad3efb83f4091cd7a13910d6c437))
* updating root level files for new package ([989f9fd](https://github.com/aginnovationaustralia/emissions-calculators/commit/989f9fd48d630e240531a3a5957d67c25ea298d2))


### Bug Fixes

* Format units ([#289](https://github.com/aginnovationaustralia/emissions-calculators/issues/289)) ([b8eb5f3](https://github.com/aginnovationaustralia/emissions-calculators/commit/b8eb5f342c92adc96154f7e6d6baa39c39c6c602))

## [1.1.0-beta.2] - 2026-11-19

### Added

- calculator outputs include a new `intermediates` list exposing partial calculation values (such as raw gas quantities and purchased livestock emissions). Intermediates that share a name across herds or activities are summed and reported once
- other purchased goods and services can be entered as known items with built-in emissions factors (seed, miscellaneous goods, cleaning chemicals and pharmacy chemicals), as well as custom items with their own emissions factor
- state based emissions factors for purchased beef and sheep, with a state input accepted for method 2 purchases
- calcium nitrate as a fertiliser component, and organic fertilisers with a mandatory nitrogen fraction
- manufacturing beef as a purchased livestock option
- whole sardines as a purchased feed option for South Australia
- glyphosate as an agrochemical type
- the `ResearchCalculatorOptions` type is exported

### Changed

- unit strings in outputs now use conventional display units, e.g. `kg CO2e/J` instead of `Mass(CO2e) / Energy`
- nitrogen mineralised from soil organic carbon loss on land clearing (16.3) now uses the reversed sign of the organic carbon change, so carbon losses produce positive nitrogen
- natural gas via pipeline factors restructured and corrected; town gas is not supported in this release

### Fixed

- incorrect scope 3 emissions factors
- refrigerant intermediate output

## [1.1.0-beta.1] - 2026-11-10

Initial release of the `@aginnovationaustralia/veerg-calculators` package, implementing the Australian Government's Voluntary Emissions Estimation and Reporting Guidelines (VEERG).

- every chapter of the guidelines is implemented as an individual module
- modules are composed into industry specific calculators, following the module requirements in the guidelines
- the `all-modules` calculator accepts inputs for all modules in a single calculation
- emission factor constants use the 2026 National Greenhouse Accounts Factors
- zod input schemas and OpenAPI specs are published for every calculator.
