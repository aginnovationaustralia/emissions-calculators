# PostPoultryRequestVegetationInner

Non-productive vegetation inputs along with allocations to broilers and layers

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**vegetation** | [**PostBeefRequestVegetationInnerVegetation**](PostBeefRequestVegetationInnerVegetation.md) |  | 
**broilers_proportion** | **List[float]** | The proportion of the sequestration that is allocated to broilers | 
**layers_proportion** | **List[float]** | The proportion of the sequestration that is allocated to layers | 

## Example

```python
from openapi_client.models.post_poultry_request_vegetation_inner import PostPoultryRequestVegetationInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostPoultryRequestVegetationInner from a JSON string
post_poultry_request_vegetation_inner_instance = PostPoultryRequestVegetationInner.from_json(json)
# print the JSON string representation of the object
print(PostPoultryRequestVegetationInner.to_json())

# convert the object into a dict
post_poultry_request_vegetation_inner_dict = post_poultry_request_vegetation_inner_instance.to_dict()
# create an instance of PostPoultryRequestVegetationInner from a dict
post_poultry_request_vegetation_inner_from_dict = PostPoultryRequestVegetationInner.from_dict(post_poultry_request_vegetation_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


