# PostProcessing200ResponseIntermediateInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | Unique identifier for this activity | 
**scope1** | [**PostProcessing200ResponseScope1**](PostProcessing200ResponseScope1.md) |  | 
**scope2** | [**PostAquaculture200ResponseScope2**](PostAquaculture200ResponseScope2.md) |  | 
**scope3** | [**PostProcessing200ResponseScope3**](PostProcessing200ResponseScope3.md) |  | 
**carbon_sequestration** | [**PostAquaculture200ResponseIntermediateInnerCarbonSequestration**](PostAquaculture200ResponseIntermediateInnerCarbonSequestration.md) |  | 
**intensities** | [**PostProcessing200ResponseIntensitiesInner**](PostProcessing200ResponseIntensitiesInner.md) |  | 
**net** | [**PostAquaculture200ResponseNet**](PostAquaculture200ResponseNet.md) |  | 

## Example

```python
from openapi_client.models.post_processing200_response_intermediate_inner import PostProcessing200ResponseIntermediateInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostProcessing200ResponseIntermediateInner from a JSON string
post_processing200_response_intermediate_inner_instance = PostProcessing200ResponseIntermediateInner.from_json(json)
# print the JSON string representation of the object
print(PostProcessing200ResponseIntermediateInner.to_json())

# convert the object into a dict
post_processing200_response_intermediate_inner_dict = post_processing200_response_intermediate_inner_instance.to_dict()
# create an instance of PostProcessing200ResponseIntermediateInner from a dict
post_processing200_response_intermediate_inner_from_dict = PostProcessing200ResponseIntermediateInner.from_dict(post_processing200_response_intermediate_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


