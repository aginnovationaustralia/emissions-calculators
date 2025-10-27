# # PostWildcatchfisheryRequestEnterprisesInner

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Unique identifier for this activity | [optional]
**state** | **string** | What state the location is in. Note: Western Australia is split up into two regions, &#x60;wa_nw&#x60; is North-West Western Australia, &#x60;wa_sw&#x60; is South-West Western Australia |
**production_system** | **string** | Production system of the wild catch fishery enterprise |
**total_harvest_kg** | **float** | Total harvest in kg |
**refrigerants** | [**\OpenAPI\Client\Model\PostHorticultureRequestCropsInnerRefrigerantsInner[]**](PostHorticultureRequestCropsInnerRefrigerantsInner.md) | Refrigerant type |
**bait** | [**\OpenAPI\Client\Model\PostWildcatchfisheryRequestEnterprisesInnerBaitInner[]**](PostWildcatchfisheryRequestEnterprisesInnerBaitInner.md) | Bait purchases |
**custom_bait** | [**\OpenAPI\Client\Model\PostAquacultureRequestEnterprisesInnerCustomBaitInner[]**](PostAquacultureRequestEnterprisesInnerCustomBaitInner.md) | Custom bait purchases |
**inbound_freight** | [**\OpenAPI\Client\Model\PostAquacultureRequestEnterprisesInnerInboundFreightInner[]**](PostAquacultureRequestEnterprisesInnerInboundFreightInner.md) | Services used to transport goods to the enterprise |
**outbound_freight** | [**\OpenAPI\Client\Model\PostAquacultureRequestEnterprisesInnerInboundFreightInner[]**](PostAquacultureRequestEnterprisesInnerInboundFreightInner.md) | Services used to transport goods from the enterprise |
**total_commercial_flights_km** | **float** | Total distance of commercial flights, in km (kilometers) |
**electricity_renewable** | **float** | Percent of total electricity usage that is drawn from renewable sources, between 0 and 1. Unused if &#x60;electricitySource&#x60; is &#x60;Renewable&#x60; |
**electricity_use** | **float** | Electricity use in KWh (kilowatt hours) |
**electricity_source** | **string** | Source of electricity |
**fuel** | [**\OpenAPI\Client\Model\PostAquacultureRequestEnterprisesInnerFuel**](PostAquacultureRequestEnterprisesInnerFuel.md) |  |
**fluid_waste** | [**\OpenAPI\Client\Model\PostAquacultureRequestEnterprisesInnerFluidWasteInner[]**](PostAquacultureRequestEnterprisesInnerFluidWasteInner.md) | Amount of fluid waste, in kL (kilolitres) |
**solid_waste** | [**\OpenAPI\Client\Model\PostAquacultureRequestEnterprisesInnerSolidWaste**](PostAquacultureRequestEnterprisesInnerSolidWaste.md) |  |
**carbon_offsets** | **float** | Carbon offsets purchased, in t CO2. Offsetting 2 t CO2 would be 2.0 (not -2.0) | [optional]

[[Back to Model list]](../../README.md#models) [[Back to API list]](../../README.md#endpoints) [[Back to README]](../../README.md)
