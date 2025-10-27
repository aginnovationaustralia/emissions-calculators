# PostPoultry200ResponseNet


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**total** | **float** | Total net emissions of this activity, in tonnes-CO2e/year | 
**broilers** | **float** | Net emissions of broilers, in tonnes-CO2e/year | 
**layers** | **float** | Net emissions of layers, in tonnes-CO2e/year | 

## Example

```python
from openapi_client.models.post_poultry200_response_net import PostPoultry200ResponseNet

# TODO update the JSON string below
json = "{}"
# create an instance of PostPoultry200ResponseNet from a JSON string
post_poultry200_response_net_instance = PostPoultry200ResponseNet.from_json(json)
# print the JSON string representation of the object
print(PostPoultry200ResponseNet.to_json())

# convert the object into a dict
post_poultry200_response_net_dict = post_poultry200_response_net_instance.to_dict()
# create an instance of PostPoultry200ResponseNet from a dict
post_poultry200_response_net_from_dict = PostPoultry200ResponseNet.from_dict(post_poultry200_response_net_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


