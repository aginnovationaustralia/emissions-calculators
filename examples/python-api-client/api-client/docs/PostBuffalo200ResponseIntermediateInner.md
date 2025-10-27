# PostBuffalo200ResponseIntermediateInner

Intermediate emissions calculation output for the Buffalo calculator

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | Unique identifier for this activity | 
**scope1** | [**PostBuffalo200ResponseScope1**](PostBuffalo200ResponseScope1.md) |  | 
**scope2** | [**PostAquaculture200ResponseScope2**](PostAquaculture200ResponseScope2.md) |  | 
**scope3** | [**PostBuffalo200ResponseScope3**](PostBuffalo200ResponseScope3.md) |  | 
**net** | [**PostBuffalo200ResponseNet**](PostBuffalo200ResponseNet.md) |  | 
**intensities** | [**PostBuffalo200ResponseIntensities**](PostBuffalo200ResponseIntensities.md) |  | 
**carbon_sequestration** | [**PostAquaculture200ResponseIntermediateInnerCarbonSequestration**](PostAquaculture200ResponseIntermediateInnerCarbonSequestration.md) |  | 

## Example

```python
from openapi_client.models.post_buffalo200_response_intermediate_inner import PostBuffalo200ResponseIntermediateInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostBuffalo200ResponseIntermediateInner from a JSON string
post_buffalo200_response_intermediate_inner_instance = PostBuffalo200ResponseIntermediateInner.from_json(json)
# print the JSON string representation of the object
print(PostBuffalo200ResponseIntermediateInner.to_json())

# convert the object into a dict
post_buffalo200_response_intermediate_inner_dict = post_buffalo200_response_intermediate_inner_instance.to_dict()
# create an instance of PostBuffalo200ResponseIntermediateInner from a dict
post_buffalo200_response_intermediate_inner_from_dict = PostBuffalo200ResponseIntermediateInner.from_dict(post_buffalo200_response_intermediate_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


