# # PostRiceRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**state** | **string** | What state the location is in. Note: Western Australia is split up into two regions, &#x60;wa_nw&#x60; is North-West Western Australia, &#x60;wa_sw&#x60; is South-West Western Australia |
**crops** | [**\OpenAPI\Client\Model\PostRiceRequestCropsInner[]**](PostRiceRequestCropsInner.md) |  |
**electricity_renewable** | **float** | Percent of total electricity usage that is drawn from renewable sources, between 0 and 1. Unused if &#x60;electricitySource&#x60; is &#x60;Renewable&#x60; |
**electricity_use** | **float** | Electricity use in KWh (kilowatt hours) |
**vegetation** | [**\OpenAPI\Client\Model\PostCottonRequestVegetationInner[]**](PostCottonRequestVegetationInner.md) |  |

[[Back to Model list]](../../README.md#models) [[Back to API list]](../../README.md#endpoints) [[Back to README]](../../README.md)
