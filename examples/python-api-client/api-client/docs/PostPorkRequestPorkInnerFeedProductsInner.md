# PostPorkRequestPorkInnerFeedProductsInner

Pig feed product

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**feed_purchased** | **float** | Pig feed purchased, in tonnes | 
**additional_ingredients** | **float** | Fraction of additional ingredient in feed mix, from 0 to 1 | 
**emissions_intensity** | **float** | Emissions intensity of feed product in GHG (kg CO2-e/kg input) | 
**ingredients** | [**PostPorkRequestPorkInnerFeedProductsInnerIngredients**](PostPorkRequestPorkInnerFeedProductsInnerIngredients.md) |  | 

## Example

```python
from openapi_client.models.post_pork_request_pork_inner_feed_products_inner import PostPorkRequestPorkInnerFeedProductsInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostPorkRequestPorkInnerFeedProductsInner from a JSON string
post_pork_request_pork_inner_feed_products_inner_instance = PostPorkRequestPorkInnerFeedProductsInner.from_json(json)
# print the JSON string representation of the object
print(PostPorkRequestPorkInnerFeedProductsInner.to_json())

# convert the object into a dict
post_pork_request_pork_inner_feed_products_inner_dict = post_pork_request_pork_inner_feed_products_inner_instance.to_dict()
# create an instance of PostPorkRequestPorkInnerFeedProductsInner from a dict
post_pork_request_pork_inner_feed_products_inner_from_dict = PostPorkRequestPorkInnerFeedProductsInner.from_dict(post_pork_request_pork_inner_feed_products_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


