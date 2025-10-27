# PostBuffaloRequestVegetationInner

Non-productive vegetation inputs along with allocations to Buffalo

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**vegetation** | [**PostBeefRequestVegetationInnerVegetation**](PostBeefRequestVegetationInnerVegetation.md) |  | 
**buffalo_proportion** | **List[float]** | The proportion of the sequestration that is allocated to Buffalo | 

## Example

```python
from openapi_client.models.post_buffalo_request_vegetation_inner import PostBuffaloRequestVegetationInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostBuffaloRequestVegetationInner from a JSON string
post_buffalo_request_vegetation_inner_instance = PostBuffaloRequestVegetationInner.from_json(json)
# print the JSON string representation of the object
print(PostBuffaloRequestVegetationInner.to_json())

# convert the object into a dict
post_buffalo_request_vegetation_inner_dict = post_buffalo_request_vegetation_inner_instance.to_dict()
# create an instance of PostBuffaloRequestVegetationInner from a dict
post_buffalo_request_vegetation_inner_from_dict = PostBuffaloRequestVegetationInner.from_dict(post_buffalo_request_vegetation_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


