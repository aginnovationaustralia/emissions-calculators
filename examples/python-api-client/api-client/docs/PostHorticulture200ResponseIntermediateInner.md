# PostHorticulture200ResponseIntermediateInner

Intermediate emissions calculation output for the Horticulture calculator

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | Unique identifier for this activity | 
**scope1** | [**PostHorticulture200ResponseScope1**](PostHorticulture200ResponseScope1.md) |  | 
**scope2** | [**PostAquaculture200ResponseScope2**](PostAquaculture200ResponseScope2.md) |  | 
**scope3** | [**PostCotton200ResponseScope3**](PostCotton200ResponseScope3.md) |  | 
**intensities_with_sequestration** | [**PostHorticulture200ResponseIntermediateInnerIntensitiesWithSequestration**](PostHorticulture200ResponseIntermediateInnerIntensitiesWithSequestration.md) |  | 
**net** | [**PostAquaculture200ResponseNet**](PostAquaculture200ResponseNet.md) |  | 
**carbon_sequestration** | [**PostAquaculture200ResponseIntermediateInnerCarbonSequestration**](PostAquaculture200ResponseIntermediateInnerCarbonSequestration.md) |  | 

## Example

```python
from openapi_client.models.post_horticulture200_response_intermediate_inner import PostHorticulture200ResponseIntermediateInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostHorticulture200ResponseIntermediateInner from a JSON string
post_horticulture200_response_intermediate_inner_instance = PostHorticulture200ResponseIntermediateInner.from_json(json)
# print the JSON string representation of the object
print(PostHorticulture200ResponseIntermediateInner.to_json())

# convert the object into a dict
post_horticulture200_response_intermediate_inner_dict = post_horticulture200_response_intermediate_inner_instance.to_dict()
# create an instance of PostHorticulture200ResponseIntermediateInner from a dict
post_horticulture200_response_intermediate_inner_from_dict = PostHorticulture200ResponseIntermediateInner.from_dict(post_horticulture200_response_intermediate_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


