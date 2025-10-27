# PostDairyRequestVegetationInner

Non-productive vegetation inputs along with allocations to dairy

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**vegetation** | [**PostBeefRequestVegetationInnerVegetation**](PostBeefRequestVegetationInnerVegetation.md) |  | 
**dairy_proportion** | **List[float]** | The proportion of the sequestration that is allocated to dairy | 

## Example

```python
from openapi_client.models.post_dairy_request_vegetation_inner import PostDairyRequestVegetationInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostDairyRequestVegetationInner from a JSON string
post_dairy_request_vegetation_inner_instance = PostDairyRequestVegetationInner.from_json(json)
# print the JSON string representation of the object
print(PostDairyRequestVegetationInner.to_json())

# convert the object into a dict
post_dairy_request_vegetation_inner_dict = post_dairy_request_vegetation_inner_instance.to_dict()
# create an instance of PostDairyRequestVegetationInner from a dict
post_dairy_request_vegetation_inner_from_dict = PostDairyRequestVegetationInner.from_dict(post_dairy_request_vegetation_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


