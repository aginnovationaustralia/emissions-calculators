# PostCotton200Response

Emissions calculation output for the `cotton` calculator

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**scope1** | [**PostCotton200ResponseScope1**](PostCotton200ResponseScope1.md) |  | 
**scope2** | [**PostAquaculture200ResponseScope2**](PostAquaculture200ResponseScope2.md) |  | 
**scope3** | [**PostCotton200ResponseScope3**](PostCotton200ResponseScope3.md) |  | 
**carbon_sequestration** | [**PostAquaculture200ResponseCarbonSequestration**](PostAquaculture200ResponseCarbonSequestration.md) |  | 
**intermediate** | [**List[PostCotton200ResponseIntermediateInner]**](PostCotton200ResponseIntermediateInner.md) |  | 
**net** | [**PostCotton200ResponseNet**](PostCotton200ResponseNet.md) |  | 
**intensities** | [**List[PostCotton200ResponseIntermediateInnerIntensities]**](PostCotton200ResponseIntermediateInnerIntensities.md) | Emissions intensity for each crop (in order) | 

## Example

```python
from openapi_client.models.post_cotton200_response import PostCotton200Response

# TODO update the JSON string below
json = "{}"
# create an instance of PostCotton200Response from a JSON string
post_cotton200_response_instance = PostCotton200Response.from_json(json)
# print the JSON string representation of the object
print(PostCotton200Response.to_json())

# convert the object into a dict
post_cotton200_response_dict = post_cotton200_response_instance.to_dict()
# create an instance of PostCotton200Response from a dict
post_cotton200_response_from_dict = PostCotton200Response.from_dict(post_cotton200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


