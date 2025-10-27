# PostBeef200Response

Emissions calculation output for the `beef` calculator

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**scope1** | [**PostBeef200ResponseScope1**](PostBeef200ResponseScope1.md) |  | 
**scope2** | [**PostAquaculture200ResponseScope2**](PostAquaculture200ResponseScope2.md) |  | 
**scope3** | [**PostBeef200ResponseScope3**](PostBeef200ResponseScope3.md) |  | 
**carbon_sequestration** | [**PostAquaculture200ResponseCarbonSequestration**](PostAquaculture200ResponseCarbonSequestration.md) |  | 
**intermediate** | [**List[PostBeef200ResponseIntermediateInner]**](PostBeef200ResponseIntermediateInner.md) |  | 
**net** | [**PostBeef200ResponseNet**](PostBeef200ResponseNet.md) |  | 
**intensities** | [**PostBeef200ResponseIntermediateInnerIntensities**](PostBeef200ResponseIntermediateInnerIntensities.md) |  | 

## Example

```python
from openapi_client.models.post_beef200_response import PostBeef200Response

# TODO update the JSON string below
json = "{}"
# create an instance of PostBeef200Response from a JSON string
post_beef200_response_instance = PostBeef200Response.from_json(json)
# print the JSON string representation of the object
print(PostBeef200Response.to_json())

# convert the object into a dict
post_beef200_response_dict = post_beef200_response_instance.to_dict()
# create an instance of PostBeef200Response from a dict
post_beef200_response_from_dict = PostBeef200Response.from_dict(post_beef200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


