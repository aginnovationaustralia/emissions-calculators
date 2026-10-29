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

## [4.0.2-beta.3] - 2026-10-29

- update emission factor constants to the 2026 National Greenhouse Accounts Factors (previously 2024), including stationary fuel, anaerobic digestion and JRPP values
- molecular conversion constants now use decimal values, instead of fractions
- fix sheep wool intensities, which were calculated without multiplying by head count
- fix purchased services (15.7) in all industry calculators, which were calculated from the activity's own fuel instead of `services.fuel`, double counting own fuel use and ignoring contractor fuel
- fix other livestock (goats, deer, horses) manure N2O being too high, due to incorrect unit on nitrogen excreted factors (per head per day instead of per head per year)
- remove fraction burnt input for crops with no burning factor (cotton, hops and grape vines, tubers and roots, forage and other crops). The burnt fraction is now ignored for these crops and is no longer a required input
- the all-modules calculator now includes rice crop residues (6.1), leaching and runoff (6.3) and field burning (6.4). The rice input has new mandatory `state`, `climateZone` and `isInLeachingZone` fields
- allow sheep lamb marking rates above 100%, as lambs marked per ewe mated commonly exceeds 100% with twins
- restrict purchased feed in wild catch fisheries and aquaculture to aquaculture feed types (or a custom emissions factor), instead of livestock feed
- constrain cotton `fractionSeedCottonLint` and other fraction inputs to the range 0-1
- stricter handling of addition and subtraction on empty results, to prevent missing gas keys in outputs
- enums are now registered with an id in the openapi spec files, to improve generated clients (e.g. Python)
- include any crop leaching emissions with pasture leaching emissions in the all-modules calculator outputs
- several fixes and improvements to calculating emissions from nitrogen in fertiliser applications. Calculate based on amount of nitrogen instead of total mass applied. Consider nitrogen content of all components in component based fertilisers
