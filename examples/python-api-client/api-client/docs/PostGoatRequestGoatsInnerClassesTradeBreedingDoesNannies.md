# PostGoatRequestGoatsInnerClassesTradeBreedingDoesNannies

trade breeding does/nannies

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**autumn** | [**PostBuffaloRequestBuffalosInnerClassesBullsAutumn**](PostBuffaloRequestBuffalosInnerClassesBullsAutumn.md) |  | 
**winter** | [**PostBuffaloRequestBuffalosInnerClassesBullsAutumn**](PostBuffaloRequestBuffalosInnerClassesBullsAutumn.md) |  | 
**spring** | [**PostBuffaloRequestBuffalosInnerClassesBullsAutumn**](PostBuffaloRequestBuffalosInnerClassesBullsAutumn.md) |  | 
**summer** | [**PostBuffaloRequestBuffalosInnerClassesBullsAutumn**](PostBuffaloRequestBuffalosInnerClassesBullsAutumn.md) |  | 
**head_purchased** | **float** | Number of animals purchased (head). Deprecation note: Please use &#x60;purchases&#x60; instead | [optional] 
**purchased_weight** | **float** | Weight at purchase, in liveweight kg/head (kilogram per head). Deprecation note: Please use &#x60;purchases&#x60; instead | [optional] 
**head_sold** | **float** | Number of animals sold (head) | 
**sale_weight** | **float** | Weight at sale, in liveweight kg/head (kilogram per head) | 
**head_shorn** | **float** | Number of goat shorn, in head | 
**wool_shorn** | **float** | Weight of wool shorn, in kg/head (kilogram per head) | 
**clean_wool_yield** | **float** | Percentage of clean wool from weight of yield, from 0 to 100 | 
**purchases** | [**List[PostBuffaloRequestBuffalosInnerClassesBullsPurchasesInner]**](PostBuffaloRequestBuffalosInnerClassesBullsPurchasesInner.md) |  | [optional] 

## Example

```python
from openapi_client.models.post_goat_request_goats_inner_classes_trade_breeding_does_nannies import PostGoatRequestGoatsInnerClassesTradeBreedingDoesNannies

# TODO update the JSON string below
json = "{}"
# create an instance of PostGoatRequestGoatsInnerClassesTradeBreedingDoesNannies from a JSON string
post_goat_request_goats_inner_classes_trade_breeding_does_nannies_instance = PostGoatRequestGoatsInnerClassesTradeBreedingDoesNannies.from_json(json)
# print the JSON string representation of the object
print(PostGoatRequestGoatsInnerClassesTradeBreedingDoesNannies.to_json())

# convert the object into a dict
post_goat_request_goats_inner_classes_trade_breeding_does_nannies_dict = post_goat_request_goats_inner_classes_trade_breeding_does_nannies_instance.to_dict()
# create an instance of PostGoatRequestGoatsInnerClassesTradeBreedingDoesNannies from a dict
post_goat_request_goats_inner_classes_trade_breeding_does_nannies_from_dict = PostGoatRequestGoatsInnerClassesTradeBreedingDoesNannies.from_dict(post_goat_request_goats_inner_classes_trade_breeding_does_nannies_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


