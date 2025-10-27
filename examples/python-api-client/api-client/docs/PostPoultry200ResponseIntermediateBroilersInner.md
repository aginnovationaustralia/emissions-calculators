# PostPoultry200ResponseIntermediateBroilersInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** |  | 
**scope1** | [**PostPoultry200ResponseScope1**](PostPoultry200ResponseScope1.md) |  | 
**scope2** | [**PostAquaculture200ResponseScope2**](PostAquaculture200ResponseScope2.md) |  | 
**scope3** | [**PostPoultry200ResponseScope3**](PostPoultry200ResponseScope3.md) |  | 
**carbon_sequestration** | [**PostAquaculture200ResponseIntermediateInnerCarbonSequestration**](PostAquaculture200ResponseIntermediateInnerCarbonSequestration.md) |  | 
**intensities** | [**PostPoultry200ResponseIntermediateBroilersInnerIntensities**](PostPoultry200ResponseIntermediateBroilersInnerIntensities.md) |  | 
**net** | [**PostAquaculture200ResponseNet**](PostAquaculture200ResponseNet.md) |  | 

## Example

```python
from openapi_client.models.post_poultry200_response_intermediate_broilers_inner import PostPoultry200ResponseIntermediateBroilersInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostPoultry200ResponseIntermediateBroilersInner from a JSON string
post_poultry200_response_intermediate_broilers_inner_instance = PostPoultry200ResponseIntermediateBroilersInner.from_json(json)
# print the JSON string representation of the object
print(PostPoultry200ResponseIntermediateBroilersInner.to_json())

# convert the object into a dict
post_poultry200_response_intermediate_broilers_inner_dict = post_poultry200_response_intermediate_broilers_inner_instance.to_dict()
# create an instance of PostPoultry200ResponseIntermediateBroilersInner from a dict
post_poultry200_response_intermediate_broilers_inner_from_dict = PostPoultry200ResponseIntermediateBroilersInner.from_dict(post_poultry200_response_intermediate_broilers_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


