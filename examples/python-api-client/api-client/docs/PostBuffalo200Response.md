# PostBuffalo200Response

Emissions calculation output for the `Buffalo` calculator

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**scope1** | [**PostBuffalo200ResponseScope1**](PostBuffalo200ResponseScope1.md) |  | 
**scope2** | [**PostAquaculture200ResponseScope2**](PostAquaculture200ResponseScope2.md) |  | 
**scope3** | [**PostBuffalo200ResponseScope3**](PostBuffalo200ResponseScope3.md) |  | 
**carbon_sequestration** | [**PostAquaculture200ResponseCarbonSequestration**](PostAquaculture200ResponseCarbonSequestration.md) |  | 
**net** | [**PostBuffalo200ResponseNet**](PostBuffalo200ResponseNet.md) |  | 
**intensities** | [**PostBuffalo200ResponseIntensities**](PostBuffalo200ResponseIntensities.md) |  | 
**intermediate** | [**List[PostBuffalo200ResponseIntermediateInner]**](PostBuffalo200ResponseIntermediateInner.md) |  | 

## Example

```python
from openapi_client.models.post_buffalo200_response import PostBuffalo200Response

# TODO update the JSON string below
json = "{}"
# create an instance of PostBuffalo200Response from a JSON string
post_buffalo200_response_instance = PostBuffalo200Response.from_json(json)
# print the JSON string representation of the object
print(PostBuffalo200Response.to_json())

# convert the object into a dict
post_buffalo200_response_dict = post_buffalo200_response_instance.to_dict()
# create an instance of PostBuffalo200Response from a dict
post_buffalo200_response_from_dict = PostBuffalo200Response.from_dict(post_buffalo200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


