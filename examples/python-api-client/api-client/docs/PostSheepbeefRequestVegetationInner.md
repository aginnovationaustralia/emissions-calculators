# PostSheepbeefRequestVegetationInner

Non-productive vegetation inputs along with allocations to sheep and beef

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**vegetation** | [**PostBeefRequestVegetationInnerVegetation**](PostBeefRequestVegetationInnerVegetation.md) |  | 
**beef_proportion** | **List[float]** | The proportion of the sequestration that is allocated to beef | 
**sheep_proportion** | **List[float]** | The proportion of the sequestration that is allocated to sheep | 

## Example

```python
from openapi_client.models.post_sheepbeef_request_vegetation_inner import PostSheepbeefRequestVegetationInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostSheepbeefRequestVegetationInner from a JSON string
post_sheepbeef_request_vegetation_inner_instance = PostSheepbeefRequestVegetationInner.from_json(json)
# print the JSON string representation of the object
print(PostSheepbeefRequestVegetationInner.to_json())

# convert the object into a dict
post_sheepbeef_request_vegetation_inner_dict = post_sheepbeef_request_vegetation_inner_instance.to_dict()
# create an instance of PostSheepbeefRequestVegetationInner from a dict
post_sheepbeef_request_vegetation_inner_from_dict = PostSheepbeefRequestVegetationInner.from_dict(post_sheepbeef_request_vegetation_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


