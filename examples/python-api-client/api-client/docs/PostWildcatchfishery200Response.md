# PostWildcatchfishery200Response

Emissions calculation output for the `wildcatchfishery` calculator

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**scope1** | [**PostWildcatchfishery200ResponseScope1**](PostWildcatchfishery200ResponseScope1.md) |  | 
**scope2** | [**PostAquaculture200ResponseScope2**](PostAquaculture200ResponseScope2.md) |  | 
**scope3** | [**PostAquaculture200ResponseScope3**](PostAquaculture200ResponseScope3.md) |  | 
**purchased_offsets** | [**PostAquaculture200ResponsePurchasedOffsets**](PostAquaculture200ResponsePurchasedOffsets.md) |  | 
**net** | [**PostAquaculture200ResponseNet**](PostAquaculture200ResponseNet.md) |  | 
**intensities** | [**PostWildcatchfishery200ResponseIntensities**](PostWildcatchfishery200ResponseIntensities.md) |  | 
**carbon_sequestration** | [**PostAquaculture200ResponseCarbonSequestration**](PostAquaculture200ResponseCarbonSequestration.md) |  | 
**intermediate** | [**List[PostWildcatchfishery200ResponseIntermediateInner]**](PostWildcatchfishery200ResponseIntermediateInner.md) |  | 

## Example

```python
from openapi_client.models.post_wildcatchfishery200_response import PostWildcatchfishery200Response

# TODO update the JSON string below
json = "{}"
# create an instance of PostWildcatchfishery200Response from a JSON string
post_wildcatchfishery200_response_instance = PostWildcatchfishery200Response.from_json(json)
# print the JSON string representation of the object
print(PostWildcatchfishery200Response.to_json())

# convert the object into a dict
post_wildcatchfishery200_response_dict = post_wildcatchfishery200_response_instance.to_dict()
# create an instance of PostWildcatchfishery200Response from a dict
post_wildcatchfishery200_response_from_dict = PostWildcatchfishery200Response.from_dict(post_wildcatchfishery200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


