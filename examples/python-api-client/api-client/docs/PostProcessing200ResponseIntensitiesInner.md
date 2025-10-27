# PostProcessing200ResponseIntensitiesInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**units_produced** | **float** | Number of processed product units produced | 
**unit_of_product** | **str** | Unit type of the product being produced (used by \&quot;unitsProduced\&quot;) | 
**processing_excluding_carbon_offsets** | **float** | Processing emissions intensity excluding carbon offsets, in kg-CO2e/number of units produced | 
**processing_including_carbon_offsets** | **float** | Processing emissions intensity including carbon offsets, in kg-CO2e/number of units produced | 

## Example

```python
from openapi_client.models.post_processing200_response_intensities_inner import PostProcessing200ResponseIntensitiesInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostProcessing200ResponseIntensitiesInner from a JSON string
post_processing200_response_intensities_inner_instance = PostProcessing200ResponseIntensitiesInner.from_json(json)
# print the JSON string representation of the object
print(PostProcessing200ResponseIntensitiesInner.to_json())

# convert the object into a dict
post_processing200_response_intensities_inner_dict = post_processing200_response_intensities_inner_instance.to_dict()
# create an instance of PostProcessing200ResponseIntensitiesInner from a dict
post_processing200_response_intensities_inner_from_dict = PostProcessing200ResponseIntensitiesInner.from_dict(post_processing200_response_intensities_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


