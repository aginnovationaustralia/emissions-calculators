# # PostWildseafisheriesRequestEnterprisesInner

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Unique identifier for this activity | [optional]
**state** | **string** | What state the location is in. Note: Western Australia is split up into two regions, &#x60;wa_nw&#x60; is North-West Western Australia, &#x60;wa_sw&#x60; is South-West Western Australia |
**electricity_source** | **string** | Source of electricity |
**electricity_renewable** | **float** | Percent of total electricity usage that is drawn from renewable sources, between 0 and 1. Unused if &#x60;electricitySource&#x60; is &#x60;Renewable&#x60; |
**electricity_use** | **float** | Electricity use in KWh (kilowatt hours) |
**total_whole_weight_caught** | **float** | Total whole weight caught in kg |
**diesel** | **float** | Diesel usage in L (litres) |
**petrol** | **float** | Petrol usage in L (litres) |
**lpg** | **float** | LPG Fuel usage in L (litres) |
**refrigerants** | [**\OpenAPI\Client\Model\PostWildseafisheriesRequestEnterprisesInnerRefrigerantsInner[]**](PostWildseafisheriesRequestEnterprisesInnerRefrigerantsInner.md) |  |
**transports** | [**\OpenAPI\Client\Model\PostWildseafisheriesRequestEnterprisesInnerTransportsInner[]**](PostWildseafisheriesRequestEnterprisesInnerTransportsInner.md) | Transportation |
**flights** | [**\OpenAPI\Client\Model\PostWildseafisheriesRequestEnterprisesInnerFlightsInner[]**](PostWildseafisheriesRequestEnterprisesInnerFlightsInner.md) | CommercialFlight |
**bait** | [**\OpenAPI\Client\Model\PostWildseafisheriesRequestEnterprisesInnerBaitInner[]**](PostWildseafisheriesRequestEnterprisesInnerBaitInner.md) | Bait |
**custombait** | [**\OpenAPI\Client\Model\PostWildseafisheriesRequestEnterprisesInnerCustombaitInner[]**](PostWildseafisheriesRequestEnterprisesInnerCustombaitInner.md) | Custom bait |
**carbon_offset** | **float** | Carbon offsets purchased, in t CO2. Offsetting 2 t CO2 would be 2.0 (not -2.0) |

[[Back to Model list]](../../README.md#models) [[Back to API list]](../../README.md#endpoints) [[Back to README]](../../README.md)
