# PostPorkRequest

Input data required for the `pork` calculator

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**state** | **str** | What state the location is in. Note: Western Australia is split up into two regions, &#x60;wa_nw&#x60; is North-West Western Australia, &#x60;wa_sw&#x60; is South-West Western Australia | 
**north_of_tropic_of_capricorn** | **bool** | Is this farm north of the Tropic of Capricorn. Note: this is currently approximately -23.43621 degrees latitude. Deprecation note: This field is deprecated | 
**rainfall_above600** | **bool** | Is there enough rainfall to drain through the soil profile. Note: this is typically above 600mm | 
**pork** | [**List[PostPorkRequestPorkInner]**](PostPorkRequestPorkInner.md) |  | 
**vegetation** | [**List[PostPorkRequestVegetationInner]**](PostPorkRequestVegetationInner.md) |  | 

## Example

```python
from openapi_client.models.post_pork_request import PostPorkRequest

# TODO update the JSON string below
json = "{}"
# create an instance of PostPorkRequest from a JSON string
post_pork_request_instance = PostPorkRequest.from_json(json)
# print the JSON string representation of the object
print(PostPorkRequest.to_json())

# convert the object into a dict
post_pork_request_dict = post_pork_request_instance.to_dict()
# create an instance of PostPorkRequest from a dict
post_pork_request_from_dict = PostPorkRequest.from_dict(post_pork_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


