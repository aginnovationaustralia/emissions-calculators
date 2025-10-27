# PostSheepbeef200Response

Emissions calculation output for the `sheepbeef` calculator

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**scope1** | [**PostBeef200ResponseScope1**](PostBeef200ResponseScope1.md) |  | 
**scope2** | [**PostAquaculture200ResponseScope2**](PostAquaculture200ResponseScope2.md) |  | 
**scope3** | [**PostBeef200ResponseScope3**](PostBeef200ResponseScope3.md) |  | 
**carbon_sequestration** | [**PostAquaculture200ResponseCarbonSequestration**](PostAquaculture200ResponseCarbonSequestration.md) |  | 
**intermediate** | [**PostSheepbeef200ResponseIntermediate**](PostSheepbeef200ResponseIntermediate.md) |  | 
**intermediate_beef** | [**List[PostBeef200ResponseIntermediateInner]**](PostBeef200ResponseIntermediateInner.md) |  | 
**intermediate_sheep** | [**List[PostSheep200ResponseIntermediateInner]**](PostSheep200ResponseIntermediateInner.md) |  | 
**net** | [**PostSheepbeef200ResponseNet**](PostSheepbeef200ResponseNet.md) |  | 
**intensities** | [**PostSheepbeef200ResponseIntensities**](PostSheepbeef200ResponseIntensities.md) |  | 

## Example

```python
from openapi_client.models.post_sheepbeef200_response import PostSheepbeef200Response

# TODO update the JSON string below
json = "{}"
# create an instance of PostSheepbeef200Response from a JSON string
post_sheepbeef200_response_instance = PostSheepbeef200Response.from_json(json)
# print the JSON string representation of the object
print(PostSheepbeef200Response.to_json())

# convert the object into a dict
post_sheepbeef200_response_dict = post_sheepbeef200_response_instance.to_dict()
# create an instance of PostSheepbeef200Response from a dict
post_sheepbeef200_response_from_dict = PostSheepbeef200Response.from_dict(post_sheepbeef200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


