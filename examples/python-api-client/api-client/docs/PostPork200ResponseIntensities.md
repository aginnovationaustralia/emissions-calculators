# PostPork200ResponseIntensities


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**pork_meat_including_sequestration** | **float** | Pork meat including carbon sequestration, in kg-CO2e/kg liveweight | 
**pork_meat_excluding_sequestration** | **float** | Pork meat excluding carbon sequestration, in kg-CO2e/kg liveweight | 
**liveweight_produced_kg** | **float** | Pork meat produced in kg liveweight | 

## Example

```python
from openapi_client.models.post_pork200_response_intensities import PostPork200ResponseIntensities

# TODO update the JSON string below
json = "{}"
# create an instance of PostPork200ResponseIntensities from a JSON string
post_pork200_response_intensities_instance = PostPork200ResponseIntensities.from_json(json)
# print the JSON string representation of the object
print(PostPork200ResponseIntensities.to_json())

# convert the object into a dict
post_pork200_response_intensities_dict = post_pork200_response_intensities_instance.to_dict()
# create an instance of PostPork200ResponseIntensities from a dict
post_pork200_response_intensities_from_dict = PostPork200ResponseIntensities.from_dict(post_pork200_response_intensities_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


