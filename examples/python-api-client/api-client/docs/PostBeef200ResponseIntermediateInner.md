# PostBeef200ResponseIntermediateInner

Intermediate emissions calculation output for the Beef calculator

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | Unique identifier for this activity | 
**scope1** | [**PostBeef200ResponseScope1**](PostBeef200ResponseScope1.md) |  | 
**scope2** | [**PostAquaculture200ResponseScope2**](PostAquaculture200ResponseScope2.md) |  | 
**scope3** | [**PostBeef200ResponseScope3**](PostBeef200ResponseScope3.md) |  | 
**carbon_sequestration** | **float** | Carbon sequestration, in tonnes-CO2e | 
**intensities** | [**PostBeef200ResponseIntermediateInnerIntensities**](PostBeef200ResponseIntermediateInnerIntensities.md) |  | 
**net** | [**PostAquaculture200ResponseNet**](PostAquaculture200ResponseNet.md) |  | 

## Example

```python
from openapi_client.models.post_beef200_response_intermediate_inner import PostBeef200ResponseIntermediateInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostBeef200ResponseIntermediateInner from a JSON string
post_beef200_response_intermediate_inner_instance = PostBeef200ResponseIntermediateInner.from_json(json)
# print the JSON string representation of the object
print(PostBeef200ResponseIntermediateInner.to_json())

# convert the object into a dict
post_beef200_response_intermediate_inner_dict = post_beef200_response_intermediate_inner_instance.to_dict()
# create an instance of PostBeef200ResponseIntermediateInner from a dict
post_beef200_response_intermediate_inner_from_dict = PostBeef200ResponseIntermediateInner.from_dict(post_beef200_response_intermediate_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


