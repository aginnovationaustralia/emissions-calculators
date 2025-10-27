# PostBeefRequestBeefInnerClassesHeifersGt2

Heifers whose age is greater than 2 years old

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**autumn** | [**PostBeefRequestBeefInnerClassesBullsGt1Autumn**](PostBeefRequestBeefInnerClassesBullsGt1Autumn.md) |  | 
**winter** | [**PostBeefRequestBeefInnerClassesBullsGt1Autumn**](PostBeefRequestBeefInnerClassesBullsGt1Autumn.md) |  | 
**spring** | [**PostBeefRequestBeefInnerClassesBullsGt1Autumn**](PostBeefRequestBeefInnerClassesBullsGt1Autumn.md) |  | 
**summer** | [**PostBeefRequestBeefInnerClassesBullsGt1Autumn**](PostBeefRequestBeefInnerClassesBullsGt1Autumn.md) |  | 
**head_purchased** | **float** | Number of animals purchased (head). Deprecation note: Use &#x60;purchases&#x60; instead | [optional] 
**purchased_weight** | **float** | Weight at purchase, in liveweight kg/head (kilogram per head). Deprecation note: Use &#x60;purchases&#x60; instead | [optional] 
**source** | **str** | Source location of livestock purchase. Deprecation note: Use &#x60;purchases&#x60; instead | [optional] 
**head_sold** | **float** | Number of animals sold (head) | 
**sale_weight** | **float** | Weight at sale, in liveweight kg/head (kilogram per head) | 
**purchases** | [**List[PostBeefRequestBeefInnerClassesBullsGt1PurchasesInner]**](PostBeefRequestBeefInnerClassesBullsGt1PurchasesInner.md) |  | [optional] 

## Example

```python
from openapi_client.models.post_beef_request_beef_inner_classes_heifers_gt2 import PostBeefRequestBeefInnerClassesHeifersGt2

# TODO update the JSON string below
json = "{}"
# create an instance of PostBeefRequestBeefInnerClassesHeifersGt2 from a JSON string
post_beef_request_beef_inner_classes_heifers_gt2_instance = PostBeefRequestBeefInnerClassesHeifersGt2.from_json(json)
# print the JSON string representation of the object
print(PostBeefRequestBeefInnerClassesHeifersGt2.to_json())

# convert the object into a dict
post_beef_request_beef_inner_classes_heifers_gt2_dict = post_beef_request_beef_inner_classes_heifers_gt2_instance.to_dict()
# create an instance of PostBeefRequestBeefInnerClassesHeifersGt2 from a dict
post_beef_request_beef_inner_classes_heifers_gt2_from_dict = PostBeefRequestBeefInnerClassesHeifersGt2.from_dict(post_beef_request_beef_inner_classes_heifers_gt2_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


