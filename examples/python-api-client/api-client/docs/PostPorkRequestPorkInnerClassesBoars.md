# PostPorkRequestPorkInnerClassesBoars

Boars

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**autumn** | **float** | Pig numbers in autumn | 
**winter** | **float** | Pig numbers in winter | 
**spring** | **float** | Pig numbers in spring | 
**summer** | **float** | Pig numbers in summer | 
**head_purchased** | **float** | Number of animals purchased (head). Deprecation note: Please use &#x60;purchases&#x60; instead | [optional] 
**purchased_weight** | **float** | Weight at purchase, in liveweight kg/head (kilogram per head). Deprecation note: Please use &#x60;purchases&#x60; instead | [optional] 
**head_sold** | **float** | Number of animals sold (head) | 
**sale_weight** | **float** | Weight at sale, in liveweight kg/head (kilogram per head) | 
**purchases** | [**List[PostBuffaloRequestBuffalosInnerClassesBullsPurchasesInner]**](PostBuffaloRequestBuffalosInnerClassesBullsPurchasesInner.md) |  | [optional] 
**manure** | [**PostPorkRequestPorkInnerClassesSowsManure**](PostPorkRequestPorkInnerClassesSowsManure.md) |  | 

## Example

```python
from openapi_client.models.post_pork_request_pork_inner_classes_boars import PostPorkRequestPorkInnerClassesBoars

# TODO update the JSON string below
json = "{}"
# create an instance of PostPorkRequestPorkInnerClassesBoars from a JSON string
post_pork_request_pork_inner_classes_boars_instance = PostPorkRequestPorkInnerClassesBoars.from_json(json)
# print the JSON string representation of the object
print(PostPorkRequestPorkInnerClassesBoars.to_json())

# convert the object into a dict
post_pork_request_pork_inner_classes_boars_dict = post_pork_request_pork_inner_classes_boars_instance.to_dict()
# create an instance of PostPorkRequestPorkInnerClassesBoars from a dict
post_pork_request_pork_inner_classes_boars_from_dict = PostPorkRequestPorkInnerClassesBoars.from_dict(post_pork_request_pork_inner_classes_boars_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


