# PostSheepRequestSheepInnerClassesRams


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**autumn** | [**PostSheepRequestSheepInnerClassesRamsAutumn**](PostSheepRequestSheepInnerClassesRamsAutumn.md) |  | 
**winter** | [**PostSheepRequestSheepInnerClassesRamsAutumn**](PostSheepRequestSheepInnerClassesRamsAutumn.md) |  | 
**spring** | [**PostSheepRequestSheepInnerClassesRamsAutumn**](PostSheepRequestSheepInnerClassesRamsAutumn.md) |  | 
**summer** | [**PostSheepRequestSheepInnerClassesRamsAutumn**](PostSheepRequestSheepInnerClassesRamsAutumn.md) |  | 
**head_shorn** | **float** | Number of sheep shorn, in head | 
**wool_shorn** | **float** | Weight of wool shorn, in kg/head (kilogram per head) | 
**clean_wool_yield** | **float** | Percentage of clean wool from weight of yield, from 0 to 100 | 
**head_purchased** | **float** | Number of animals purchased (head). Deprecation note: Please use &#x60;purchases&#x60; instead | [optional] 
**purchased_weight** | **float** | Weight at purchase, in liveweight kg/head (kilogram per head). Deprecation note: Please use &#x60;purchases&#x60; instead | [optional] 
**head_sold** | **float** | Number of animals sold (head) | 
**sale_weight** | **float** | Weight at sale, in liveweight kg/head (kilogram per head) | 
**purchases** | [**List[PostBuffaloRequestBuffalosInnerClassesBullsPurchasesInner]**](PostBuffaloRequestBuffalosInnerClassesBullsPurchasesInner.md) |  | [optional] 

## Example

```python
from openapi_client.models.post_sheep_request_sheep_inner_classes_rams import PostSheepRequestSheepInnerClassesRams

# TODO update the JSON string below
json = "{}"
# create an instance of PostSheepRequestSheepInnerClassesRams from a JSON string
post_sheep_request_sheep_inner_classes_rams_instance = PostSheepRequestSheepInnerClassesRams.from_json(json)
# print the JSON string representation of the object
print(PostSheepRequestSheepInnerClassesRams.to_json())

# convert the object into a dict
post_sheep_request_sheep_inner_classes_rams_dict = post_sheep_request_sheep_inner_classes_rams_instance.to_dict()
# create an instance of PostSheepRequestSheepInnerClassesRams from a dict
post_sheep_request_sheep_inner_classes_rams_from_dict = PostSheepRequestSheepInnerClassesRams.from_dict(post_sheep_request_sheep_inner_classes_rams_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


