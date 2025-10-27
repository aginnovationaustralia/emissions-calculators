# PostAquacultureRequestEnterprisesInnerBaitInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**type** | **str** | Bait product type | 
**purchased_tonnes** | **float** | Purchased product in tonnes | 
**additional_ingredients** | **float** | Additional ingredient fraction, from 0 to 1 | 
**emissions_intensity** | **float** | Emissions intensity of additional ingredients, in kg CO2e/kg bait (default 0) | [default to 0]

## Example

```python
from openapi_client.models.post_aquaculture_request_enterprises_inner_bait_inner import PostAquacultureRequestEnterprisesInnerBaitInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostAquacultureRequestEnterprisesInnerBaitInner from a JSON string
post_aquaculture_request_enterprises_inner_bait_inner_instance = PostAquacultureRequestEnterprisesInnerBaitInner.from_json(json)
# print the JSON string representation of the object
print(PostAquacultureRequestEnterprisesInnerBaitInner.to_json())

# convert the object into a dict
post_aquaculture_request_enterprises_inner_bait_inner_dict = post_aquaculture_request_enterprises_inner_bait_inner_instance.to_dict()
# create an instance of PostAquacultureRequestEnterprisesInnerBaitInner from a dict
post_aquaculture_request_enterprises_inner_bait_inner_from_dict = PostAquacultureRequestEnterprisesInnerBaitInner.from_dict(post_aquaculture_request_enterprises_inner_bait_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


