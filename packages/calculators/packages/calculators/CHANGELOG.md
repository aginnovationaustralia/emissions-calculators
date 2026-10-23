# Changelog

## [3.1.0](https://github.com/aginnovationaustralia/emissions-calculators/compare/v3.0.1...v3.1.0) (2026-10-23)


### Features

* **calculators:** :art: implement 6.2.1.1 method 2, with tests for m1 and m2 ([7b7b403](https://github.com/aginnovationaustralia/emissions-calculators/commit/7b7b403453fbc640698bcd108fb5fd5d53a2d906))
* **calculators:** adding support for stationary natural gas scope 1 ([7b7b403](https://github.com/aginnovationaustralia/emissions-calculators/commit/7b7b403453fbc640698bcd108fb5fd5d53a2d906))
* **calculators:** decimal conversion constants, shared via a constants test workbook ([#220](https://github.com/aginnovationaustralia/emissions-calculators/issues/220)) ([eefd50c](https://github.com/aginnovationaustralia/emissions-calculators/commit/eefd50cf1afe64288409eada6ad8b91539adf95d))
* **calculators:** implement tests for 6.1.1.1 crop residues ([7b7b403](https://github.com/aginnovationaustralia/emissions-calculators/commit/7b7b403453fbc640698bcd108fb5fd5d53a2d906))
* **calculators:** implementing tests for 5211 untraced fertiliser ([7b7b403](https://github.com/aginnovationaustralia/emissions-calculators/commit/7b7b403453fbc640698bcd108fb5fd5d53a2d906))
* **calculators:** relaxing container origin and name concept to be more flexible ([7b7b403](https://github.com/aginnovationaustralia/emissions-calculators/commit/7b7b403453fbc640698bcd108fb5fd5d53a2d906))
* **calculators:** sheep manure sheet updates ([#200](https://github.com/aginnovationaustralia/emissions-calculators/issues/200)) ([1b2dfc4](https://github.com/aginnovationaustralia/emissions-calculators/commit/1b2dfc4254d7fcc4387959d86d46c4a0bf18f763))
* **calculators:** swine manure test case working for liquid and solid systems ([7b7b403](https://github.com/aginnovationaustralia/emissions-calculators/commit/7b7b403453fbc640698bcd108fb5fd5d53a2d906))
* **calculators:** tests for local feedlot manure passing ([7b7b403](https://github.com/aginnovationaustralia/emissions-calculators/commit/7b7b403453fbc640698bcd108fb5fd5d53a2d906))
* **calculators:** widen zod output key schema so it matches all actual runtime outputs ([#216](https://github.com/aginnovationaustralia/emissions-calculators/issues/216)) ([586af81](https://github.com/aginnovationaustralia/emissions-calculators/commit/586af81c7262261944150698c262837db48e1a0c))


### Bug Fixes

* **calculators:** fix runtime error when getting liveweight for purchased sheep ([#212](https://github.com/aginnovationaustralia/emissions-calculators/issues/212)) ([b1a7ab9](https://github.com/aginnovationaustralia/emissions-calculators/commit/b1a7ab93281a6a24694f70ea496ef7f4a6e0a1b4))
* **calculators:** subtract lulucf total to create correct intensities ([#215](https://github.com/aginnovationaustralia/emissions-calculators/issues/215)) ([c403fea](https://github.com/aginnovationaustralia/emissions-calculators/commit/c403fea8875589126fed85712fad65ea5a85841d))
* **calculators:** use default import for decimal.js-light in totals ([#218](https://github.com/aginnovationaustralia/emissions-calculators/issues/218)) ([6c4848a](https://github.com/aginnovationaustralia/emissions-calculators/commit/6c4848a8ce80a631b194784095a2af4f6fa97bd3))
