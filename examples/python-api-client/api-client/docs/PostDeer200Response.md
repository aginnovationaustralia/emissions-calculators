# PostDeer200Response

Emissions calculation output for the `deer` calculator

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**scope1** | [**PostBuffalo200ResponseScope1**](PostBuffalo200ResponseScope1.md) |  | 
**scope2** | [**PostAquaculture200ResponseScope2**](PostAquaculture200ResponseScope2.md) |  | 
**scope3** | [**PostBuffalo200ResponseScope3**](PostBuffalo200ResponseScope3.md) |  | 
**carbon_sequestration** | [**PostAquaculture200ResponseCarbonSequestration**](PostAquaculture200ResponseCarbonSequestration.md) |  | 
**net** | [**PostDeer200ResponseNet**](PostDeer200ResponseNet.md) |  | 
**intensities** | [**PostDeer200ResponseIntensities**](PostDeer200ResponseIntensities.md) |  | 
**intermediate** | [**List[PostDeer200ResponseIntermediateInner]**](PostDeer200ResponseIntermediateInner.md) |  | 

## Example

```python
from openapi_client.models.post_deer200_response import PostDeer200Response

# TODO update the JSON string below
json = "{}"
# create an instance of PostDeer200Response from a JSON string
post_deer200_response_instance = PostDeer200Response.from_json(json)
# print the JSON string representation of the object
print(PostDeer200Response.to_json())

# convert the object into a dict
post_deer200_response_dict = post_deer200_response_instance.to_dict()
# create an instance of PostDeer200Response from a dict
post_deer200_response_from_dict = PostDeer200Response.from_dict(post_deer200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


