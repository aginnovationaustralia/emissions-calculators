# Inputs to the calculators

Each calculator has a very specific set of inputs that must be supplied to carry out a valid calculation. The schema for the inputs is defined using the [zod](https://zod.dev) NPM library. A fair chunk of the complexity of the calculators is tied up in just specifying the combinations of values that must be supplied for each module and the possible scenarios they will accept. There is also the complexity of method 1 and 2 inputs.

## Activities for each calculator

The inputs on each calculator accept a set of common top level input keys, and a list of 'activities' specific to that calculator. For example that might mean a set of beef herds, or rice crops. Top level keys are for inputs that are likely to be shared by each activity, like electricity. Each activity then has keys to allow allocation of the common input (like electricity) to each activity.

When the calculation is complete, each activity appears in the output in the `intermediate` list. The total of all activities is also included at the top level of the output.

## Method 1 vs 2 inputs

In general, method 2 means the user supplies one or more custom values instead of relying default constants for emissions factors or other values. The most common case is that method 2 inputs means you supply an extra input. In these cases, the module is able to calculate method 1 using default values, and then also a result for method 2 if the optional input wa supplied. Sometimes they are mutually exclusive, and the guidelines only allow calculation of one or the other.