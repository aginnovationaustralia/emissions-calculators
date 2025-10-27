# PostCotton200ResponseScope3

Scope 3 emissions are indirect greenhouse gas emissions other than scope 2 emissions that are generated in the wider economy, in tonnes-CO2e (tonnes of carbon dioxide equivalent)

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**fertiliser** | **float** | Emissions from fertiliser, in tonnes-CO2e | 
**herbicide** | **float** | Emissions from herbicide, in tonnes-CO2e | 
**electricity** | **float** | Emissions from electricity, in tonnes-CO2e | 
**fuel** | **float** | Emissions from fuel, in tonnes-CO2e | 
**lime** | **float** | Emissions from lime, in tonnes-CO2e | 
**total** | **float** | Total scope 3 emissions, in tonnes-CO2e | 

## Example

```python
from openapi_client.models.post_cotton200_response_scope3 import PostCotton200ResponseScope3

# TODO update the JSON string below
json = "{}"
# create an instance of PostCotton200ResponseScope3 from a JSON string
post_cotton200_response_scope3_instance = PostCotton200ResponseScope3.from_json(json)
# print the JSON string representation of the object
print(PostCotton200ResponseScope3.to_json())

# convert the object into a dict
post_cotton200_response_scope3_dict = post_cotton200_response_scope3_instance.to_dict()
# create an instance of PostCotton200ResponseScope3 from a dict
post_cotton200_response_scope3_from_dict = PostCotton200ResponseScope3.from_dict(post_cotton200_response_scope3_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


