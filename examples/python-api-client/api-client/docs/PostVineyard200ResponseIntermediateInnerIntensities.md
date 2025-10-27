# PostVineyard200ResponseIntermediateInnerIntensities


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**vineyards_excluding_sequestration** | **float** | Vineyard emissions intensity excluding sequestration, in kg-CO2e/kg crop | 
**vineyards_including_sequestration** | **float** | Vineyard emissions intensity including sequestration, in kg-CO2e/kg crop | 
**crop_produced_kg** | **float** | Vineyard crop produced in kg | 

## Example

```python
from openapi_client.models.post_vineyard200_response_intermediate_inner_intensities import PostVineyard200ResponseIntermediateInnerIntensities

# TODO update the JSON string below
json = "{}"
# create an instance of PostVineyard200ResponseIntermediateInnerIntensities from a JSON string
post_vineyard200_response_intermediate_inner_intensities_instance = PostVineyard200ResponseIntermediateInnerIntensities.from_json(json)
# print the JSON string representation of the object
print(PostVineyard200ResponseIntermediateInnerIntensities.to_json())

# convert the object into a dict
post_vineyard200_response_intermediate_inner_intensities_dict = post_vineyard200_response_intermediate_inner_intensities_instance.to_dict()
# create an instance of PostVineyard200ResponseIntermediateInnerIntensities from a dict
post_vineyard200_response_intermediate_inner_intensities_from_dict = PostVineyard200ResponseIntermediateInnerIntensities.from_dict(post_vineyard200_response_intermediate_inner_intensities_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


