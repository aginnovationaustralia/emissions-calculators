# PostWildcatchfishery200ResponseIntensities


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**total_harvest_weight_kg** | **float** | Total harvest weight in kg | 
**wild_catch_fishery_excluding_carbon_offsets** | **float** | Wild catch fishery emissions intensity excluding sequestration, in kg-CO2e/kg harvest weight | 
**wild_catch_fishery_including_carbon_offsets** | **float** | Wild catch fishery emissions intensity including sequestration, in kg-CO2e/kg harvest weight | 

## Example

```python
from openapi_client.models.post_wildcatchfishery200_response_intensities import PostWildcatchfishery200ResponseIntensities

# TODO update the JSON string below
json = "{}"
# create an instance of PostWildcatchfishery200ResponseIntensities from a JSON string
post_wildcatchfishery200_response_intensities_instance = PostWildcatchfishery200ResponseIntensities.from_json(json)
# print the JSON string representation of the object
print(PostWildcatchfishery200ResponseIntensities.to_json())

# convert the object into a dict
post_wildcatchfishery200_response_intensities_dict = post_wildcatchfishery200_response_intensities_instance.to_dict()
# create an instance of PostWildcatchfishery200ResponseIntensities from a dict
post_wildcatchfishery200_response_intensities_from_dict = PostWildcatchfishery200ResponseIntensities.from_dict(post_wildcatchfishery200_response_intensities_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


