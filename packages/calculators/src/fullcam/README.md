# FullCAM integration

# Data flow

This module for FullCAM wraps up tools you can use to convert simple event inputs to values needed for the LULUCF chapters in the guidelines. It does this by making requests to the FullCAM API to run a simulation. To be more specific:

## Input handling

1. The user submits either the outputs from their own FullCAM simulation runs, or a simple set of events describing land use change and activities
2. An application can check whether the user has supplied the outputs from FullCAM, or the simple events that must be upgraded
3. If the user has specified the `landUse` input in the schema expected by the emissions-calculator package, the calculation request can simply be forwarded on to the package
4. If the user has specified the simpler `landUse` input designed for FullCAM submission, those inputs need to be passed on to the FullCAM processing module

## FullCAM processing

1. A valid plot file needs to be prepared for submitting to the `/update-spatialdata`
2. The template plot file needs to be updated with all events specified by the user
3. The template also needs to have species extracted from all events and injected as `SpeciesForest` records
4. The template is submitted for spatial updates
5. The response is the updated template, which is then submitted for simulation

## Result handling

1. The key attributes are extracted from the simulation result, which is a CSV made up of monthly line items
2. The original `landUse` inputs are combined with the simulation results to generate a valid `landUse` key that the calculators package can accept
3. The original full calculator input is updated with that new `landUse` content, and the calculation is performed
4. The full response is returned to the user

# Caching and optimisation

The tools here help to define expected input and output values, and some templates that are used to generate valid requests. There is no code pat hout of the box that will make the API requests for you. It is necessary to supply your FullCAM API key, and to call the API responsibly. This means things like caching of results to reduce the load placed on the FullCAM APIs.
