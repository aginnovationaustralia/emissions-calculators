# PostPoultryRequestBroilersInnerGroupsInner

Poultry broiler group

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**meat_chicken_growers** | [**PostPoultryRequestBroilersInnerGroupsInnerMeatChickenGrowers**](PostPoultryRequestBroilersInnerGroupsInnerMeatChickenGrowers.md) |  | 
**meat_chicken_layers** | [**PostPoultryRequestBroilersInnerGroupsInnerMeatChickenGrowers**](PostPoultryRequestBroilersInnerGroupsInnerMeatChickenGrowers.md) |  | 
**meat_other** | [**PostPoultryRequestBroilersInnerGroupsInnerMeatChickenGrowers**](PostPoultryRequestBroilersInnerGroupsInnerMeatChickenGrowers.md) |  | 
**feed** | [**List[PostPoultryRequestBroilersInnerGroupsInnerFeedInner]**](PostPoultryRequestBroilersInnerGroupsInnerFeedInner.md) |  | 
**custom_feed_purchased** | **float** | Custom feed purchased, in tonnes | 
**custom_feed_emission_intensity** | **float** | Emissions intensity of custom feed in GHG (kg CO2-e/kg input) | 

## Example

```python
from openapi_client.models.post_poultry_request_broilers_inner_groups_inner import PostPoultryRequestBroilersInnerGroupsInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostPoultryRequestBroilersInnerGroupsInner from a JSON string
post_poultry_request_broilers_inner_groups_inner_instance = PostPoultryRequestBroilersInnerGroupsInner.from_json(json)
# print the JSON string representation of the object
print(PostPoultryRequestBroilersInnerGroupsInner.to_json())

# convert the object into a dict
post_poultry_request_broilers_inner_groups_inner_dict = post_poultry_request_broilers_inner_groups_inner_instance.to_dict()
# create an instance of PostPoultryRequestBroilersInnerGroupsInner from a dict
post_poultry_request_broilers_inner_groups_inner_from_dict = PostPoultryRequestBroilersInnerGroupsInner.from_dict(post_poultry_request_broilers_inner_groups_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


