# PostDairy200ResponseIntermediateInner

Intermediate emissions calculation output for the Dairy calculator

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | Unique identifier for this activity | 
**scope1** | [**PostDairy200ResponseScope1**](PostDairy200ResponseScope1.md) |  | 
**scope2** | [**PostAquaculture200ResponseScope2**](PostAquaculture200ResponseScope2.md) |  | 
**scope3** | [**PostDairy200ResponseScope3**](PostDairy200ResponseScope3.md) |  | 
**net** | [**PostDairy200ResponseNet**](PostDairy200ResponseNet.md) |  | 
**intensities** | [**PostDairy200ResponseIntensities**](PostDairy200ResponseIntensities.md) |  | 
**carbon_sequestration** | [**PostAquaculture200ResponseIntermediateInnerCarbonSequestration**](PostAquaculture200ResponseIntermediateInnerCarbonSequestration.md) |  | 

## Example

```python
from openapi_client.models.post_dairy200_response_intermediate_inner import PostDairy200ResponseIntermediateInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostDairy200ResponseIntermediateInner from a JSON string
post_dairy200_response_intermediate_inner_instance = PostDairy200ResponseIntermediateInner.from_json(json)
# print the JSON string representation of the object
print(PostDairy200ResponseIntermediateInner.to_json())

# convert the object into a dict
post_dairy200_response_intermediate_inner_dict = post_dairy200_response_intermediate_inner_instance.to_dict()
# create an instance of PostDairy200ResponseIntermediateInner from a dict
post_dairy200_response_intermediate_inner_from_dict = PostDairy200ResponseIntermediateInner.from_dict(post_dairy200_response_intermediate_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


