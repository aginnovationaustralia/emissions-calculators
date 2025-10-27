# PostSheepbeef200ResponseIntermediateBeef

Emission output breakdown just for beef livestock

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**scope1** | [**PostBeef200ResponseScope1**](PostBeef200ResponseScope1.md) |  | 
**scope2** | [**PostAquaculture200ResponseScope2**](PostAquaculture200ResponseScope2.md) |  | 
**scope3** | [**PostBeef200ResponseScope3**](PostBeef200ResponseScope3.md) |  | 
**carbon_sequestration** | **float** | Carbon sequestration, in tonnes-CO2e | 
**net** | [**PostAquaculture200ResponseNet**](PostAquaculture200ResponseNet.md) |  | 
**intensities** | [**PostBeef200ResponseIntermediateInnerIntensities**](PostBeef200ResponseIntermediateInnerIntensities.md) |  | 

## Example

```python
from openapi_client.models.post_sheepbeef200_response_intermediate_beef import PostSheepbeef200ResponseIntermediateBeef

# TODO update the JSON string below
json = "{}"
# create an instance of PostSheepbeef200ResponseIntermediateBeef from a JSON string
post_sheepbeef200_response_intermediate_beef_instance = PostSheepbeef200ResponseIntermediateBeef.from_json(json)
# print the JSON string representation of the object
print(PostSheepbeef200ResponseIntermediateBeef.to_json())

# convert the object into a dict
post_sheepbeef200_response_intermediate_beef_dict = post_sheepbeef200_response_intermediate_beef_instance.to_dict()
# create an instance of PostSheepbeef200ResponseIntermediateBeef from a dict
post_sheepbeef200_response_intermediate_beef_from_dict = PostSheepbeef200ResponseIntermediateBeef.from_dict(post_sheepbeef200_response_intermediate_beef_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


