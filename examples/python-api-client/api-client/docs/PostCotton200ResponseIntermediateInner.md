# PostCotton200ResponseIntermediateInner

Intermediate emissions calculation output for the Cotton calculator

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | Unique identifier for this activity | 
**scope1** | [**PostCotton200ResponseScope1**](PostCotton200ResponseScope1.md) |  | 
**scope2** | [**PostAquaculture200ResponseScope2**](PostAquaculture200ResponseScope2.md) |  | 
**scope3** | [**PostCotton200ResponseScope3**](PostCotton200ResponseScope3.md) |  | 
**intensities** | [**PostCotton200ResponseIntermediateInnerIntensities**](PostCotton200ResponseIntermediateInnerIntensities.md) |  | 
**net** | [**PostAquaculture200ResponseNet**](PostAquaculture200ResponseNet.md) |  | 
**carbon_sequestration** | [**PostAquaculture200ResponseIntermediateInnerCarbonSequestration**](PostAquaculture200ResponseIntermediateInnerCarbonSequestration.md) |  | 

## Example

```python
from openapi_client.models.post_cotton200_response_intermediate_inner import PostCotton200ResponseIntermediateInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostCotton200ResponseIntermediateInner from a JSON string
post_cotton200_response_intermediate_inner_instance = PostCotton200ResponseIntermediateInner.from_json(json)
# print the JSON string representation of the object
print(PostCotton200ResponseIntermediateInner.to_json())

# convert the object into a dict
post_cotton200_response_intermediate_inner_dict = post_cotton200_response_intermediate_inner_instance.to_dict()
# create an instance of PostCotton200ResponseIntermediateInner from a dict
post_cotton200_response_intermediate_inner_from_dict = PostCotton200ResponseIntermediateInner.from_dict(post_cotton200_response_intermediate_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


