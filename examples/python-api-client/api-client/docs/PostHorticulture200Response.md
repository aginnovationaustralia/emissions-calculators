# PostHorticulture200Response

Emissions calculation output for the `horticulture` calculator

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**scope1** | [**PostHorticulture200ResponseScope1**](PostHorticulture200ResponseScope1.md) |  | 
**scope2** | [**PostAquaculture200ResponseScope2**](PostAquaculture200ResponseScope2.md) |  | 
**scope3** | [**PostCotton200ResponseScope3**](PostCotton200ResponseScope3.md) |  | 
**carbon_sequestration** | [**PostAquaculture200ResponseCarbonSequestration**](PostAquaculture200ResponseCarbonSequestration.md) |  | 
**intermediate** | [**List[PostHorticulture200ResponseIntermediateInner]**](PostHorticulture200ResponseIntermediateInner.md) |  | 
**net** | [**PostCotton200ResponseNet**](PostCotton200ResponseNet.md) |  | 
**intensities** | [**List[PostHorticulture200ResponseIntermediateInnerIntensitiesWithSequestration]**](PostHorticulture200ResponseIntermediateInnerIntensitiesWithSequestration.md) | Emissions intensity for each crop (in order) | 

## Example

```python
from openapi_client.models.post_horticulture200_response import PostHorticulture200Response

# TODO update the JSON string below
json = "{}"
# create an instance of PostHorticulture200Response from a JSON string
post_horticulture200_response_instance = PostHorticulture200Response.from_json(json)
# print the JSON string representation of the object
print(PostHorticulture200Response.to_json())

# convert the object into a dict
post_horticulture200_response_dict = post_horticulture200_response_instance.to_dict()
# create an instance of PostHorticulture200Response from a dict
post_horticulture200_response_from_dict = PostHorticulture200Response.from_dict(post_horticulture200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


