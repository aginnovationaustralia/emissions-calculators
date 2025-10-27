# PostGoat200Response

Emissions calculation output for the `goat` calculator

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**scope1** | [**PostBuffalo200ResponseScope1**](PostBuffalo200ResponseScope1.md) |  | 
**scope2** | [**PostAquaculture200ResponseScope2**](PostAquaculture200ResponseScope2.md) |  | 
**scope3** | [**PostBeef200ResponseScope3**](PostBeef200ResponseScope3.md) |  | 
**carbon_sequestration** | [**PostAquaculture200ResponseCarbonSequestration**](PostAquaculture200ResponseCarbonSequestration.md) |  | 
**net** | [**PostGoat200ResponseNet**](PostGoat200ResponseNet.md) |  | 
**intensities** | [**PostGoat200ResponseIntensities**](PostGoat200ResponseIntensities.md) |  | 
**intermediate** | [**List[PostGoat200ResponseIntermediateInner]**](PostGoat200ResponseIntermediateInner.md) |  | 

## Example

```python
from openapi_client.models.post_goat200_response import PostGoat200Response

# TODO update the JSON string below
json = "{}"
# create an instance of PostGoat200Response from a JSON string
post_goat200_response_instance = PostGoat200Response.from_json(json)
# print the JSON string representation of the object
print(PostGoat200Response.to_json())

# convert the object into a dict
post_goat200_response_dict = post_goat200_response_instance.to_dict()
# create an instance of PostGoat200Response from a dict
post_goat200_response_from_dict = PostGoat200Response.from_dict(post_goat200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


