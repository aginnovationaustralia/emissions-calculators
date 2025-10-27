# PostDairyRequest

Input data required for the `dairy` calculator

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**state** | **str** | What state the location is in. Note: Western Australia is split up into two regions, &#x60;wa_nw&#x60; is North-West Western Australia, &#x60;wa_sw&#x60; is South-West Western Australia | 
**rainfall_above600** | **bool** | Is there enough rainfall to drain through the soil profile. Note: this is typically above 600mm | 
**production_system** | **str** | Production system | 
**dairy** | [**List[PostDairyRequestDairyInner]**](PostDairyRequestDairyInner.md) |  | 
**vegetation** | [**List[PostDairyRequestVegetationInner]**](PostDairyRequestVegetationInner.md) |  | 

## Example

```python
from openapi_client.models.post_dairy_request import PostDairyRequest

# TODO update the JSON string below
json = "{}"
# create an instance of PostDairyRequest from a JSON string
post_dairy_request_instance = PostDairyRequest.from_json(json)
# print the JSON string representation of the object
print(PostDairyRequest.to_json())

# convert the object into a dict
post_dairy_request_dict = post_dairy_request_instance.to_dict()
# create an instance of PostDairyRequest from a dict
post_dairy_request_from_dict = PostDairyRequest.from_dict(post_dairy_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


