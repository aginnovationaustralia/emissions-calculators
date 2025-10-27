# PostWildseafisheries200Response

Emissions calculation output for the `wildseafisheries` calculator

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**scope1** | [**PostWildseafisheries200ResponseScope1**](PostWildseafisheries200ResponseScope1.md) |  | 
**scope2** | [**PostAquaculture200ResponseScope2**](PostAquaculture200ResponseScope2.md) |  | 
**scope3** | [**PostWildseafisheries200ResponseScope3**](PostWildseafisheries200ResponseScope3.md) |  | 
**purchased_offsets** | [**PostAquaculture200ResponsePurchasedOffsets**](PostAquaculture200ResponsePurchasedOffsets.md) |  | 
**intermediate** | [**List[PostWildseafisheries200ResponseIntermediateInner]**](PostWildseafisheries200ResponseIntermediateInner.md) |  | 
**net** | [**PostAquaculture200ResponseNet**](PostAquaculture200ResponseNet.md) |  | 
**intensities** | [**List[PostWildseafisheries200ResponseIntermediateInnerIntensities]**](PostWildseafisheries200ResponseIntermediateInnerIntensities.md) | Emissions intensity for each enterprise (in order), in t-CO2e/t product caught | 

## Example

```python
from openapi_client.models.post_wildseafisheries200_response import PostWildseafisheries200Response

# TODO update the JSON string below
json = "{}"
# create an instance of PostWildseafisheries200Response from a JSON string
post_wildseafisheries200_response_instance = PostWildseafisheries200Response.from_json(json)
# print the JSON string representation of the object
print(PostWildseafisheries200Response.to_json())

# convert the object into a dict
post_wildseafisheries200_response_dict = post_wildseafisheries200_response_instance.to_dict()
# create an instance of PostWildseafisheries200Response from a dict
post_wildseafisheries200_response_from_dict = PostWildseafisheries200Response.from_dict(post_wildseafisheries200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


