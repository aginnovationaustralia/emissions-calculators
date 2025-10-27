# PostProcessingRequest

Input data required for the `processing` calculator

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**state** | **str** | What state the location is in. Note: Western Australia is split up into two regions, &#x60;wa_nw&#x60; is North-West Western Australia, &#x60;wa_sw&#x60; is South-West Western Australia | 
**products** | [**List[PostProcessingRequestProductsInner]**](PostProcessingRequestProductsInner.md) |  | 

## Example

```python
from openapi_client.models.post_processing_request import PostProcessingRequest

# TODO update the JSON string below
json = "{}"
# create an instance of PostProcessingRequest from a JSON string
post_processing_request_instance = PostProcessingRequest.from_json(json)
# print the JSON string representation of the object
print(PostProcessingRequest.to_json())

# convert the object into a dict
post_processing_request_dict = post_processing_request_instance.to_dict()
# create an instance of PostProcessingRequest from a dict
post_processing_request_from_dict = PostProcessingRequest.from_dict(post_processing_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


