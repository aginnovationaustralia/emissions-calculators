# PostCottonRequestVegetationInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**vegetation** | [**PostBeefRequestVegetationInnerVegetation**](PostBeefRequestVegetationInnerVegetation.md) |  | 
**allocation_to_crops** | **List[float]** |  | 

## Example

```python
from openapi_client.models.post_cotton_request_vegetation_inner import PostCottonRequestVegetationInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostCottonRequestVegetationInner from a JSON string
post_cotton_request_vegetation_inner_instance = PostCottonRequestVegetationInner.from_json(json)
# print the JSON string representation of the object
print(PostCottonRequestVegetationInner.to_json())

# convert the object into a dict
post_cotton_request_vegetation_inner_dict = post_cotton_request_vegetation_inner_instance.to_dict()
# create an instance of PostCottonRequestVegetationInner from a dict
post_cotton_request_vegetation_inner_from_dict = PostCottonRequestVegetationInner.from_dict(post_cotton_request_vegetation_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


