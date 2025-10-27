# PostBeefRequestVegetationInner

Non-productive vegetation inputs along with allocations to beef

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**vegetation** | [**PostBeefRequestVegetationInnerVegetation**](PostBeefRequestVegetationInnerVegetation.md) |  | 
**beef_proportion** | **float** | The proportion of the sequestration that is allocated to beef. Deprecation note: Please use &#x60;allocationToBeef&#x60; instead | [optional] 
**allocation_to_beef** | **List[float]** | The proportion of the sequestration that is allocated to each beef | 

## Example

```python
from openapi_client.models.post_beef_request_vegetation_inner import PostBeefRequestVegetationInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostBeefRequestVegetationInner from a JSON string
post_beef_request_vegetation_inner_instance = PostBeefRequestVegetationInner.from_json(json)
# print the JSON string representation of the object
print(PostBeefRequestVegetationInner.to_json())

# convert the object into a dict
post_beef_request_vegetation_inner_dict = post_beef_request_vegetation_inner_instance.to_dict()
# create an instance of PostBeefRequestVegetationInner from a dict
post_beef_request_vegetation_inner_from_dict = PostBeefRequestVegetationInner.from_dict(post_beef_request_vegetation_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


