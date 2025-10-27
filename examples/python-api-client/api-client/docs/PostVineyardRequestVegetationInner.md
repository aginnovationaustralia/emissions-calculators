# PostVineyardRequestVegetationInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**vegetation** | [**PostBeefRequestVegetationInnerVegetation**](PostBeefRequestVegetationInnerVegetation.md) |  | 
**allocation_to_vineyards** | **List[float]** |  | 

## Example

```python
from openapi_client.models.post_vineyard_request_vegetation_inner import PostVineyardRequestVegetationInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostVineyardRequestVegetationInner from a JSON string
post_vineyard_request_vegetation_inner_instance = PostVineyardRequestVegetationInner.from_json(json)
# print the JSON string representation of the object
print(PostVineyardRequestVegetationInner.to_json())

# convert the object into a dict
post_vineyard_request_vegetation_inner_dict = post_vineyard_request_vegetation_inner_instance.to_dict()
# create an instance of PostVineyardRequestVegetationInner from a dict
post_vineyard_request_vegetation_inner_from_dict = PostVineyardRequestVegetationInner.from_dict(post_vineyard_request_vegetation_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


