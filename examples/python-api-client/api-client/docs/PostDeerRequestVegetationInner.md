# PostDeerRequestVegetationInner

Non-productive vegetation inputs along with allocations to deer

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**vegetation** | [**PostBeefRequestVegetationInnerVegetation**](PostBeefRequestVegetationInnerVegetation.md) |  | 
**deer_proportion** | **List[float]** | The proportion of the sequestration that is allocated to deer | 

## Example

```python
from openapi_client.models.post_deer_request_vegetation_inner import PostDeerRequestVegetationInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostDeerRequestVegetationInner from a JSON string
post_deer_request_vegetation_inner_instance = PostDeerRequestVegetationInner.from_json(json)
# print the JSON string representation of the object
print(PostDeerRequestVegetationInner.to_json())

# convert the object into a dict
post_deer_request_vegetation_inner_dict = post_deer_request_vegetation_inner_instance.to_dict()
# create an instance of PostDeerRequestVegetationInner from a dict
post_deer_request_vegetation_inner_from_dict = PostDeerRequestVegetationInner.from_dict(post_deer_request_vegetation_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


