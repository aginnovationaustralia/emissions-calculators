# PostBuffaloRequestBuffalosInnerClassesSteers

Steers

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**autumn** | [**PostBuffaloRequestBuffalosInnerClassesBullsAutumn**](PostBuffaloRequestBuffalosInnerClassesBullsAutumn.md) |  | 
**winter** | [**PostBuffaloRequestBuffalosInnerClassesBullsAutumn**](PostBuffaloRequestBuffalosInnerClassesBullsAutumn.md) |  | 
**spring** | [**PostBuffaloRequestBuffalosInnerClassesBullsAutumn**](PostBuffaloRequestBuffalosInnerClassesBullsAutumn.md) |  | 
**summer** | [**PostBuffaloRequestBuffalosInnerClassesBullsAutumn**](PostBuffaloRequestBuffalosInnerClassesBullsAutumn.md) |  | 
**head_sold** | **float** | Number of animals sold (head) | 
**sale_weight** | **float** | Weight at sale, in liveweight kg/head (kilogram per head) | 
**purchases** | [**List[PostBuffaloRequestBuffalosInnerClassesBullsPurchasesInner]**](PostBuffaloRequestBuffalosInnerClassesBullsPurchasesInner.md) |  | [optional] 

## Example

```python
from openapi_client.models.post_buffalo_request_buffalos_inner_classes_steers import PostBuffaloRequestBuffalosInnerClassesSteers

# TODO update the JSON string below
json = "{}"
# create an instance of PostBuffaloRequestBuffalosInnerClassesSteers from a JSON string
post_buffalo_request_buffalos_inner_classes_steers_instance = PostBuffaloRequestBuffalosInnerClassesSteers.from_json(json)
# print the JSON string representation of the object
print(PostBuffaloRequestBuffalosInnerClassesSteers.to_json())

# convert the object into a dict
post_buffalo_request_buffalos_inner_classes_steers_dict = post_buffalo_request_buffalos_inner_classes_steers_instance.to_dict()
# create an instance of PostBuffaloRequestBuffalosInnerClassesSteers from a dict
post_buffalo_request_buffalos_inner_classes_steers_from_dict = PostBuffaloRequestBuffalosInnerClassesSteers.from_dict(post_buffalo_request_buffalos_inner_classes_steers_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


