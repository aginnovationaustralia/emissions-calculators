# Changelog

## [3.1.0](https://github.com/aginnovationaustralia/emissions-calculators/compare/v3.0.1...v3.1.0) (2026-10-30)


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

* **calculators:** allow sheep lamb marking rates above 100% ([#230](https://github.com/aginnovationaustralia/emissions-calculators/issues/230)) ([6738584](https://github.com/aginnovationaustralia/emissions-calculators/commit/67385845bd7f0ad3b7b7e84f37f4f9f008329da7))
* **calculators:** calculate purchased services (15.7) from services fuel ([#227](https://github.com/aginnovationaustralia/emissions-calculators/issues/227)) ([98bf8c3](https://github.com/aginnovationaustralia/emissions-calculators/commit/98bf8c386d17bdc0db2642a13a2ce15bad71b26f))
* **calculators:** constrain cotton lint fraction and other fractions to 0-1 ([#236](https://github.com/aginnovationaustralia/emissions-calculators/issues/236)) ([4f2578a](https://github.com/aginnovationaustralia/emissions-calculators/commit/4f2578ac2e790ac2d39ab0334df10fb7c8b54ada))
* **calculators:** fix runtime error when getting liveweight for purchased sheep ([#212](https://github.com/aginnovationaustralia/emissions-calculators/issues/212)) ([b1a7ab9](https://github.com/aginnovationaustralia/emissions-calculators/commit/b1a7ab93281a6a24694f70ea496ef7f4a6e0a1b4))
* **calculators:** handle plus and minus on void more strictly, prevent gas key missing ([#222](https://github.com/aginnovationaustralia/emissions-calculators/issues/222)) ([10d2aae](https://github.com/aginnovationaustralia/emissions-calculators/commit/10d2aae7d92ae7d5ede961b07dad8b0e14f1c799))
* **calculators:** ignore the burnt fraction for crops with no burning factor ([#234](https://github.com/aginnovationaustralia/emissions-calculators/issues/234)) ([5704762](https://github.com/aginnovationaustralia/emissions-calculators/commit/57047629b438a228317b81be73fc7ce10a3ab477))
* **calculators:** include crop residue leaching and runoff in all-modules ([#228](https://github.com/aginnovationaustralia/emissions-calculators/issues/228)) ([68d9487](https://github.com/aginnovationaustralia/emissions-calculators/commit/68d948769c14898edb685a9327f2e8a0fc56fc74))
* **calculators:** include rice crop residues and field burning in all-modules ([#235](https://github.com/aginnovationaustralia/emissions-calculators/issues/235)) ([f0070b8](https://github.com/aginnovationaustralia/emissions-calculators/commit/f0070b8cebf1a4b2c765336db7bba42037c30b42))
* **calculators:** restrict fisheries purchased feed to aquaculture feed ([#231](https://github.com/aginnovationaustralia/emissions-calculators/issues/231)) ([8ca66c5](https://github.com/aginnovationaustralia/emissions-calculators/commit/8ca66c5ba995f2da1c2a350c2e6f9576e5c715d0))
* **calculators:** subtract lulucf total to create correct intensities ([#215](https://github.com/aginnovationaustralia/emissions-calculators/issues/215)) ([c403fea](https://github.com/aginnovationaustralia/emissions-calculators/commit/c403fea8875589126fed85712fad65ea5a85841d))
* **calculators:** treat other livestock nitrogen excreted as per head per year ([#232](https://github.com/aginnovationaustralia/emissions-calculators/issues/232)) ([6dc65a8](https://github.com/aginnovationaustralia/emissions-calculators/commit/6dc65a82bde47dc915d2717a6716aa2a957cd8f9))
* **calculators:** use default import for decimal.js-light in totals ([#218](https://github.com/aginnovationaustralia/emissions-calculators/issues/218)) ([6c4848a](https://github.com/aginnovationaustralia/emissions-calculators/commit/6c4848a8ce80a631b194784095a2af4f6fa97bd3))
* Inorganic fertiliser applications ([#244](https://github.com/aginnovationaustralia/emissions-calculators/issues/244)) ([fe3838a](https://github.com/aginnovationaustralia/emissions-calculators/commit/fe3838a9cce376908df853601c4906c36fc1d2e6))
