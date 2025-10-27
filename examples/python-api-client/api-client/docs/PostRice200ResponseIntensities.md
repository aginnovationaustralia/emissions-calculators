# PostRice200ResponseIntensities

Emissions intensities for the crop

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**rice_produced_tonnes** | **float** | Rice produced in tonnes | 
**rice_excluding_sequestration** | **float** | Rice excluding sequestration, in t-CO2e/t rice | 
**rice_including_sequestration** | **float** | Rice including sequestration, in t-CO2e/t rice | 
**intensity** | **float** | Emissions intensity of rice production. Deprecation note: Use &#x60;riceIncludingSequestration&#x60; instead | 

## Example

```python
from openapi_client.models.post_rice200_response_intensities import PostRice200ResponseIntensities

# TODO update the JSON string below
json = "{}"
# create an instance of PostRice200ResponseIntensities from a JSON string
post_rice200_response_intensities_instance = PostRice200ResponseIntensities.from_json(json)
# print the JSON string representation of the object
print(PostRice200ResponseIntensities.to_json())

# convert the object into a dict
post_rice200_response_intensities_dict = post_rice200_response_intensities_instance.to_dict()
# create an instance of PostRice200ResponseIntensities from a dict
post_rice200_response_intensities_from_dict = PostRice200ResponseIntensities.from_dict(post_rice200_response_intensities_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


