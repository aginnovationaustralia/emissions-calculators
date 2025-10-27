# PostGoat200ResponseIntensities


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**amount_meat_produced** | **float** | Amount of goat meat produced in kg liveweight | 
**amount_wool_produced** | **float** | Amount of wool produced in kg greasy | 
**goat_meat_breeding_including_sequestration** | **float** | Goat meat (breeding herd) including carbon sequestration, in kg-CO2e/kg liveweight | 
**goat_meat_breeding_excluding_sequestration** | **float** | Goat meat (breeding herd) excluding carbon sequestration, in kg-CO2e/kg liveweight | 
**wool_including_sequestration** | **float** | Wool production including carbon sequestration, in kg-CO2e/kg greasy | 
**wool_excluding_sequestration** | **float** | Wool production excluding carbon sequestration, in kg-CO2e/kg greasy | 

## Example

```python
from openapi_client.models.post_goat200_response_intensities import PostGoat200ResponseIntensities

# TODO update the JSON string below
json = "{}"
# create an instance of PostGoat200ResponseIntensities from a JSON string
post_goat200_response_intensities_instance = PostGoat200ResponseIntensities.from_json(json)
# print the JSON string representation of the object
print(PostGoat200ResponseIntensities.to_json())

# convert the object into a dict
post_goat200_response_intensities_dict = post_goat200_response_intensities_instance.to_dict()
# create an instance of PostGoat200ResponseIntensities from a dict
post_goat200_response_intensities_from_dict = PostGoat200ResponseIntensities.from_dict(post_goat200_response_intensities_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


