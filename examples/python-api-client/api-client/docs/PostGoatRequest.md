# PostGoatRequest

Input data required for the `goat` calculator

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**state** | **str** | What state the location is in. Note: Western Australia is split up into two regions, &#x60;wa_nw&#x60; is North-West Western Australia, &#x60;wa_sw&#x60; is South-West Western Australia | 
**rainfall_above600** | **bool** | Is there enough rainfall to drain through the soil profile. Note: this is typically above 600mm | 
**goats** | [**List[PostGoatRequestGoatsInner]**](PostGoatRequestGoatsInner.md) |  | 
**vegetation** | [**List[PostGoatRequestVegetationInner]**](PostGoatRequestVegetationInner.md) |  | [default to []]

## Example

```python
from openapi_client.models.post_goat_request import PostGoatRequest

# TODO update the JSON string below
json = "{}"
# create an instance of PostGoatRequest from a JSON string
post_goat_request_instance = PostGoatRequest.from_json(json)
# print the JSON string representation of the object
print(PostGoatRequest.to_json())

# convert the object into a dict
post_goat_request_dict = post_goat_request_instance.to_dict()
# create an instance of PostGoatRequest from a dict
post_goat_request_from_dict = PostGoatRequest.from_dict(post_goat_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


