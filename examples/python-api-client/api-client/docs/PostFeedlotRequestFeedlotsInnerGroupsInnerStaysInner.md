# PostFeedlotRequestFeedlotsInnerGroupsInnerStaysInner

A class of cattle with a specific feedlot stay duration

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**livestock** | **float** | Number of animals (head) | 
**stay_average_duration** | **float** | Average stay length in feedlot, in days | 
**liveweight** | **float** | Average liveweight of animals in kg/head (kilogram per head) | 
**dry_matter_digestibility** | **float** | Percent dry matter digestibility of the feed eaten, from 0 to 100 | 
**crude_protein** | **float** | Percent crude protein of the whole diet, from 0 to 100 | 
**nitrogen_retention** | **float** | Percent nitrogen retention of intake, from 0 to 100 | 
**daily_intake** | **float** | Daily intake of dry matter in kilograms per head per day | 
**ndf** | **float** | Percent Neutral detergent fibre (NDF) of intake, from 0 to 100 | 
**ether_extract** | **float** | Percent ether extract of intake, from 0 to 100 | 

## Example

```python
from openapi_client.models.post_feedlot_request_feedlots_inner_groups_inner_stays_inner import PostFeedlotRequestFeedlotsInnerGroupsInnerStaysInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostFeedlotRequestFeedlotsInnerGroupsInnerStaysInner from a JSON string
post_feedlot_request_feedlots_inner_groups_inner_stays_inner_instance = PostFeedlotRequestFeedlotsInnerGroupsInnerStaysInner.from_json(json)
# print the JSON string representation of the object
print(PostFeedlotRequestFeedlotsInnerGroupsInnerStaysInner.to_json())

# convert the object into a dict
post_feedlot_request_feedlots_inner_groups_inner_stays_inner_dict = post_feedlot_request_feedlots_inner_groups_inner_stays_inner_instance.to_dict()
# create an instance of PostFeedlotRequestFeedlotsInnerGroupsInnerStaysInner from a dict
post_feedlot_request_feedlots_inner_groups_inner_stays_inner_from_dict = PostFeedlotRequestFeedlotsInnerGroupsInnerStaysInner.from_dict(post_feedlot_request_feedlots_inner_groups_inner_stays_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


