# PostDairy200ResponseIntensities


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**milk_solids_produced_tonnes** | **float** | Milk solids produced in tonnes | 
**intensity** | **float** | Dairy intensities including carbon sequestration, in tonnes-CO2e | 

## Example

```python
from openapi_client.models.post_dairy200_response_intensities import PostDairy200ResponseIntensities

# TODO update the JSON string below
json = "{}"
# create an instance of PostDairy200ResponseIntensities from a JSON string
post_dairy200_response_intensities_instance = PostDairy200ResponseIntensities.from_json(json)
# print the JSON string representation of the object
print(PostDairy200ResponseIntensities.to_json())

# convert the object into a dict
post_dairy200_response_intensities_dict = post_dairy200_response_intensities_instance.to_dict()
# create an instance of PostDairy200ResponseIntensities from a dict
post_dairy200_response_intensities_from_dict = PostDairy200ResponseIntensities.from_dict(post_dairy200_response_intensities_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


