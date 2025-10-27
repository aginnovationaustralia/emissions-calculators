# PostWildcatchfishery200ResponseIntermediateInner

Intermediate emissions calculation output for the `wildcatchfishery` calculator

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | Unique identifier for this activity | 
**scope1** | [**PostWildcatchfishery200ResponseScope1**](PostWildcatchfishery200ResponseScope1.md) |  | 
**scope2** | [**PostAquaculture200ResponseScope2**](PostAquaculture200ResponseScope2.md) |  | 
**scope3** | [**PostAquaculture200ResponseScope3**](PostAquaculture200ResponseScope3.md) |  | 
**intensities** | [**PostWildcatchfishery200ResponseIntensities**](PostWildcatchfishery200ResponseIntensities.md) |  | 
**net** | [**PostAquaculture200ResponseNet**](PostAquaculture200ResponseNet.md) |  | 
**carbon_sequestration** | [**PostAquaculture200ResponseIntermediateInnerCarbonSequestration**](PostAquaculture200ResponseIntermediateInnerCarbonSequestration.md) |  | 

## Example

```python
from openapi_client.models.post_wildcatchfishery200_response_intermediate_inner import PostWildcatchfishery200ResponseIntermediateInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostWildcatchfishery200ResponseIntermediateInner from a JSON string
post_wildcatchfishery200_response_intermediate_inner_instance = PostWildcatchfishery200ResponseIntermediateInner.from_json(json)
# print the JSON string representation of the object
print(PostWildcatchfishery200ResponseIntermediateInner.to_json())

# convert the object into a dict
post_wildcatchfishery200_response_intermediate_inner_dict = post_wildcatchfishery200_response_intermediate_inner_instance.to_dict()
# create an instance of PostWildcatchfishery200ResponseIntermediateInner from a dict
post_wildcatchfishery200_response_intermediate_inner_from_dict = PostWildcatchfishery200ResponseIntermediateInner.from_dict(post_wildcatchfishery200_response_intermediate_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


