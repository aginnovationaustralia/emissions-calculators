# PostCottonRequest

Input data required for the `cotton` calculator

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**state** | **str** | What state the location is in. Note: Western Australia is split up into two regions, &#x60;wa_nw&#x60; is North-West Western Australia, &#x60;wa_sw&#x60; is South-West Western Australia | 
**crops** | [**List[PostCottonRequestCropsInner]**](PostCottonRequestCropsInner.md) |  | 
**electricity_renewable** | **float** | Percent of total electricity usage that is drawn from renewable sources, between 0 and 1. Unused if &#x60;electricitySource&#x60; is &#x60;Renewable&#x60; | 
**electricity_use** | **float** | Electricity use in KWh (kilowatt hours) | 
**vegetation** | [**List[PostCottonRequestVegetationInner]**](PostCottonRequestVegetationInner.md) |  | 

## Example

```python
from openapi_client.models.post_cotton_request import PostCottonRequest

# TODO update the JSON string below
json = "{}"
# create an instance of PostCottonRequest from a JSON string
post_cotton_request_instance = PostCottonRequest.from_json(json)
# print the JSON string representation of the object
print(PostCottonRequest.to_json())

# convert the object into a dict
post_cotton_request_dict = post_cotton_request_instance.to_dict()
# create an instance of PostCottonRequest from a dict
post_cotton_request_from_dict = PostCottonRequest.from_dict(post_cotton_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


