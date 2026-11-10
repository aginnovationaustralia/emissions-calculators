# Changelog

## [1.1.0-beta.1] - 2026-11-10

Initial release of the `@aginnovationaustralia/veerg-calculators` package, implementing the Australian Government's Voluntary Emissions Estimation and Reporting Guidelines (VEERG).

- every chapter of the guidelines is implemented as an individual module
- modules are composed into industry specific calculators, following the module requirements in the guidelines
- the `all-modules` calculator accepts inputs for all modules in a single calculation
- emission factor constants use the 2026 National Greenhouse Accounts Factors
- zod input schemas and OpenAPI specs are published for every calculator.
