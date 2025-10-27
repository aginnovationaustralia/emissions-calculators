# PostGrains200Response

Emissions calculation output for the `grains` calculator

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**scope1** | [**PostCotton200ResponseScope1**](PostCotton200ResponseScope1.md) |  | 
**scope2** | [**PostAquaculture200ResponseScope2**](PostAquaculture200ResponseScope2.md) |  | 
**scope3** | [**PostCotton200ResponseScope3**](PostCotton200ResponseScope3.md) |  | 
**carbon_sequestration** | [**PostAquaculture200ResponseCarbonSequestration**](PostAquaculture200ResponseCarbonSequestration.md) |  | 
**intermediate** | [**List[PostGrains200ResponseIntermediateInner]**](PostGrains200ResponseIntermediateInner.md) |  | 
**net** | [**PostCotton200ResponseNet**](PostCotton200ResponseNet.md) |  | 
**intensities_with_sequestration** | [**List[PostGrains200ResponseIntermediateInnerIntensitiesWithSequestration]**](PostGrains200ResponseIntermediateInnerIntensitiesWithSequestration.md) | Emissions intensity for each crop (in order), in t-CO2e/t crop | 
**intensities** | **List[float]** | Emissions intensity for each crop (in order), in t-CO2e/t crop | 

## Example

```python
from openapi_client.models.post_grains200_response import PostGrains200Response

# TODO update the JSON string below
json = "{}"
# create an instance of PostGrains200Response from a JSON string
post_grains200_response_instance = PostGrains200Response.from_json(json)
# print the JSON string representation of the object
print(PostGrains200Response.to_json())

# convert the object into a dict
post_grains200_response_dict = post_grains200_response_instance.to_dict()
# create an instance of PostGrains200Response from a dict
post_grains200_response_from_dict = PostGrains200Response.from_dict(post_grains200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


