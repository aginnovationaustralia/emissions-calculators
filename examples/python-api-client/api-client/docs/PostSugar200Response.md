# PostSugar200Response

Emissions calculation output for the `sugar` calculator

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**scope1** | [**PostCotton200ResponseScope1**](PostCotton200ResponseScope1.md) |  | 
**scope2** | [**PostAquaculture200ResponseScope2**](PostAquaculture200ResponseScope2.md) |  | 
**scope3** | [**PostCotton200ResponseScope3**](PostCotton200ResponseScope3.md) |  | 
**carbon_sequestration** | [**PostAquaculture200ResponseCarbonSequestration**](PostAquaculture200ResponseCarbonSequestration.md) |  | 
**intermediate** | [**List[PostSugar200ResponseIntermediateInner]**](PostSugar200ResponseIntermediateInner.md) |  | 
**net** | [**PostCotton200ResponseNet**](PostCotton200ResponseNet.md) |  | 
**intensities** | [**List[PostSugar200ResponseIntermediateInnerIntensities]**](PostSugar200ResponseIntermediateInnerIntensities.md) | Emissions intensity for each crop (in order), in t-CO2e/t crop | 

## Example

```python
from openapi_client.models.post_sugar200_response import PostSugar200Response

# TODO update the JSON string below
json = "{}"
# create an instance of PostSugar200Response from a JSON string
post_sugar200_response_instance = PostSugar200Response.from_json(json)
# print the JSON string representation of the object
print(PostSugar200Response.to_json())

# convert the object into a dict
post_sugar200_response_dict = post_sugar200_response_instance.to_dict()
# create an instance of PostSugar200Response from a dict
post_sugar200_response_from_dict = PostSugar200Response.from_dict(post_sugar200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


