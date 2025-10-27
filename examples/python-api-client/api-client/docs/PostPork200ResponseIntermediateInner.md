# PostPork200ResponseIntermediateInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** |  | 
**scope1** | [**PostPork200ResponseScope1**](PostPork200ResponseScope1.md) |  | 
**scope2** | [**PostAquaculture200ResponseScope2**](PostAquaculture200ResponseScope2.md) |  | 
**scope3** | [**PostPork200ResponseScope3**](PostPork200ResponseScope3.md) |  | 
**carbon_sequestration** | **float** | Carbon sequestration, in tonnes-CO2e | 
**net** | [**PostPork200ResponseNet**](PostPork200ResponseNet.md) |  | 
**intensities** | [**PostPork200ResponseIntensities**](PostPork200ResponseIntensities.md) |  | 

## Example

```python
from openapi_client.models.post_pork200_response_intermediate_inner import PostPork200ResponseIntermediateInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostPork200ResponseIntermediateInner from a JSON string
post_pork200_response_intermediate_inner_instance = PostPork200ResponseIntermediateInner.from_json(json)
# print the JSON string representation of the object
print(PostPork200ResponseIntermediateInner.to_json())

# convert the object into a dict
post_pork200_response_intermediate_inner_dict = post_pork200_response_intermediate_inner_instance.to_dict()
# create an instance of PostPork200ResponseIntermediateInner from a dict
post_pork200_response_intermediate_inner_from_dict = PostPork200ResponseIntermediateInner.from_dict(post_pork200_response_intermediate_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


