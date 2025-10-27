# PostCotton200ResponseIntermediateInnerIntensities

Cotton intensities output

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**cotton_yield_produced_tonnes** | **float** | Cotton yield produced in tonnes | 
**bales_produced** | **float** | Number of bales produced | 
**lint_produced_tonnes** | **float** | Cotton lint produced in tonnes | 
**seed_produced_tonnes** | **float** | Cotton seed produced in tonnes | 
**tonnes_crop_excluding_sequestration** | **float** | Emissions intensity excluding sequestration, in t-CO2e/t crop | 
**tonnes_crop_including_sequestration** | **float** | Emissions intensity including sequestration, in t-CO2e/t crop | 
**bales_excluding_sequestration** | **float** | Emissions intensity excluding sequestration, in t-CO2e/bale | 
**bales_including_sequestration** | **float** | Emissions intensity including sequestration, in t-CO2e/bale | 
**lint_including_sequestration** | **float** | Emissions intensity of lint including sequestration, in t-CO2e/kg | 
**lint_excluding_sequestration** | **float** | Emissions intensity of lint excluding sequestration, in t-CO2e/kg | 
**seed_including_sequestration** | **float** | Emissions intensity of seed including sequestration, in t-CO2e/kg | 
**seed_excluding_sequestration** | **float** | Emissions intensity of seed excluding sequestration, in t-CO2e/kg | 
**lint_economic_allocation** | **float** | Emissions intensity of lint using economic allocation, in t-CO2e/kg | 
**seed_economic_allocation** | **float** | Emissions intensity of seed using economic allocation, in t-CO2e/kg | 

## Example

```python
from openapi_client.models.post_cotton200_response_intermediate_inner_intensities import PostCotton200ResponseIntermediateInnerIntensities

# TODO update the JSON string below
json = "{}"
# create an instance of PostCotton200ResponseIntermediateInnerIntensities from a JSON string
post_cotton200_response_intermediate_inner_intensities_instance = PostCotton200ResponseIntermediateInnerIntensities.from_json(json)
# print the JSON string representation of the object
print(PostCotton200ResponseIntermediateInnerIntensities.to_json())

# convert the object into a dict
post_cotton200_response_intermediate_inner_intensities_dict = post_cotton200_response_intermediate_inner_intensities_instance.to_dict()
# create an instance of PostCotton200ResponseIntermediateInnerIntensities from a dict
post_cotton200_response_intermediate_inner_intensities_from_dict = PostCotton200ResponseIntermediateInnerIntensities.from_dict(post_cotton200_response_intermediate_inner_intensities_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


