# PostFeedlotRequestFeedlotsInnerPurchases

Note: passing a single `FeedlotPurchase` for each class is now deprecated, please pass an array (`FeedlotPurchases[]`) instead

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**bulls_gt1** | [**List[PostFeedlotRequestFeedlotsInnerPurchasesBullsGt1Inner]**](PostFeedlotRequestFeedlotsInnerPurchasesBullsGt1Inner.md) | Livestock purchases for bulls whose age is greater than 1 year old | [optional] 
**bulls_gt1_traded** | [**List[PostFeedlotRequestFeedlotsInnerPurchasesBullsGt1Inner]**](PostFeedlotRequestFeedlotsInnerPurchasesBullsGt1Inner.md) | Livestock purchases for traded bulls whose age is greater than 1 year old | [optional] 
**steers_lt1** | [**List[PostFeedlotRequestFeedlotsInnerPurchasesBullsGt1Inner]**](PostFeedlotRequestFeedlotsInnerPurchasesBullsGt1Inner.md) | Livestock purchases for Steers whose age is less than 1 year old | [optional] 
**steers_lt1_traded** | [**List[PostFeedlotRequestFeedlotsInnerPurchasesBullsGt1Inner]**](PostFeedlotRequestFeedlotsInnerPurchasesBullsGt1Inner.md) | Livestock purchases for traded Steers whose age is less than 1 year old | [optional] 
**steers1_to2** | [**List[PostFeedlotRequestFeedlotsInnerPurchasesBullsGt1Inner]**](PostFeedlotRequestFeedlotsInnerPurchasesBullsGt1Inner.md) | Livestock purchases for Steers whose age is between 1 and 2 years old | [optional] 
**steers1_to2_traded** | [**List[PostFeedlotRequestFeedlotsInnerPurchasesBullsGt1Inner]**](PostFeedlotRequestFeedlotsInnerPurchasesBullsGt1Inner.md) | Livestock purchases for traded Steers whose age is between 1 and 2 years old | [optional] 
**steers_gt2** | [**List[PostFeedlotRequestFeedlotsInnerPurchasesBullsGt1Inner]**](PostFeedlotRequestFeedlotsInnerPurchasesBullsGt1Inner.md) | Livestock purchases for Steers whose age is greater than 2 years old | [optional] 
**steers_gt2_traded** | [**List[PostFeedlotRequestFeedlotsInnerPurchasesBullsGt1Inner]**](PostFeedlotRequestFeedlotsInnerPurchasesBullsGt1Inner.md) | Livestock purchases for traded Steers whose age is greater than 2 years old | [optional] 
**cows_gt2** | [**List[PostFeedlotRequestFeedlotsInnerPurchasesBullsGt1Inner]**](PostFeedlotRequestFeedlotsInnerPurchasesBullsGt1Inner.md) | Livestock purchases for Cows whose age is greater than 2 years old | [optional] 
**cows_gt2_traded** | [**List[PostFeedlotRequestFeedlotsInnerPurchasesBullsGt1Inner]**](PostFeedlotRequestFeedlotsInnerPurchasesBullsGt1Inner.md) | Livestock purchases for traded Cows whose age is greater than 2 years old | [optional] 
**heifers_lt1** | [**List[PostFeedlotRequestFeedlotsInnerPurchasesBullsGt1Inner]**](PostFeedlotRequestFeedlotsInnerPurchasesBullsGt1Inner.md) | Livestock purchases for Heifers whose age is less than 1 year old | [optional] 
**heifers_lt1_traded** | [**List[PostFeedlotRequestFeedlotsInnerPurchasesBullsGt1Inner]**](PostFeedlotRequestFeedlotsInnerPurchasesBullsGt1Inner.md) | Livestock purchases for traded Heifers whose age is less than 1 year old | [optional] 
**heifers1_to2** | [**List[PostFeedlotRequestFeedlotsInnerPurchasesBullsGt1Inner]**](PostFeedlotRequestFeedlotsInnerPurchasesBullsGt1Inner.md) | Livestock purchases for Heifers whose age is between 1 and 2 years old | [optional] 
**heifers1_to2_traded** | [**List[PostFeedlotRequestFeedlotsInnerPurchasesBullsGt1Inner]**](PostFeedlotRequestFeedlotsInnerPurchasesBullsGt1Inner.md) | Livestock purchases for traded Heifers whose age is between 1 and 2 years old | [optional] 
**heifers_gt2** | [**List[PostFeedlotRequestFeedlotsInnerPurchasesBullsGt1Inner]**](PostFeedlotRequestFeedlotsInnerPurchasesBullsGt1Inner.md) | Livestock purchases for Heifers whose age is greater than 2 years old | [optional] 
**heifers_gt2_traded** | [**List[PostFeedlotRequestFeedlotsInnerPurchasesBullsGt1Inner]**](PostFeedlotRequestFeedlotsInnerPurchasesBullsGt1Inner.md) | Livestock purchases for traded Heifers whose age is greater than 2 years old | [optional] 

## Example

```python
from openapi_client.models.post_feedlot_request_feedlots_inner_purchases import PostFeedlotRequestFeedlotsInnerPurchases

# TODO update the JSON string below
json = "{}"
# create an instance of PostFeedlotRequestFeedlotsInnerPurchases from a JSON string
post_feedlot_request_feedlots_inner_purchases_instance = PostFeedlotRequestFeedlotsInnerPurchases.from_json(json)
# print the JSON string representation of the object
print(PostFeedlotRequestFeedlotsInnerPurchases.to_json())

# convert the object into a dict
post_feedlot_request_feedlots_inner_purchases_dict = post_feedlot_request_feedlots_inner_purchases_instance.to_dict()
# create an instance of PostFeedlotRequestFeedlotsInnerPurchases from a dict
post_feedlot_request_feedlots_inner_purchases_from_dict = PostFeedlotRequestFeedlotsInnerPurchases.from_dict(post_feedlot_request_feedlots_inner_purchases_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


