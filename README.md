# emissions-calculators

🚧 This readme is a work in progress 🚧

The emissions-calculators project aims to make it easy to calculate carbon emissions using the [Greenhouse Accounting Framework (GAF) Tools for Australian Primary Industries](https://piccc.org.au/resources/Tools.html). It is developed and maintained by [Agricultural Innovation Australia](https://aginnovationaustralia.com.au).

The project implements the GAF tools as a javascript package that can be readily imported and used for calculations. The calculators are also available as an API a part of the [Environmental Accounting Platform (EAP)](https://www.aiaeap.com/).

# Installation

```bash
npm install @aginnovationaustralia/emissions-calculators
```

# Usage

```javascript
const { calculateEmissions, BeefInput } = require('@aginnovationaustralia/emissions-calculators')

const input = new BeefInput()
input.state = 'nsw'
...

const emissions = calculateEmissions('beef', input)

```

# Contributing and support

TODO

# Code of conduct

TODO

# Publishing packages to NPM



# License

![Creative Commons Attribution No Deriviatives](./doc/assets/by-nd.png)

This project is licensed under a [Creative Commons Attribution No Derivatives 4.0](https://creativecommons.org/licenses/by-nd/4.0/) license.