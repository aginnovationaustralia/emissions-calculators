# PostRice200Response

Emissions calculation output for the `rice` calculator

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**scope1** | [**PostRice200ResponseScope1**](PostRice200ResponseScope1.md) |  | 
**scope2** | [**PostAquaculture200ResponseScope2**](PostAquaculture200ResponseScope2.md) |  | 
**scope3** | [**PostCotton200ResponseScope3**](PostCotton200ResponseScope3.md) |  | 
**carbon_sequestration** | [**PostAquaculture200ResponseCarbonSequestration**](PostAquaculture200ResponseCarbonSequestration.md) |  | 
**intermediate** | [**List[PostRice200ResponseIntermediateInner]**](PostRice200ResponseIntermediateInner.md) |  | 
**net** | [**PostCotton200ResponseNet**](PostCotton200ResponseNet.md) |  | 
**intensities** | [**PostRice200ResponseIntensities**](PostRice200ResponseIntensities.md) |  | 

## Example

```python
from openapi_client.models.post_rice200_response import PostRice200Response

# TODO update the JSON string below
json = "{}"
# create an instance of PostRice200Response from a JSON string
post_rice200_response_instance = PostRice200Response.from_json(json)
# print the JSON string representation of the object
print(PostRice200Response.to_json())

# convert the object into a dict
post_rice200_response_dict = post_rice200_response_instance.to_dict()
# create an instance of PostRice200Response from a dict
post_rice200_response_from_dict = PostRice200Response.from_dict(post_rice200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


