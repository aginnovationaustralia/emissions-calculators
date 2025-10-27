# # PostSheepRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**state** | **string** | What state the location is in. Note: Western Australia is split up into two regions, &#x60;wa_nw&#x60; is North-West Western Australia, &#x60;wa_sw&#x60; is South-West Western Australia |
**north_of_tropic_of_capricorn** | **bool** | Is this farm north of the Tropic of Capricorn. Note: this is currently approximately -23.43621 degrees latitude |
**rainfall_above600** | **bool** | Is there enough rainfall to drain through the soil profile. Note: this is typically above 600mm |
**sheep** | [**\OpenAPI\Client\Model\PostSheepRequestSheepInner[]**](PostSheepRequestSheepInner.md) |  |
**vegetation** | [**\OpenAPI\Client\Model\PostSheepRequestVegetationInner[]**](PostSheepRequestVegetationInner.md) |  |

[[Back to Model list]](../../README.md#models) [[Back to API list]](../../README.md#endpoints) [[Back to README]](../../README.md)
