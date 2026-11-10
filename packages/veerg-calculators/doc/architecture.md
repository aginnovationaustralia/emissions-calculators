# Emissions Calculators architecture and tools

# Concept

The implementation of calculators, modules, inputs and outputs is built on top of a set of carefully designed tools that have been chosen with specific goals in mind. These are:
- Transparency - The chapter level implementation should be easy to compare against the guidelines
- Correctness - Use techniques to help minimise the chance of errors and mistakes. Type safety, testability, least surprise
- Relationships - Allow every output to communicate every piece of information used to perform it's calculation

These goals have stimulated some very specific design choices, and ways of implementing equations and other operations in code.

# Containers

The basic building blocks of every calculation are containers. Every time you perform an operation, you record the values that the resulting container was derived from, and how. Following this principle, it means that any output (or intermediate value) has a full audit trail of why it has its current value. Every value supplied by a user is stored in an InputContainer, these have no upstream origin to worry about other than the value supplied itself. Constant values are selected from the set of available constants. This selection sometimes depends on values supplied by the user, so it needs to remember the keys used to perform the selection. All ways of processing user inputs and constants have a Container that makes sense for that type of operation. Then at the end of calculations, the Containers can be traversed to understand the full path taken, and why the result is what it is.

# Units

The code base aims to disallow any operation that is invalid, to help minimise the room for errors. A lot of the complexity of the operations in each chapter are tied up in units at each step a long the way. Each Container is able to store a value with it's own "Unit", which helps to handle this requirement. Each unit has a set of operations that can be legally applied to it. A string or boolean value can't be multiplied. A number with a unit of Mass per Area, when multiplied with an Area, should now only be treated as a Mass and nothing else.

There are existing JavaScript libraries available which help to model or create unit systems, but none of them satisfied the requirements of this project, while also offering the ideal developer and reader experience. Libraries that support generic tracking of SI units do prevent illegal operations, but don't communicate each unit very nicely. Given that the guidelines would rely on a limited set of SI and other units, modelling units with dedicated, hand crafted types yields a much better experience all around.

The model does need to have an 'emergency exit' in a few places. This is typically where an equation has been defined in research to fit observations. But where possible, every value is given a specific unit where possible, and manual switching of units is kept to a minimum.

# Traceability

The tracking of context and ancestry by the Container model means you can gather some useful and powerful insights from each output key. It is possible to record every input and constant that was used to calculate a particular value, for example. Every intermediate value can be named, and that value can be interrogated as well.