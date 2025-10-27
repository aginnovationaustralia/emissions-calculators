# PostProcessing200Response

Emissions calculation output for the `processing` calculator

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**scope1** | [**PostProcessing200ResponseScope1**](PostProcessing200ResponseScope1.md) |  | 
**scope2** | [**PostAquaculture200ResponseScope2**](PostAquaculture200ResponseScope2.md) |  | 
**scope3** | [**PostProcessing200ResponseScope3**](PostProcessing200ResponseScope3.md) |  | 
**purchased_offsets** | [**PostAquaculture200ResponsePurchasedOffsets**](PostAquaculture200ResponsePurchasedOffsets.md) |  | 
**net** | [**PostProcessing200ResponseNet**](PostProcessing200ResponseNet.md) |  | 
**intensities** | [**List[PostProcessing200ResponseIntensitiesInner]**](PostProcessing200ResponseIntensitiesInner.md) |  | 
**carbon_sequestration** | [**PostAquaculture200ResponseCarbonSequestration**](PostAquaculture200ResponseCarbonSequestration.md) |  | 
**intermediate** | [**List[PostProcessing200ResponseIntermediateInner]**](PostProcessing200ResponseIntermediateInner.md) |  | 

## Example

```python
from openapi_client.models.post_processing200_response import PostProcessing200Response

# TODO update the JSON string below
json = "{}"
# create an instance of PostProcessing200Response from a JSON string
post_processing200_response_instance = PostProcessing200Response.from_json(json)
# print the JSON string representation of the object
print(PostProcessing200Response.to_json())

# convert the object into a dict
post_processing200_response_dict = post_processing200_response_instance.to_dict()
# create an instance of PostProcessing200Response from a dict
post_processing200_response_from_dict = PostProcessing200Response.from_dict(post_processing200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


