# PostVineyardRequest

Input data required for the `vineyard` calculator

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**vineyards** | [**List[PostVineyardRequestVineyardsInner]**](PostVineyardRequestVineyardsInner.md) |  | 
**vegetation** | [**List[PostVineyardRequestVegetationInner]**](PostVineyardRequestVegetationInner.md) |  | 

## Example

```python
from openapi_client.models.post_vineyard_request import PostVineyardRequest

# TODO update the JSON string below
json = "{}"
# create an instance of PostVineyardRequest from a JSON string
post_vineyard_request_instance = PostVineyardRequest.from_json(json)
# print the JSON string representation of the object
print(PostVineyardRequest.to_json())

# convert the object into a dict
post_vineyard_request_dict = post_vineyard_request_instance.to_dict()
# create an instance of PostVineyardRequest from a dict
post_vineyard_request_from_dict = PostVineyardRequest.from_dict(post_vineyard_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


