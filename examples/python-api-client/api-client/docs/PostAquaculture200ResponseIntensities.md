# PostAquaculture200ResponseIntensities


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**total_harvest_weight_kg** | **float** | Total harvest weight in kg | 
**aquaculture_excluding_carbon_offsets** | **float** | Aquaculture emissions intensity excluding sequestration, in kg-CO2e/kg | 
**aquaculture_including_carbon_offsets** | **float** | Aquaculture emissions intensity including sequestration, in kg-CO2e/kg | 

## Example

```python
from openapi_client.models.post_aquaculture200_response_intensities import PostAquaculture200ResponseIntensities

# TODO update the JSON string below
json = "{}"
# create an instance of PostAquaculture200ResponseIntensities from a JSON string
post_aquaculture200_response_intensities_instance = PostAquaculture200ResponseIntensities.from_json(json)
# print the JSON string representation of the object
print(PostAquaculture200ResponseIntensities.to_json())

# convert the object into a dict
post_aquaculture200_response_intensities_dict = post_aquaculture200_response_intensities_instance.to_dict()
# create an instance of PostAquaculture200ResponseIntensities from a dict
post_aquaculture200_response_intensities_from_dict = PostAquaculture200ResponseIntensities.from_dict(post_aquaculture200_response_intensities_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


