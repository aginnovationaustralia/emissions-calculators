# PostRice200ResponseIntermediateInner

Intermediate emissions calculation output for the Rice calculator

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | Unique identifier for this activity | 
**scope1** | [**PostRice200ResponseScope1**](PostRice200ResponseScope1.md) |  | 
**scope2** | [**PostAquaculture200ResponseScope2**](PostAquaculture200ResponseScope2.md) |  | 
**scope3** | [**PostCotton200ResponseScope3**](PostCotton200ResponseScope3.md) |  | 
**carbon_sequestration** | **float** | Carbon sequestration, in tonnes-CO2e | 
**intensities** | [**PostRice200ResponseIntermediateInnerIntensities**](PostRice200ResponseIntermediateInnerIntensities.md) |  | 
**net** | [**PostAquaculture200ResponseNet**](PostAquaculture200ResponseNet.md) |  | 

## Example

```python
from openapi_client.models.post_rice200_response_intermediate_inner import PostRice200ResponseIntermediateInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostRice200ResponseIntermediateInner from a JSON string
post_rice200_response_intermediate_inner_instance = PostRice200ResponseIntermediateInner.from_json(json)
# print the JSON string representation of the object
print(PostRice200ResponseIntermediateInner.to_json())

# convert the object into a dict
post_rice200_response_intermediate_inner_dict = post_rice200_response_intermediate_inner_instance.to_dict()
# create an instance of PostRice200ResponseIntermediateInner from a dict
post_rice200_response_intermediate_inner_from_dict = PostRice200ResponseIntermediateInner.from_dict(post_rice200_response_intermediate_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


