# PostPoultry200ResponseIntensities


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**poultry_meat_including_sequestration** | **float** | Poultry meat including carbon sequestration, in kg-CO2e/kg liveweight | 
**poultry_meat_excluding_sequestration** | **float** | Poultry meat excluding carbon sequestration, in kg-CO2e/kg liveweight | 
**poultry_eggs_including_sequestration** | **float** | Poultry eggs including carbon sequestration, in kg-CO2e/kg liveweight | 
**poultry_eggs_excluding_sequestration** | **float** | Poultry eggs excluding carbon sequestration, in kg-CO2e/kg liveweight | 
**meat_produced_kg** | **float** | Poultry meat produced in kg | 
**eggs_produced_kg** | **float** | Amount of eggs produced, in kg | 

## Example

```python
from openapi_client.models.post_poultry200_response_intensities import PostPoultry200ResponseIntensities

# TODO update the JSON string below
json = "{}"
# create an instance of PostPoultry200ResponseIntensities from a JSON string
post_poultry200_response_intensities_instance = PostPoultry200ResponseIntensities.from_json(json)
# print the JSON string representation of the object
print(PostPoultry200ResponseIntensities.to_json())

# convert the object into a dict
post_poultry200_response_intensities_dict = post_poultry200_response_intensities_instance.to_dict()
# create an instance of PostPoultry200ResponseIntensities from a dict
post_poultry200_response_intensities_from_dict = PostPoultry200ResponseIntensities.from_dict(post_poultry200_response_intensities_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


