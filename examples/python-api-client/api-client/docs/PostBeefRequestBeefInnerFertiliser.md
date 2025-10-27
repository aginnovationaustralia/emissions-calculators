# PostBeefRequestBeefInnerFertiliser

Fertiliser used for different applications (such as dryland pasture)

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**single_superphosphate** | **float** | Single superphosphate usage in tonnes | 
**other_type** | **str** | Other N fertiliser type. Deprecation note: Use &#x60;otherFertilisers&#x60; instead | [optional] 
**pasture_dryland** | **float** | Urea fertiliser used for dryland pasture, in tonnes Urea | 
**pasture_irrigated** | **float** | Urea fertiliser used for irrigated pasture, in tonnes Urea | 
**crops_dryland** | **float** | Urea fertiliser used for dryland crops, in tonnes Urea | 
**crops_irrigated** | **float** | Urea fertiliser used for irrigated crops, in tonnes Urea | 
**other_dryland** | **float** | Other N fertiliser used for dryland. Deprecation note: Use &#x60;otherFertilisers&#x60; instead | [optional] 
**other_irrigated** | **float** | Other N fertiliser used for irrigated. Deprecation note: Use &#x60;otherFertilisers&#x60; instead | [optional] 
**other_fertilisers** | [**List[PostBeefRequestBeefInnerFertiliserOtherFertilisersInner]**](PostBeefRequestBeefInnerFertiliserOtherFertilisersInner.md) | Array of Other N fertiliser. Version note: If this field is set and has a length &gt; 0, the &#x60;other&#x60; fields within this object are ignored, and this array is used instead | [optional] 

## Example

```python
from openapi_client.models.post_beef_request_beef_inner_fertiliser import PostBeefRequestBeefInnerFertiliser

# TODO update the JSON string below
json = "{}"
# create an instance of PostBeefRequestBeefInnerFertiliser from a JSON string
post_beef_request_beef_inner_fertiliser_instance = PostBeefRequestBeefInnerFertiliser.from_json(json)
# print the JSON string representation of the object
print(PostBeefRequestBeefInnerFertiliser.to_json())

# convert the object into a dict
post_beef_request_beef_inner_fertiliser_dict = post_beef_request_beef_inner_fertiliser_instance.to_dict()
# create an instance of PostBeefRequestBeefInnerFertiliser from a dict
post_beef_request_beef_inner_fertiliser_from_dict = PostBeefRequestBeefInnerFertiliser.from_dict(post_beef_request_beef_inner_fertiliser_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


