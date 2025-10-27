# PostBeefRequestBeefInnerMineralSupplementation

Supplementation for livestock

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**mineral_block** | **float** | Mineral block product used, in tonnes | [default to 0]
**mineral_block_urea** | **float** | Fraction of urea content, between 0 and 1 | [default to 0]
**weaner_block** | **float** | Weaner block product used, in tonnes | [default to 0]
**weaner_block_urea** | **float** | Fraction of urea content, between 0 and 1 | [default to 0]
**dry_season_mix** | **float** | Dry season mix product used, in tonnes | [default to 0]
**dry_season_mix_urea** | **float** | Fraction of urea content, between 0 and 1 | [default to 0]

## Example

```python
from openapi_client.models.post_beef_request_beef_inner_mineral_supplementation import PostBeefRequestBeefInnerMineralSupplementation

# TODO update the JSON string below
json = "{}"
# create an instance of PostBeefRequestBeefInnerMineralSupplementation from a JSON string
post_beef_request_beef_inner_mineral_supplementation_instance = PostBeefRequestBeefInnerMineralSupplementation.from_json(json)
# print the JSON string representation of the object
print(PostBeefRequestBeefInnerMineralSupplementation.to_json())

# convert the object into a dict
post_beef_request_beef_inner_mineral_supplementation_dict = post_beef_request_beef_inner_mineral_supplementation_instance.to_dict()
# create an instance of PostBeefRequestBeefInnerMineralSupplementation from a dict
post_beef_request_beef_inner_mineral_supplementation_from_dict = PostBeefRequestBeefInnerMineralSupplementation.from_dict(post_beef_request_beef_inner_mineral_supplementation_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


