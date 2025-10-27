# PostSheep200Response

Emissions calculation output for the `sheep` calculator

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**scope1** | [**PostBuffalo200ResponseScope1**](PostBuffalo200ResponseScope1.md) |  | 
**scope2** | [**PostAquaculture200ResponseScope2**](PostAquaculture200ResponseScope2.md) |  | 
**scope3** | [**PostBeef200ResponseScope3**](PostBeef200ResponseScope3.md) |  | 
**carbon_sequestration** | [**PostAquaculture200ResponseCarbonSequestration**](PostAquaculture200ResponseCarbonSequestration.md) |  | 
**intermediate** | [**List[PostSheep200ResponseIntermediateInner]**](PostSheep200ResponseIntermediateInner.md) |  | 
**net** | [**PostSheep200ResponseNet**](PostSheep200ResponseNet.md) |  | 
**intensities** | [**PostSheep200ResponseIntermediateInnerIntensities**](PostSheep200ResponseIntermediateInnerIntensities.md) |  | 

## Example

```python
from openapi_client.models.post_sheep200_response import PostSheep200Response

# TODO update the JSON string below
json = "{}"
# create an instance of PostSheep200Response from a JSON string
post_sheep200_response_instance = PostSheep200Response.from_json(json)
# print the JSON string representation of the object
print(PostSheep200Response.to_json())

# convert the object into a dict
post_sheep200_response_dict = post_sheep200_response_instance.to_dict()
# create an instance of PostSheep200Response from a dict
post_sheep200_response_from_dict = PostSheep200Response.from_dict(post_sheep200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


