# PostPoultryRequestBroilersInnerGroupsInnerFeedInner

Poultry feed

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**ingredients** | [**PostPoultryRequestBroilersInnerGroupsInnerFeedInnerIngredients**](PostPoultryRequestBroilersInnerGroupsInnerFeedInnerIngredients.md) |  | 
**feed_purchased** | **float** | Feed purchased, in tonnes | 
**additional_ingredient** | **float** | Fraction of additional ingredients in feed mix, from 0 to 1 | 
**emission_intensity** | **float** | Emissions intensity of feed product in GHG (kg CO2-e/kg input) | 

## Example

```python
from openapi_client.models.post_poultry_request_broilers_inner_groups_inner_feed_inner import PostPoultryRequestBroilersInnerGroupsInnerFeedInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostPoultryRequestBroilersInnerGroupsInnerFeedInner from a JSON string
post_poultry_request_broilers_inner_groups_inner_feed_inner_instance = PostPoultryRequestBroilersInnerGroupsInnerFeedInner.from_json(json)
# print the JSON string representation of the object
print(PostPoultryRequestBroilersInnerGroupsInnerFeedInner.to_json())

# convert the object into a dict
post_poultry_request_broilers_inner_groups_inner_feed_inner_dict = post_poultry_request_broilers_inner_groups_inner_feed_inner_instance.to_dict()
# create an instance of PostPoultryRequestBroilersInnerGroupsInnerFeedInner from a dict
post_poultry_request_broilers_inner_groups_inner_feed_inner_from_dict = PostPoultryRequestBroilersInnerGroupsInnerFeedInner.from_dict(post_poultry_request_broilers_inner_groups_inner_feed_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


