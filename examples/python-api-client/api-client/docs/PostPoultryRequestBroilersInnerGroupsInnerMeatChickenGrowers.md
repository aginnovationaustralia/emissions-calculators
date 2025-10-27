# PostPoultryRequestBroilersInnerGroupsInnerMeatChickenGrowers

Broiler class with seasonal data

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**birds** | **float** | Total number of birds/head | 
**average_stay_length50** | **float** | Average length of stay until 50% of the flock is depleted, in days | 
**liveweight50** | **float** | Average liveweight during the 50% depletion period, in kg | 
**average_stay_length100** | **float** | Average length of stay until 100% of the flock is depleted, in days | 
**liveweight100** | **float** | Average liveweight during the 100% depletion period, in kg | 
**dry_matter_intake** | **float** | Dry matter intake, in kg/head/day | [optional] 
**dry_matter_digestibility** | **float** | Dry matter digestibility fraction, from 0 to 1 | [optional] 
**crude_protein** | **float** | Crude protein fraction, from 0 to 1 | [optional] 
**manure_ash** | **float** | Manure ash fraction, from 0 to 1 | [optional] 
**nitrogen_retention_rate** | **float** | Nitrogen retention rate fraction, from 0 to 1 | [optional] 

## Example

```python
from openapi_client.models.post_poultry_request_broilers_inner_groups_inner_meat_chicken_growers import PostPoultryRequestBroilersInnerGroupsInnerMeatChickenGrowers

# TODO update the JSON string below
json = "{}"
# create an instance of PostPoultryRequestBroilersInnerGroupsInnerMeatChickenGrowers from a JSON string
post_poultry_request_broilers_inner_groups_inner_meat_chicken_growers_instance = PostPoultryRequestBroilersInnerGroupsInnerMeatChickenGrowers.from_json(json)
# print the JSON string representation of the object
print(PostPoultryRequestBroilersInnerGroupsInnerMeatChickenGrowers.to_json())

# convert the object into a dict
post_poultry_request_broilers_inner_groups_inner_meat_chicken_growers_dict = post_poultry_request_broilers_inner_groups_inner_meat_chicken_growers_instance.to_dict()
# create an instance of PostPoultryRequestBroilersInnerGroupsInnerMeatChickenGrowers from a dict
post_poultry_request_broilers_inner_groups_inner_meat_chicken_growers_from_dict = PostPoultryRequestBroilersInnerGroupsInnerMeatChickenGrowers.from_dict(post_poultry_request_broilers_inner_groups_inner_meat_chicken_growers_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


