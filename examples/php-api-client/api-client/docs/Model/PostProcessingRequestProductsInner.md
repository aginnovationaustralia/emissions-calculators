# # PostProcessingRequestProductsInner

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Unique identifier for this activity | [optional]
**product** | [**\OpenAPI\Client\Model\PostProcessingRequestProductsInnerProduct**](PostProcessingRequestProductsInnerProduct.md) |  |
**electricity_renewable** | **float** | Percent of total electricity usage that is drawn from renewable sources, between 0 and 1. Unused if &#x60;electricitySource&#x60; is &#x60;Renewable&#x60; |
**electricity_use** | **float** | Electricity use in KWh (kilowatt hours) |
**electricity_source** | **string** | Source of electricity |
**fuel** | [**\OpenAPI\Client\Model\PostAquacultureRequestEnterprisesInnerFuel**](PostAquacultureRequestEnterprisesInnerFuel.md) |  |
**refrigerants** | [**\OpenAPI\Client\Model\PostHorticultureRequestCropsInnerRefrigerantsInner[]**](PostHorticultureRequestCropsInnerRefrigerantsInner.md) | Refrigerant type |
**fluid_waste** | [**\OpenAPI\Client\Model\PostAquacultureRequestEnterprisesInnerFluidWasteInner[]**](PostAquacultureRequestEnterprisesInnerFluidWasteInner.md) | Amount of fluid waste, in kL (kilolitres) |
**solid_waste** | [**\OpenAPI\Client\Model\PostAquacultureRequestEnterprisesInnerSolidWaste**](PostAquacultureRequestEnterprisesInnerSolidWaste.md) |  |
**purchased_co2** | **float** | Quantity of CO2 purchased, in kg CO2 |
**carbon_offsets** | **float** | Carbon offsets purchased, in t CO2. Offsetting 2 t CO2 would be 2.0 (not -2.0) | [optional]

[[Back to Model list]](../../README.md#models) [[Back to API list]](../../README.md#endpoints) [[Back to README]](../../README.md)
