# PostPork200Response

Emissions calculation output for the `pork` calculator

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**scope1** | [**PostPork200ResponseScope1**](PostPork200ResponseScope1.md) |  | 
**scope2** | [**PostAquaculture200ResponseScope2**](PostAquaculture200ResponseScope2.md) |  | 
**scope3** | [**PostPork200ResponseScope3**](PostPork200ResponseScope3.md) |  | 
**carbon_sequestration** | [**PostAquaculture200ResponseCarbonSequestration**](PostAquaculture200ResponseCarbonSequestration.md) |  | 
**net** | [**PostPork200ResponseNet**](PostPork200ResponseNet.md) |  | 
**intensities** | [**PostPork200ResponseIntensities**](PostPork200ResponseIntensities.md) |  | 
**intermediate** | [**List[PostPork200ResponseIntermediateInner]**](PostPork200ResponseIntermediateInner.md) |  | 

## Example

```python
from openapi_client.models.post_pork200_response import PostPork200Response

# TODO update the JSON string below
json = "{}"
# create an instance of PostPork200Response from a JSON string
post_pork200_response_instance = PostPork200Response.from_json(json)
# print the JSON string representation of the object
print(PostPork200Response.to_json())

# convert the object into a dict
post_pork200_response_dict = post_pork200_response_instance.to_dict()
# create an instance of PostPork200Response from a dict
post_pork200_response_from_dict = PostPork200Response.from_dict(post_pork200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


