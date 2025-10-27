# PostProcessing200ResponseScope3

Scope 3 emissions are indirect greenhouse gas emissions other than scope 2 emissions that are generated in the wider economy, in tonnes-CO2e (tonnes of carbon dioxide equivalent)

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**electricity** | **float** | Emissions from electricity, in tonnes-CO2e | 
**fuel** | **float** | Emissions from fuel, in tonnes-CO2e | 
**solid_waste_sent_offsite** | **float** | Emissions from solid waste sent offsite, in tonnes-CO2e | 
**total** | **float** | Total scope 3 emissions, in tonnes-CO2e | 

## Example

```python
from openapi_client.models.post_processing200_response_scope3 import PostProcessing200ResponseScope3

# TODO update the JSON string below
json = "{}"
# create an instance of PostProcessing200ResponseScope3 from a JSON string
post_processing200_response_scope3_instance = PostProcessing200ResponseScope3.from_json(json)
# print the JSON string representation of the object
print(PostProcessing200ResponseScope3.to_json())

# convert the object into a dict
post_processing200_response_scope3_dict = post_processing200_response_scope3_instance.to_dict()
# create an instance of PostProcessing200ResponseScope3 from a dict
post_processing200_response_scope3_from_dict = PostProcessing200ResponseScope3.from_dict(post_processing200_response_scope3_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


