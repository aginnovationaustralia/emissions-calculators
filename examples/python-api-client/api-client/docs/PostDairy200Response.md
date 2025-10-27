# PostDairy200Response

Emissions calculation output for the `dairy` calculator

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**scope1** | [**PostDairy200ResponseScope1**](PostDairy200ResponseScope1.md) |  | 
**scope2** | [**PostAquaculture200ResponseScope2**](PostAquaculture200ResponseScope2.md) |  | 
**scope3** | [**PostDairy200ResponseScope3**](PostDairy200ResponseScope3.md) |  | 
**carbon_sequestration** | [**PostAquaculture200ResponseCarbonSequestration**](PostAquaculture200ResponseCarbonSequestration.md) |  | 
**net** | [**PostDairy200ResponseNet**](PostDairy200ResponseNet.md) |  | 
**intensities** | [**PostDairy200ResponseIntensities**](PostDairy200ResponseIntensities.md) |  | 
**intermediate** | [**List[PostDairy200ResponseIntermediateInner]**](PostDairy200ResponseIntermediateInner.md) |  | 

## Example

```python
from openapi_client.models.post_dairy200_response import PostDairy200Response

# TODO update the JSON string below
json = "{}"
# create an instance of PostDairy200Response from a JSON string
post_dairy200_response_instance = PostDairy200Response.from_json(json)
# print the JSON string representation of the object
print(PostDairy200Response.to_json())

# convert the object into a dict
post_dairy200_response_dict = post_dairy200_response_instance.to_dict()
# create an instance of PostDairy200Response from a dict
post_dairy200_response_from_dict = PostDairy200Response.from_dict(post_dairy200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


