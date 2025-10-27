# PostSheep200ResponseIntermediateInnerIntensities


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**wool_produced_kg** | **float** | Greasy wool produced in kg | 
**sheep_meat_produced_kg** | **float** | Sheep meat produced in kg liveweight | 
**wool_including_sequestration** | **float** | Wool production including carbon sequestration, in kg-CO2e/kg greasy | 
**wool_excluding_sequestration** | **float** | Wool production excluding carbon sequestration, in kg-CO2e/kg greasy | 
**sheep_meat_breeding_including_sequestration** | **float** | Sheep meat (breeding herd) including carbon sequestration, in kg-CO2e/kg liveweight | 
**sheep_meat_breeding_excluding_sequestration** | **float** | Sheep meat (breeding herd) excluding carbon sequestration, in kg-CO2e/kg liveweight | 

## Example

```python
from openapi_client.models.post_sheep200_response_intermediate_inner_intensities import PostSheep200ResponseIntermediateInnerIntensities

# TODO update the JSON string below
json = "{}"
# create an instance of PostSheep200ResponseIntermediateInnerIntensities from a JSON string
post_sheep200_response_intermediate_inner_intensities_instance = PostSheep200ResponseIntermediateInnerIntensities.from_json(json)
# print the JSON string representation of the object
print(PostSheep200ResponseIntermediateInnerIntensities.to_json())

# convert the object into a dict
post_sheep200_response_intermediate_inner_intensities_dict = post_sheep200_response_intermediate_inner_intensities_instance.to_dict()
# create an instance of PostSheep200ResponseIntermediateInnerIntensities from a dict
post_sheep200_response_intermediate_inner_intensities_from_dict = PostSheep200ResponseIntermediateInnerIntensities.from_dict(post_sheep200_response_intermediate_inner_intensities_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


