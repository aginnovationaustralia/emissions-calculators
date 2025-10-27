# PostAquaculture200Response

Emissions calculation output for the `aquaculture` calculator

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**scope1** | [**PostAquaculture200ResponseScope1**](PostAquaculture200ResponseScope1.md) |  | 
**scope2** | [**PostAquaculture200ResponseScope2**](PostAquaculture200ResponseScope2.md) |  | 
**scope3** | [**PostAquaculture200ResponseScope3**](PostAquaculture200ResponseScope3.md) |  | 
**purchased_offsets** | [**PostAquaculture200ResponsePurchasedOffsets**](PostAquaculture200ResponsePurchasedOffsets.md) |  | 
**net** | [**PostAquaculture200ResponseNet**](PostAquaculture200ResponseNet.md) |  | 
**intensities** | [**PostAquaculture200ResponseIntensities**](PostAquaculture200ResponseIntensities.md) |  | 
**carbon_sequestration** | [**PostAquaculture200ResponseCarbonSequestration**](PostAquaculture200ResponseCarbonSequestration.md) |  | 
**intermediate** | [**List[PostAquaculture200ResponseIntermediateInner]**](PostAquaculture200ResponseIntermediateInner.md) |  | 

## Example

```python
from openapi_client.models.post_aquaculture200_response import PostAquaculture200Response

# TODO update the JSON string below
json = "{}"
# create an instance of PostAquaculture200Response from a JSON string
post_aquaculture200_response_instance = PostAquaculture200Response.from_json(json)
# print the JSON string representation of the object
print(PostAquaculture200Response.to_json())

# convert the object into a dict
post_aquaculture200_response_dict = post_aquaculture200_response_instance.to_dict()
# create an instance of PostAquaculture200Response from a dict
post_aquaculture200_response_from_dict = PostAquaculture200Response.from_dict(post_aquaculture200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


