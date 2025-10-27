# PostSheepRequestVegetationInner

Non-productive vegetation inputs along with allocations to sheep

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**vegetation** | [**PostBeefRequestVegetationInnerVegetation**](PostBeefRequestVegetationInnerVegetation.md) |  | 
**sheep_proportion** | **List[float]** | The proportion of the sequestration that is allocated to sheep | 

## Example

```python
from openapi_client.models.post_sheep_request_vegetation_inner import PostSheepRequestVegetationInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostSheepRequestVegetationInner from a JSON string
post_sheep_request_vegetation_inner_instance = PostSheepRequestVegetationInner.from_json(json)
# print the JSON string representation of the object
print(PostSheepRequestVegetationInner.to_json())

# convert the object into a dict
post_sheep_request_vegetation_inner_dict = post_sheep_request_vegetation_inner_instance.to_dict()
# create an instance of PostSheepRequestVegetationInner from a dict
post_sheep_request_vegetation_inner_from_dict = PostSheepRequestVegetationInner.from_dict(post_sheep_request_vegetation_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


