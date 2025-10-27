# PostPorkRequestVegetationInner

Non-productive vegetation inputs allocated to a particular activity type

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**vegetation** | [**PostBeefRequestVegetationInnerVegetation**](PostBeefRequestVegetationInnerVegetation.md) |  | 
**allocated_proportion** | **List[float]** | The proportion of the sequestration that is allocated to the activity | 

## Example

```python
from openapi_client.models.post_pork_request_vegetation_inner import PostPorkRequestVegetationInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostPorkRequestVegetationInner from a JSON string
post_pork_request_vegetation_inner_instance = PostPorkRequestVegetationInner.from_json(json)
# print the JSON string representation of the object
print(PostPorkRequestVegetationInner.to_json())

# convert the object into a dict
post_pork_request_vegetation_inner_dict = post_pork_request_vegetation_inner_instance.to_dict()
# create an instance of PostPorkRequestVegetationInner from a dict
post_pork_request_vegetation_inner_from_dict = PostPorkRequestVegetationInner.from_dict(post_pork_request_vegetation_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


