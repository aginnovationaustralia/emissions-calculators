# PostSugarRequest

Input data required for the `sugar` calculator

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**state** | **str** | What state the location is in. Note: Western Australia is split up into two regions, &#x60;wa_nw&#x60; is North-West Western Australia, &#x60;wa_sw&#x60; is South-West Western Australia | 
**crops** | [**List[PostSugarRequestCropsInner]**](PostSugarRequestCropsInner.md) |  | 
**electricity_renewable** | **float** | Percent of total electricity usage that is drawn from renewable sources, between 0 and 1. Unused if &#x60;electricitySource&#x60; is &#x60;Renewable&#x60; | 
**electricity_use** | **float** | Electricity use in KWh (kilowatt hours) | 
**vegetation** | [**List[PostCottonRequestVegetationInner]**](PostCottonRequestVegetationInner.md) |  | 

## Example

```python
from openapi_client.models.post_sugar_request import PostSugarRequest

# TODO update the JSON string below
json = "{}"
# create an instance of PostSugarRequest from a JSON string
post_sugar_request_instance = PostSugarRequest.from_json(json)
# print the JSON string representation of the object
print(PostSugarRequest.to_json())

# convert the object into a dict
post_sugar_request_dict = post_sugar_request_instance.to_dict()
# create an instance of PostSugarRequest from a dict
post_sugar_request_from_dict = PostSugarRequest.from_dict(post_sugar_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


