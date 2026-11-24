# Changelog

## [1.1.0-beta.3](https://github.com/aginnovationaustralia/emissions-calculators/compare/veerg-calculators-v1.1.0-beta.2...veerg-calculators-v1.1.0-beta.3) (2026-11-24)


### Bug Fixes

* ship units and inputs packages as commonjs as well, roll back engine requirement to node 22 ([5ba8a1b](https://github.com/aginnovationaustralia/emissions-calculators/commit/5ba8a1b100e6b265b0b1955e198523b6a3a6a373))

## [1.1.0-beta.2](https://github.com/aginnovationaustralia/emissions-calculators/compare/veerg-calculators-v1.1.0-beta.1...veerg-calculators-v1.1.0-beta.2) (2026-11-23)

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
- make sure the nitrogen content of ammonia components on a fertiliser application is populated, instead of 0
- incorporate changes to VEERG guidelines, to fix organic carbon loss change by reversing sign (emissions are now negative)

## [1.1.0-beta.1] - 2026-11-10

Initial release of the `@aginnovationaustralia/veerg-calculators` package, implementing the Australian Government's Voluntary Emissions Estimation and Reporting Guidelines (VEERG).

- every chapter of the guidelines is implemented as an individual module
- modules are composed into industry specific calculators, following the module requirements in the guidelines
- the `all-modules` calculator accepts inputs for all modules in a single calculation
- emission factor constants use the 2026 National Greenhouse Accounts Factors
- zod input schemas and OpenAPI specs are published for every calculator.
