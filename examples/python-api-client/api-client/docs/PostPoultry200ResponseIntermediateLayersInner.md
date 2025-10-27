# PostPoultry200ResponseIntermediateLayersInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** |  | 
**scope1** | [**PostPoultry200ResponseScope1**](PostPoultry200ResponseScope1.md) |  | 
**scope2** | [**PostAquaculture200ResponseScope2**](PostAquaculture200ResponseScope2.md) |  | 
**scope3** | [**PostPoultry200ResponseScope3**](PostPoultry200ResponseScope3.md) |  | 
**carbon_sequestration** | [**PostAquaculture200ResponseIntermediateInnerCarbonSequestration**](PostAquaculture200ResponseIntermediateInnerCarbonSequestration.md) |  | 
**intensities** | [**PostPoultry200ResponseIntermediateLayersInnerIntensities**](PostPoultry200ResponseIntermediateLayersInnerIntensities.md) |  | 
**net** | [**PostAquaculture200ResponseNet**](PostAquaculture200ResponseNet.md) |  | 

## Example

```python
from openapi_client.models.post_poultry200_response_intermediate_layers_inner import PostPoultry200ResponseIntermediateLayersInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostPoultry200ResponseIntermediateLayersInner from a JSON string
post_poultry200_response_intermediate_layers_inner_instance = PostPoultry200ResponseIntermediateLayersInner.from_json(json)
# print the JSON string representation of the object
print(PostPoultry200ResponseIntermediateLayersInner.to_json())

# convert the object into a dict
post_poultry200_response_intermediate_layers_inner_dict = post_poultry200_response_intermediate_layers_inner_instance.to_dict()
# create an instance of PostPoultry200ResponseIntermediateLayersInner from a dict
post_poultry200_response_intermediate_layers_inner_from_dict = PostPoultry200ResponseIntermediateLayersInner.from_dict(post_poultry200_response_intermediate_layers_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


