# # PostVineyardRequestVineyardsInner

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Unique identifier for this activity | [optional]
**state** | **string** | What state the location is in. Note: Western Australia is split up into two regions, &#x60;wa_nw&#x60; is North-West Western Australia, &#x60;wa_sw&#x60; is South-West Western Australia |
**rainfall_above600** | **bool** | Is there enough rainfall or irrigation to drain through the soil profile, typically above 600mm |
**irrigated** | **bool** | Is the crop irrigated? |
**area_planted** | **float** | Area planted, in ha (hectares) |
**average_yield** | **float** | Average yield, in t/ha (tonnes per hectare) |
**non_urea_nitrogen** | **float** | Non-urea nitrogen application, in kg N/ha (kilograms of nitrogen per hectare) |
**phosphorus_application** | **float** | Phosphorus application, in kg P/ha (kilograms of phosphorus per hectare) |
**potassium_application** | **float** | Potassium application, in kg K/ha (kilograms of potassium per hectare) |
**sulfur_application** | **float** | Sulfur application, in kg S/ha (kilograms of sulfur per hectare) |
**urea_application** | **float** | Urea nitrogen application, in kg Urea/ha (kilograms of urea per hectare) |
**urea_ammonium_nitrate** | **float** | Urea-Ammonium nitrate application, in kg product/ha (kilograms of product per hectare) |
**limestone** | **float** | Lime applied in tonnes |
**limestone_fraction** | **float** | Fraction of lime as limestone vs dolomite, between 0 and 1 |
**herbicide_use** | **float** | Total amount of active ingredients from general herbicide/pesticide use, in kg (kilogram) |
**glyphosate_other_herbicide_use** | **float** | Total amount of active ingredients from other herbicide use (Paraquat, Diquat, Glyphosate), in kg (kilogram) |
**electricity_renewable** | **float** | Percent of total electricity usage that is drawn from renewable sources, between 0 and 1. Unused if &#x60;electricitySource&#x60; is &#x60;Renewable&#x60; |
**electricity_use** | **float** | Electricity use in KWh (kilowatt hours) |
**electricity_source** | **string** | Source of electricity |
**fuel** | [**\OpenAPI\Client\Model\PostAquacultureRequestEnterprisesInnerFuel**](PostAquacultureRequestEnterprisesInnerFuel.md) |  |
**fluid_waste** | [**\OpenAPI\Client\Model\PostAquacultureRequestEnterprisesInnerFluidWasteInner[]**](PostAquacultureRequestEnterprisesInnerFluidWasteInner.md) | Amount of fluid waste, in kL (kilolitres) |
**solid_waste** | [**\OpenAPI\Client\Model\PostAquacultureRequestEnterprisesInnerSolidWaste**](PostAquacultureRequestEnterprisesInnerSolidWaste.md) |  |
**inbound_freight** | [**\OpenAPI\Client\Model\PostAquacultureRequestEnterprisesInnerInboundFreightInner[]**](PostAquacultureRequestEnterprisesInnerInboundFreightInner.md) | Services used to transport goods to the enterprise |
**outbound_freight** | [**\OpenAPI\Client\Model\PostAquacultureRequestEnterprisesInnerInboundFreightInner[]**](PostAquacultureRequestEnterprisesInnerInboundFreightInner.md) | Services used to transport goods from the enterprise |
**total_commercial_flights_km** | **float** | Total distance of commercial flights, in km (kilometers) |

[[Back to Model list]](../../README.md#models) [[Back to API list]](../../README.md#endpoints) [[Back to README]](../../README.md)
