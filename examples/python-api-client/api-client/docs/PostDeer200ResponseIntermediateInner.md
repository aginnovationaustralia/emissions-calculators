# PostDeer200ResponseIntermediateInner

Intermediate emissions calculation output for the Deer calculator

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | Unique identifier for this activity | 
**scope1** | [**PostBuffalo200ResponseScope1**](PostBuffalo200ResponseScope1.md) |  | 
**scope2** | [**PostAquaculture200ResponseScope2**](PostAquaculture200ResponseScope2.md) |  | 
**scope3** | [**PostBuffalo200ResponseScope3**](PostBuffalo200ResponseScope3.md) |  | 
**net** | [**PostDeer200ResponseNet**](PostDeer200ResponseNet.md) |  | 
**intensities** | [**PostDeer200ResponseIntensities**](PostDeer200ResponseIntensities.md) |  | 
**carbon_sequestration** | [**PostAquaculture200ResponseIntermediateInnerCarbonSequestration**](PostAquaculture200ResponseIntermediateInnerCarbonSequestration.md) |  | 

## Example

```python
from openapi_client.models.post_deer200_response_intermediate_inner import PostDeer200ResponseIntermediateInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostDeer200ResponseIntermediateInner from a JSON string
post_deer200_response_intermediate_inner_instance = PostDeer200ResponseIntermediateInner.from_json(json)
# print the JSON string representation of the object
print(PostDeer200ResponseIntermediateInner.to_json())

# convert the object into a dict
post_deer200_response_intermediate_inner_dict = post_deer200_response_intermediate_inner_instance.to_dict()
# create an instance of PostDeer200ResponseIntermediateInner from a dict
post_deer200_response_intermediate_inner_from_dict = PostDeer200ResponseIntermediateInner.from_dict(post_deer200_response_intermediate_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


