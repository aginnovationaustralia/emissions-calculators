# # PostBeefRequestBeefInnerFertiliser

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**single_superphosphate** | **float** | Single superphosphate usage in tonnes |
**other_type** | **string** | Other N fertiliser type. Deprecation note: Use &#x60;otherFertilisers&#x60; instead | [optional]
**pasture_dryland** | **float** | Urea fertiliser used for dryland pasture, in tonnes Urea |
**pasture_irrigated** | **float** | Urea fertiliser used for irrigated pasture, in tonnes Urea |
**crops_dryland** | **float** | Urea fertiliser used for dryland crops, in tonnes Urea |
**crops_irrigated** | **float** | Urea fertiliser used for irrigated crops, in tonnes Urea |
**other_dryland** | **float** | Other N fertiliser used for dryland. Deprecation note: Use &#x60;otherFertilisers&#x60; instead | [optional]
**other_irrigated** | **float** | Other N fertiliser used for irrigated. Deprecation note: Use &#x60;otherFertilisers&#x60; instead | [optional]
**other_fertilisers** | [**\OpenAPI\Client\Model\PostBeefRequestBeefInnerFertiliserOtherFertilisersInner[]**](PostBeefRequestBeefInnerFertiliserOtherFertilisersInner.md) | Array of Other N fertiliser. Version note: If this field is set and has a length &gt; 0, the &#x60;other&#x60; fields within this object are ignored, and this array is used instead | [optional]

[[Back to Model list]](../../README.md#models) [[Back to API list]](../../README.md#endpoints) [[Back to README]](../../README.md)
