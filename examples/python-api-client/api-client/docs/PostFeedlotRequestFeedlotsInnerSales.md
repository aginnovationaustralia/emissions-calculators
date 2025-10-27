# PostFeedlotRequestFeedlotsInnerSales

Note: passing a single `FeedlotSale` for each class is now deprecated, please pass an array (`FeedlotSales[]`) instead

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**bulls_gt1** | [**List[PostFeedlotRequestFeedlotsInnerSalesBullsGt1Inner]**](PostFeedlotRequestFeedlotsInnerSalesBullsGt1Inner.md) | Livestock sales for bulls whose age is greater than 1 year old | 
**bulls_gt1_traded** | [**List[PostFeedlotRequestFeedlotsInnerSalesBullsGt1Inner]**](PostFeedlotRequestFeedlotsInnerSalesBullsGt1Inner.md) | Livestock sales for traded bulls whose age is greater than 1 year old | 
**steers_lt1** | [**List[PostFeedlotRequestFeedlotsInnerSalesBullsGt1Inner]**](PostFeedlotRequestFeedlotsInnerSalesBullsGt1Inner.md) | Livestock sales for Steers whose age is less than 1 year old | 
**steers_lt1_traded** | [**List[PostFeedlotRequestFeedlotsInnerSalesBullsGt1Inner]**](PostFeedlotRequestFeedlotsInnerSalesBullsGt1Inner.md) | Livestock sales for traded Steers whose age is less than 1 year old | 
**steers1_to2** | [**List[PostFeedlotRequestFeedlotsInnerSalesBullsGt1Inner]**](PostFeedlotRequestFeedlotsInnerSalesBullsGt1Inner.md) | Livestock sales for Steers whose age is between 1 and 2 years old | 
**steers1_to2_traded** | [**List[PostFeedlotRequestFeedlotsInnerSalesBullsGt1Inner]**](PostFeedlotRequestFeedlotsInnerSalesBullsGt1Inner.md) | Livestock sales for traded Steers whose age is between 1 and 2 years old | 
**steers_gt2** | [**List[PostFeedlotRequestFeedlotsInnerSalesBullsGt1Inner]**](PostFeedlotRequestFeedlotsInnerSalesBullsGt1Inner.md) | Livestock sales for Steers whose age is greater than 2 years old | 
**steers_gt2_traded** | [**List[PostFeedlotRequestFeedlotsInnerSalesBullsGt1Inner]**](PostFeedlotRequestFeedlotsInnerSalesBullsGt1Inner.md) | Livestock sales for traded Steers whose age is greater than 2 years old | 
**cows_gt2** | [**List[PostFeedlotRequestFeedlotsInnerSalesBullsGt1Inner]**](PostFeedlotRequestFeedlotsInnerSalesBullsGt1Inner.md) | Livestock sales for Cows whose age is greater than 2 years old | 
**cows_gt2_traded** | [**List[PostFeedlotRequestFeedlotsInnerSalesBullsGt1Inner]**](PostFeedlotRequestFeedlotsInnerSalesBullsGt1Inner.md) | Livestock sales for traded Cows whose age is greater than 2 years old | 
**heifers_lt1** | [**List[PostFeedlotRequestFeedlotsInnerSalesBullsGt1Inner]**](PostFeedlotRequestFeedlotsInnerSalesBullsGt1Inner.md) | Livestock sales for Heifers whose age is less than 1 year old | 
**heifers_lt1_traded** | [**List[PostFeedlotRequestFeedlotsInnerSalesBullsGt1Inner]**](PostFeedlotRequestFeedlotsInnerSalesBullsGt1Inner.md) | Livestock sales for traded Heifers whose age is less than 1 year old | 
**heifers1_to2** | [**List[PostFeedlotRequestFeedlotsInnerSalesBullsGt1Inner]**](PostFeedlotRequestFeedlotsInnerSalesBullsGt1Inner.md) | Livestock sales for Heifers whose age is between 1 and 2 years old | 
**heifers1_to2_traded** | [**List[PostFeedlotRequestFeedlotsInnerSalesBullsGt1Inner]**](PostFeedlotRequestFeedlotsInnerSalesBullsGt1Inner.md) | Livestock sales for traded Heifers whose age is between 1 and 2 years old | 
**heifers_gt2** | [**List[PostFeedlotRequestFeedlotsInnerSalesBullsGt1Inner]**](PostFeedlotRequestFeedlotsInnerSalesBullsGt1Inner.md) | Livestock sales for Heifers whose age is greater than 2 years old | 
**heifers_gt2_traded** | [**List[PostFeedlotRequestFeedlotsInnerSalesBullsGt1Inner]**](PostFeedlotRequestFeedlotsInnerSalesBullsGt1Inner.md) | Livestock sales for traded Heifers whose age is greater than 2 years old | 

## Example

```python
from openapi_client.models.post_feedlot_request_feedlots_inner_sales import PostFeedlotRequestFeedlotsInnerSales

# TODO update the JSON string below
json = "{}"
# create an instance of PostFeedlotRequestFeedlotsInnerSales from a JSON string
post_feedlot_request_feedlots_inner_sales_instance = PostFeedlotRequestFeedlotsInnerSales.from_json(json)
# print the JSON string representation of the object
print(PostFeedlotRequestFeedlotsInnerSales.to_json())

# convert the object into a dict
post_feedlot_request_feedlots_inner_sales_dict = post_feedlot_request_feedlots_inner_sales_instance.to_dict()
# create an instance of PostFeedlotRequestFeedlotsInnerSales from a dict
post_feedlot_request_feedlots_inner_sales_from_dict = PostFeedlotRequestFeedlotsInnerSales.from_dict(post_feedlot_request_feedlots_inner_sales_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


