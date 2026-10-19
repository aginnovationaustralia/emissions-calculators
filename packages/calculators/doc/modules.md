# Calculator modules and chapters


## Introduction
The code base has been organised to match the structure of the guidelines chapters, following the logical "units" defined by each chapter. Each chapter typically defines a top level equation that calculates some amount of emissions, which is typically composed of values that are constants or the results of other equations. The majority of testing is applied at the module level. These chapters and modules essentially define the contract of the guidelines.

## Composition

The calculators are simply composed of the relevant chapters needed for that particular type of production, as defined in the Implementation Guides in Chapter 2. The actual inputs provided by the user are tied to a particular calculator, but all of the heavy lifting of calculating actual values is handled by modules. The inputs are built up using zod schemas. They are composed in a similar way to the modules being composed, but it is not a purely 1 to 1 relationship, because some inputs are used in multiple places.

## Testing

Every module is tested with a set of scenarios that define inputs and outputs. The logic of the chapter is implemented and captured independently in excel test sheets. Each sheet should have enough distinct scenarios to exercise the range of possible inputs for that chapter. They should also capture method 1 vs method 2 inputs where that is required. The equations and constants captured via excel need to be a correct and faithful independent version of the chapter. They are structured to be flat, with no fancy techniques, to make it easy to read them and compare to the chapter equations.