# Changelog

## [1.1.0-beta.4](https://github.com/aginnovationaustralia/emissions-calculators/compare/veerg-calculators-v1.1.0-beta.3...veerg-calculators-v1.1.0-beta.4) (2026-11-26)


### ⚠ BREAKING CHANGES

* removing Ammonium Sulfate as a duplicate inorganic fertiliser input ([#285](https://github.com/aginnovationaustralia/emissions-calculators/issues/285))
* the flat dairy intensity keys `liveweightIntensity*` and `milkIntensity*` move under `energyIntensities`, with mass based equivalents under `massIntensities`.

### Features

* **calculators:** accept optional RPP and JRPP inputs for market-based electricity ([#329](https://github.com/aginnovationaustralia/emissions-calculators/issues/329)) ([9cb6914](https://github.com/aginnovationaustralia/emissions-calculators/commit/9cb69140c4c4116dbfb4de3254dfad0e112b67c7))
* **calculators:** expose mass of N in manure applicable to soils (AIA-76) ([#298](https://github.com/aginnovationaustralia/emissions-calculators/issues/298)) ([279c75c](https://github.com/aginnovationaustralia/emissions-calculators/commit/279c75c4bc841560e24be71f68ce5a04749a350e))
* expose mass based allocation for dairy intensities ([#297](https://github.com/aginnovationaustralia/emissions-calculators/issues/297)) ([d6d2191](https://github.com/aginnovationaustralia/emissions-calculators/commit/d6d2191671c4f6a8e8bab703fb96b417af31ae56))
* removing Ammonium Sulfate as a duplicate inorganic fertiliser input ([#285](https://github.com/aginnovationaustralia/emissions-calculators/issues/285)) ([16e61b6](https://github.com/aginnovationaustralia/emissions-calculators/commit/16e61b6da8a00f8c2cd69f453f74e15842e36201))
* **sheep:** use greasy wool for wool intensities (AIA-88) ([#313](https://github.com/aginnovationaustralia/emissions-calculators/issues/313)) ([36552ff](https://github.com/aginnovationaustralia/emissions-calculators/commit/36552ff50e3c6891c60a9fbf5adcb8ac4d3087f0))


### Bug Fixes

* **calculators:** switch to correct auslci livestock EFs, aligns with GEETA ([#330](https://github.com/aginnovationaustralia/emissions-calculators/issues/330)) ([10818e2](https://github.com/aginnovationaustralia/emissions-calculators/commit/10818e29f47d512aa25154638d1d546c9540dcdd))
* cotton intensity is using lint value for seed ([#315](https://github.com/aginnovationaustralia/emissions-calculators/issues/315)) ([6c53515](https://github.com/aginnovationaustralia/emissions-calculators/commit/6c53515416a12d820ec5b1b3c4c4c1fde4de3cf2))
* Volatile solid production for sheep manure ([#286](https://github.com/aginnovationaustralia/emissions-calculators/issues/286)) ([6b762bf](https://github.com/aginnovationaustralia/emissions-calculators/commit/6b762bfdf2f5257af5ada4695d2f9893a81a35da))

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
