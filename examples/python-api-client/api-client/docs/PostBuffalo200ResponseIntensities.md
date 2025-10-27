# PostBuffalo200ResponseIntensities


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**liveweight_produced_kg** | **float** | Amount of buffalo meat produced in kg liveweight | 
**buffalo_meat_excluding_sequestration** | **float** | Buffalo meat (breeding herd) excluding sequestration, in kg-CO2e/kg liveweight | 
**buffalo_meat_including_sequestration** | **float** | Buffalo meat (breeding herd) including sequestration, in kg-CO2e/kg liveweight | 

## Example

```python
from openapi_client.models.post_buffalo200_response_intensities import PostBuffalo200ResponseIntensities

# TODO update the JSON string below
json = "{}"
# create an instance of PostBuffalo200ResponseIntensities from a JSON string
post_buffalo200_response_intensities_instance = PostBuffalo200ResponseIntensities.from_json(json)
# print the JSON string representation of the object
print(PostBuffalo200ResponseIntensities.to_json())

# convert the object into a dict
post_buffalo200_response_intensities_dict = post_buffalo200_response_intensities_instance.to_dict()
# create an instance of PostBuffalo200ResponseIntensities from a dict
post_buffalo200_response_intensities_from_dict = PostBuffalo200ResponseIntensities.from_dict(post_buffalo200_response_intensities_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


