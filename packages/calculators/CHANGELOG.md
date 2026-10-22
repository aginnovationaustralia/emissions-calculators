# Changelog

## [3.0.0] - 2025-12-17

Initial release of the @aginnovationaustralia/emissions-calculators package

## [3.0.1] - 2025-12-19

Fresh publish of the package to the NPM registry to collect new details in the readme file. No code changes.

## [3.0.2] - 2026-06-22

- fix up paths for all exports in package.json to make sure they are pointing to files included in the build
- new object GAF_REFERENCES exported from the root of the package. It maps every calculator name to the corresponding GAF sheet and version implemented by that calculator in this version

## [4.0.2-beta.1] - 2026-10-21

The first beta version of the new iteration of the emissions calculators, implementing the 2026 release of the Voluntary Emissions Estimation and Reporting Guidelines. The v4 range will be used for the initial feedback period, while further changes to the guidelines are applied. It is expected that a version 5.0.0 release of the package will align with the finalised version of the guidelines.

The v4 package implements all chapters of the guidance as individual modules. These are composed with industry specific calculators, following the module requirements in the guidelines, along with the `all-modules` calculator, which accepts inputs for all modules.

## [4.0.2-beta.2] - 2026-10-22

- fix for an issue in calculation of product intensity excluding LULUCF emissions. They were being added instead of removed, so ended up with 2x LULUCF emissions, instead of without them
- update the zod schema and openapi spec for the shape of the output keys. There were some extra keys being returned at runtime that were not part of the schema. They are aligned now
- updates to the description field on some input keys, for better documentation that is easier to understand
- fix a possible runtime failure during tests importing the `decimal.js-light` library
