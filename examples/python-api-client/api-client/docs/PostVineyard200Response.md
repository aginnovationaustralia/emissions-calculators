# PostVineyard200Response

Emissions calculation output for the `vineyard` calculator

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**scope1** | [**PostVineyard200ResponseScope1**](PostVineyard200ResponseScope1.md) |  | 
**scope2** | [**PostAquaculture200ResponseScope2**](PostAquaculture200ResponseScope2.md) |  | 
**scope3** | [**PostVineyard200ResponseScope3**](PostVineyard200ResponseScope3.md) |  | 
**carbon_sequestration** | [**PostAquaculture200ResponseCarbonSequestration**](PostAquaculture200ResponseCarbonSequestration.md) |  | 
**intermediate** | [**List[PostVineyard200ResponseIntermediateInner]**](PostVineyard200ResponseIntermediateInner.md) |  | 
**net** | [**PostVineyard200ResponseNet**](PostVineyard200ResponseNet.md) |  | 
**intensities** | [**List[PostVineyard200ResponseIntermediateInnerIntensities]**](PostVineyard200ResponseIntermediateInnerIntensities.md) | Emissions intensity for each vineyard (in order), in t-CO2e/t yield | 

## Example

```python
from openapi_client.models.post_vineyard200_response import PostVineyard200Response

# TODO update the JSON string below
json = "{}"
# create an instance of PostVineyard200Response from a JSON string
post_vineyard200_response_instance = PostVineyard200Response.from_json(json)
# print the JSON string representation of the object
print(PostVineyard200Response.to_json())

# convert the object into a dict
post_vineyard200_response_dict = post_vineyard200_response_instance.to_dict()
# create an instance of PostVineyard200Response from a dict
post_vineyard200_response_from_dict = PostVineyard200Response.from_dict(post_vineyard200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


