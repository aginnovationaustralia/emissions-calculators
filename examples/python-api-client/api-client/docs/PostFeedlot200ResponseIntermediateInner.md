# PostFeedlot200ResponseIntermediateInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | Unique identifier for this activity | 
**scope1** | [**PostFeedlot200ResponseScope1**](PostFeedlot200ResponseScope1.md) |  | 
**scope2** | [**PostAquaculture200ResponseScope2**](PostAquaculture200ResponseScope2.md) |  | 
**scope3** | [**PostFeedlot200ResponseScope3**](PostFeedlot200ResponseScope3.md) |  | 
**carbon_sequestration** | [**PostAquaculture200ResponseIntermediateInnerCarbonSequestration**](PostAquaculture200ResponseIntermediateInnerCarbonSequestration.md) |  | 
**net** | [**PostFeedlot200ResponseIntermediateInnerNet**](PostFeedlot200ResponseIntermediateInnerNet.md) |  | 
**intensities** | [**PostFeedlot200ResponseIntermediateInnerIntensities**](PostFeedlot200ResponseIntermediateInnerIntensities.md) |  | 

## Example

```python
from openapi_client.models.post_feedlot200_response_intermediate_inner import PostFeedlot200ResponseIntermediateInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostFeedlot200ResponseIntermediateInner from a JSON string
post_feedlot200_response_intermediate_inner_instance = PostFeedlot200ResponseIntermediateInner.from_json(json)
# print the JSON string representation of the object
print(PostFeedlot200ResponseIntermediateInner.to_json())

# convert the object into a dict
post_feedlot200_response_intermediate_inner_dict = post_feedlot200_response_intermediate_inner_instance.to_dict()
# create an instance of PostFeedlot200ResponseIntermediateInner from a dict
post_feedlot200_response_intermediate_inner_from_dict = PostFeedlot200ResponseIntermediateInner.from_dict(post_feedlot200_response_intermediate_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


