# PostBeefRequestBurningInnerBurning

Inputs required for any savannah burning activities that took place

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**fuel** | **str** | The fuel class size that was burnt | [default to 'coarse']
**season** | **str** | The time relative to the fire season in which the burning took place | [default to 'early dry season']
**patchiness** | **str** | The patchiness of the savannah/vegetation that was burnt | [default to 'high']
**rainfall_zone** | **str** | The rainfall zone in which the burning took place | [default to 'low']
**years_since_last_fire** | **float** | Time since the last fire, in years | [default to 0]
**fire_scar_area** | **float** | The total area of the fire scar, in ha (hectares) | [default to 0]
**vegetation** | **str** | The vegetation class that was burnt | [default to 'Melaleuca woodland']

## Example

```python
from openapi_client.models.post_beef_request_burning_inner_burning import PostBeefRequestBurningInnerBurning

# TODO update the JSON string below
json = "{}"
# create an instance of PostBeefRequestBurningInnerBurning from a JSON string
post_beef_request_burning_inner_burning_instance = PostBeefRequestBurningInnerBurning.from_json(json)
# print the JSON string representation of the object
print(PostBeefRequestBurningInnerBurning.to_json())

# convert the object into a dict
post_beef_request_burning_inner_burning_dict = post_beef_request_burning_inner_burning_instance.to_dict()
# create an instance of PostBeefRequestBurningInnerBurning from a dict
post_beef_request_burning_inner_burning_from_dict = PostBeefRequestBurningInnerBurning.from_dict(post_beef_request_burning_inner_burning_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


