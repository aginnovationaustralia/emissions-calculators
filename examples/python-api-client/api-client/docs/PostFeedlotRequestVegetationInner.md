# PostFeedlotRequestVegetationInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**vegetation** | [**PostBeefRequestVegetationInnerVegetation**](PostBeefRequestVegetationInnerVegetation.md) |  | 
**feedlot_proportion** | **List[float]** |  | 

## Example

```python
from openapi_client.models.post_feedlot_request_vegetation_inner import PostFeedlotRequestVegetationInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostFeedlotRequestVegetationInner from a JSON string
post_feedlot_request_vegetation_inner_instance = PostFeedlotRequestVegetationInner.from_json(json)
# print the JSON string representation of the object
print(PostFeedlotRequestVegetationInner.to_json())

# convert the object into a dict
post_feedlot_request_vegetation_inner_dict = post_feedlot_request_vegetation_inner_instance.to_dict()
# create an instance of PostFeedlotRequestVegetationInner from a dict
post_feedlot_request_vegetation_inner_from_dict = PostFeedlotRequestVegetationInner.from_dict(post_feedlot_request_vegetation_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


