# PostSheepbeef200ResponseIntermediateSheep

Emission output breakdown just for sheep livestock

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**scope1** | [**PostBeef200ResponseScope1**](PostBeef200ResponseScope1.md) |  | 
**scope2** | [**PostAquaculture200ResponseScope2**](PostAquaculture200ResponseScope2.md) |  | 
**scope3** | [**PostBeef200ResponseScope3**](PostBeef200ResponseScope3.md) |  | 
**carbon_sequestration** | **float** | Carbon sequestration, in tonnes-CO2e | 
**net** | [**PostAquaculture200ResponseNet**](PostAquaculture200ResponseNet.md) |  | 
**intensities** | [**PostSheep200ResponseIntermediateInnerIntensities**](PostSheep200ResponseIntermediateInnerIntensities.md) |  | 

## Example

```python
from openapi_client.models.post_sheepbeef200_response_intermediate_sheep import PostSheepbeef200ResponseIntermediateSheep

# TODO update the JSON string below
json = "{}"
# create an instance of PostSheepbeef200ResponseIntermediateSheep from a JSON string
post_sheepbeef200_response_intermediate_sheep_instance = PostSheepbeef200ResponseIntermediateSheep.from_json(json)
# print the JSON string representation of the object
print(PostSheepbeef200ResponseIntermediateSheep.to_json())

# convert the object into a dict
post_sheepbeef200_response_intermediate_sheep_dict = post_sheepbeef200_response_intermediate_sheep_instance.to_dict()
# create an instance of PostSheepbeef200ResponseIntermediateSheep from a dict
post_sheepbeef200_response_intermediate_sheep_from_dict = PostSheepbeef200ResponseIntermediateSheep.from_dict(post_sheepbeef200_response_intermediate_sheep_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


