# PostWildseafisheriesRequestEnterprisesInnerBaitInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**type** | **str** | Bait product type | 
**purchased** | **float** | Purchased product in tonnes | 
**additional_ingredient** | **float** | Additional ingredient fraction, from 0 to 1 | 
**emissions_intensity** | **float** | Emissions intensity of product, in kg CO2e/kg | 

## Example

```python
from openapi_client.models.post_wildseafisheries_request_enterprises_inner_bait_inner import PostWildseafisheriesRequestEnterprisesInnerBaitInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostWildseafisheriesRequestEnterprisesInnerBaitInner from a JSON string
post_wildseafisheries_request_enterprises_inner_bait_inner_instance = PostWildseafisheriesRequestEnterprisesInnerBaitInner.from_json(json)
# print the JSON string representation of the object
print(PostWildseafisheriesRequestEnterprisesInnerBaitInner.to_json())

# convert the object into a dict
post_wildseafisheries_request_enterprises_inner_bait_inner_dict = post_wildseafisheries_request_enterprises_inner_bait_inner_instance.to_dict()
# create an instance of PostWildseafisheriesRequestEnterprisesInnerBaitInner from a dict
post_wildseafisheries_request_enterprises_inner_bait_inner_from_dict = PostWildseafisheriesRequestEnterprisesInnerBaitInner.from_dict(post_wildseafisheries_request_enterprises_inner_bait_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


