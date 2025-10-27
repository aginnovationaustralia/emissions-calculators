# PostSheepbeef200ResponseIntensities


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**beef_including_sequestration** | **float** | Beef including carbon sequestration, in kg-CO2e/kg liveweight | 
**beef_excluding_sequestration** | **float** | Beef excluding carbon sequestration, in kg-CO2e/kg liveweight | 
**liveweight_beef_produced_kg** | **float** | Liveweight produced in kg | 
**wool_including_sequestration** | **float** | Wool production including carbon sequestration, in kg-CO2e/kg greasy | 
**wool_excluding_sequestration** | **float** | Wool production excluding carbon sequestration, in kg-CO2e/kg greasy | 
**sheep_meat_breeding_including_sequestration** | **float** | Sheep meat (breeding herd) including carbon sequestration, in kg-CO2e/kg liveweight | 
**sheep_meat_breeding_excluding_sequestration** | **float** | Sheep meat (breeding herd) excluding carbon sequestration, in kg-CO2e/kg liveweight | 
**wool_produced_kg** | **float** | Greasy wool produced in kg | 
**sheep_meat_produced_kg** | **float** | Sheep meat produced in kg liveweight | 

## Example

```python
from openapi_client.models.post_sheepbeef200_response_intensities import PostSheepbeef200ResponseIntensities

# TODO update the JSON string below
json = "{}"
# create an instance of PostSheepbeef200ResponseIntensities from a JSON string
post_sheepbeef200_response_intensities_instance = PostSheepbeef200ResponseIntensities.from_json(json)
# print the JSON string representation of the object
print(PostSheepbeef200ResponseIntensities.to_json())

# convert the object into a dict
post_sheepbeef200_response_intensities_dict = post_sheepbeef200_response_intensities_instance.to_dict()
# create an instance of PostSheepbeef200ResponseIntensities from a dict
post_sheepbeef200_response_intensities_from_dict = PostSheepbeef200ResponseIntensities.from_dict(post_sheepbeef200_response_intensities_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


