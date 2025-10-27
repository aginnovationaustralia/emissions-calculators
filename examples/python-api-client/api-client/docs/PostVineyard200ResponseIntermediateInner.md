# PostVineyard200ResponseIntermediateInner

Intermediate emissions calculation output for the Vineyard calculator

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | Unique identifier for this activity | 
**scope1** | [**PostVineyard200ResponseScope1**](PostVineyard200ResponseScope1.md) |  | 
**scope2** | [**PostAquaculture200ResponseScope2**](PostAquaculture200ResponseScope2.md) |  | 
**scope3** | [**PostVineyard200ResponseScope3**](PostVineyard200ResponseScope3.md) |  | 
**carbon_sequestration** | **float** | Carbon sequestration, in tonnes-CO2e | 
**intensities** | [**PostVineyard200ResponseIntermediateInnerIntensities**](PostVineyard200ResponseIntermediateInnerIntensities.md) |  | 
**net** | [**PostAquaculture200ResponseNet**](PostAquaculture200ResponseNet.md) |  | 

## Example

```python
from openapi_client.models.post_vineyard200_response_intermediate_inner import PostVineyard200ResponseIntermediateInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostVineyard200ResponseIntermediateInner from a JSON string
post_vineyard200_response_intermediate_inner_instance = PostVineyard200ResponseIntermediateInner.from_json(json)
# print the JSON string representation of the object
print(PostVineyard200ResponseIntermediateInner.to_json())

# convert the object into a dict
post_vineyard200_response_intermediate_inner_dict = post_vineyard200_response_intermediate_inner_instance.to_dict()
# create an instance of PostVineyard200ResponseIntermediateInner from a dict
post_vineyard200_response_intermediate_inner_from_dict = PostVineyard200ResponseIntermediateInner.from_dict(post_vineyard200_response_intermediate_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


