# PostPoultry200Response

Emissions calculation output for the `poultry` calculator

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**scope1** | [**PostPoultry200ResponseScope1**](PostPoultry200ResponseScope1.md) |  | 
**scope2** | [**PostAquaculture200ResponseScope2**](PostAquaculture200ResponseScope2.md) |  | 
**scope3** | [**PostPoultry200ResponseScope3**](PostPoultry200ResponseScope3.md) |  | 
**carbon_sequestration** | [**PostAquaculture200ResponseCarbonSequestration**](PostAquaculture200ResponseCarbonSequestration.md) |  | 
**intermediate_broilers** | [**List[PostPoultry200ResponseIntermediateBroilersInner]**](PostPoultry200ResponseIntermediateBroilersInner.md) |  | 
**intermediate_layers** | [**List[PostPoultry200ResponseIntermediateLayersInner]**](PostPoultry200ResponseIntermediateLayersInner.md) |  | 
**net** | [**PostPoultry200ResponseNet**](PostPoultry200ResponseNet.md) |  | 
**intensities** | [**PostPoultry200ResponseIntensities**](PostPoultry200ResponseIntensities.md) |  | 

## Example

```python
from openapi_client.models.post_poultry200_response import PostPoultry200Response

# TODO update the JSON string below
json = "{}"
# create an instance of PostPoultry200Response from a JSON string
post_poultry200_response_instance = PostPoultry200Response.from_json(json)
# print the JSON string representation of the object
print(PostPoultry200Response.to_json())

# convert the object into a dict
post_poultry200_response_dict = post_poultry200_response_instance.to_dict()
# create an instance of PostPoultry200Response from a dict
post_poultry200_response_from_dict = PostPoultry200Response.from_dict(post_poultry200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


