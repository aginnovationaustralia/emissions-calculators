# Shared scope 1 inputs

This folder holds the input schemas and helpers used by more than one scope 1 module, mostly the livestock schemas used by both the enteric methane (chapter 3) and manure management (chapter 4) modules.

## Livestock that can also be organic fertiliser

Dairy, feedlot, pigs and poultry inputs are needed in two places in the total input structure:

- **Livestock**: the herd, lot or flock itself, read by the enteric methane (chapter 3) and manure management (chapter 4) modules.
- **Fertiliser**: the manure from the herd, lot or flock, used as the source of an organic fertiliser application (`origin.details` on a `Traced` organic fertiliser). The chapter 5 modules (5.2, 5.4, 5.5) pass these inputs to the `calculateMassOfNitrogenAppliedToSoilsFor*` functions in chapter 4 to calculate the mass of nitrogen applied to soils.

Many keys are read in both places, but by different modules. Each input key is tagged with the modules that read it, so the same key needs different tags depending on where it appears. To keep that tagging accurate, each of these four livestock types defines two schemas in `<livestock>/input.ts`:

| Schema                     | Keys                                                   | Read by                                         |
| -------------------------- | ------------------------------------------------------ | ----------------------------------------------- |
| `<X>LivestockInputSchema`  | Keys read by both scenarios, plus livestock-only keys  | Chapters 3 and 4, and the AllModules calculator |
| `<X>FertiliserInputSchema` | Keys read by both scenarios, plus fertiliser-only keys | The chapter 5 nitrogen calculation              |

`<X>` is the livestock type plus its unit:

| Livestock | `<X>`          | Livestock-only keys                                                                                               | Fertiliser-only keys     |
| --------- | -------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------ |
| Dairy     | `DairyHerd`    | `state`, `climateZone`, `grazingSystem`, `method2MeanAnnualTemperature`, solids separation on `manureAllocations` | `fractionAppliedToSoils` |
| Feedlot   | `FeedlotLot`   | `state`, `grazingSystem`, `method2MeanAnnualTemperature`                                                          | `fractionAppliedToSoils` |
| Pigs      | `PigsHerd`     | `state`, `grazingSystem`, `method2MeanAnnualTemperature`                                                          | `fractionAppliedToSoils` |
| Poultry   | `PoultryFlock` | `state`, `climateZone`, `grazingSystem`, `method2MeanAnnualTemperature`                                           | `fractionAppliedToSoils` |

Each schema exports `<X>LivestockInput` / `<X>LivestockInputTransformed` or `<X>FertiliserInput` / `<X>FertiliserInputTransformed` types. When a herd has several keys read by both scenarios, a `<x>SharedShape(location)` function builds them once and both schemas spread it, such as `dairyHerdSharedShape` and `poultryFlockSharedShape`. Dairy also has a `dairyHerdSharedInputSchema(location)`, which is only used for its `DairyHerdSharedInputTransformed` type, for helpers that both scenarios call.

### Module tagging rule

- A key read by both scenarios takes a `location: LivestockLocation` argument and picks its tags from it: the chapter 3/4 modules for `'livestock'`, and `FERTILISER_MODULES` (5.2, 5.4, 5.5) for `'fertiliser'`. Use the helpers in `<livestock>/modules.ts`, such as `dairyManureModules(location)` or `pigsEntericAndManureModules(location)`, which wrap `livestockOrFertiliserModules` from `tools/modules.ts`.
- A key that only appears in a `Livestock` or `Fertiliser` schema has fixed tags.
- The `Has*` schemas in `calculators/types` take the single module that reads the key, or a scenario name for keys read by several modules, such as `hasIsInLeachingZoneInputSchema('fertiliser')`. `hasStateInputSchema` takes the full list, as the herd or activity holding `state` is also passed to 6.3, 15.7 and 15.10. For a key read by both livestock scenarios, use `livestockModuleOrFertiliser(location, MANURE_PIGS_4_5)` (in `tools/modules.ts`) to pick the argument.
- A schema built from a `location` is a new copy on every call, so don't give it a `.meta({ id })`: two copies with the same id break OpenAPI generation.

### Where the schemas are used

- **Full calculators:** the herd schemas (`DairyHerdInputSchema`, `FeedlotLotInputSchema`, `PigsHerdInputSchema`, `PoultryFlockInputSchema`) extend the `Livestock` schema with the activity fields and the other modules' inputs. They don't include `fractionAppliedToSoils`, because a calculator never reads it from its own herds.
- **Organic fertiliser:** each manure input (`DairyManureInputSchema`, `FeedlotManureInputSchema`, `PigsManureInputSchema`, `PoultryManureInputSchema`, in the matching `4-manure-management/4.x` folder) wraps the `Fertiliser` schema with a `type` discriminator. `4-manure-management/livestock-manures.input.ts` combines them into one discriminated union.

### Nested schemas

Nested schemas, such as livestock classes and manure allocations, follow the same pattern whenever one scenario reads fewer of their keys:

- a `Shared(location)` schema with the keys both scenarios read. The fertiliser scenario uses it as `Shared('fertiliser')`;
- a `Livestock` schema with the same shared keys for `'livestock'`, plus the chapter 3/4-only keys.

The parent's `Fertiliser` schema nests the child's `Shared('fertiliser')` schema, and the parent's `Livestock` schema nests the child's `Livestock` schema. For example, `PigsHerdLivestockInputSchema` uses `PigsHerdClassesLivestockInputSchema` for `classes`. Build the `Livestock` schema from the shared keys directly, not by overriding a key of `Shared('livestock')`, so a nested schema isn't built only to be thrown away. Helpers on the nitrogen path take the `Shared` type, so they accept both shapes. Helpers that read a livestock-only key, usually on the volatile solids or methane path, take the `Livestock` type.

| Nested schema                                        | Livestock-only keys                                                                                                                           |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Dairy manure allocations (`DairyMMSAllocation*`)     | `solidsSeparatedPreTreatment` / `fractionSolidsSeparatedPreTreatment`                                                                         |
| Feedlot group (`FeedlotGroup*`)                      | `method2AverageNeutralDetergentFibrePercentage`, `method2DryMatterDigestibility`                                                              |
| Pigs class (`Pigs<Class>*`, `PigsHerdClasses*`)      | `method2AverageFeedIntake`, `method2VolatileSolidProductionRate`, and `fractionSolidsSeparatedPreTreatment` in the method 2 manure allocation |
| Poultry class (`Poultry<Class>*`, `PoultryClasses*`) | `method2DryMatterDigestibility`                                                                                                               |

The dairy class schemas are not split: both scenarios read every dairy class key.

### Every key must be read

The schema builders (`numberInput`, `enumInput`, `booleanInput` and their optional variants) require a non-empty `modules` list. If a key isn't read in one location, leave it out of that location's schema rather than tagging it `[]`. That way a user never sees an input that no module reads.

### Dairy time in locations

A dairy herd gives time spent in locations either by production system (method 1, `system`) or as measured proportions (method 2, `method2TimeSpentInLocations`). Both scenarios read it, because it drives the manure allocations. `withDairyTimeInLocations(fields, location)` builds this exclusive choice around a set of herd fields, and the Livestock, Fertiliser and full herd schemas all reuse it.
