# PostWildseafisheries200ResponseIntermediateInner

Intermediate emissions calculation output for the Wild Sea Fisheries calculator

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | Unique identifier for this activity | 
**scope1** | [**PostWildseafisheries200ResponseScope1**](PostWildseafisheries200ResponseScope1.md) |  | 
**scope2** | [**PostAquaculture200ResponseScope2**](PostAquaculture200ResponseScope2.md) |  | 
**scope3** | [**PostWildseafisheries200ResponseScope3**](PostWildseafisheries200ResponseScope3.md) |  | 
**purchased_offsets** | [**PostAquaculture200ResponsePurchasedOffsets**](PostAquaculture200ResponsePurchasedOffsets.md) |  | 
**carbon_sequestration** | **float** | Carbon sequestration, in tonnes-CO2e | 
**intensities** | [**PostWildseafisheries200ResponseIntermediateInnerIntensities**](PostWildseafisheries200ResponseIntermediateInnerIntensities.md) |  | 
**net** | [**PostAquaculture200ResponseNet**](PostAquaculture200ResponseNet.md) |  | 

## Example

```python
from openapi_client.models.post_wildseafisheries200_response_intermediate_inner import PostWildseafisheries200ResponseIntermediateInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostWildseafisheries200ResponseIntermediateInner from a JSON string
post_wildseafisheries200_response_intermediate_inner_instance = PostWildseafisheries200ResponseIntermediateInner.from_json(json)
# print the JSON string representation of the object
print(PostWildseafisheries200ResponseIntermediateInner.to_json())

# convert the object into a dict
post_wildseafisheries200_response_intermediate_inner_dict = post_wildseafisheries200_response_intermediate_inner_instance.to_dict()
# create an instance of PostWildseafisheries200ResponseIntermediateInner from a dict
post_wildseafisheries200_response_intermediate_inner_from_dict = PostWildseafisheries200ResponseIntermediateInner.from_dict(post_wildseafisheries200_response_intermediate_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


