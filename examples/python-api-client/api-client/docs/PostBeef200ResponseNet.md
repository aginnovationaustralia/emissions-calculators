# PostBeef200ResponseNet


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**total** | **float** | Total net emissions of this activity, in tonnes-CO2e/year | 
**beef** | **float** | Net emissions of beef, in tonnes-CO2e/year | 

## Example

```python
from openapi_client.models.post_beef200_response_net import PostBeef200ResponseNet

# TODO update the JSON string below
json = "{}"
# create an instance of PostBeef200ResponseNet from a JSON string
post_beef200_response_net_instance = PostBeef200ResponseNet.from_json(json)
# print the JSON string representation of the object
print(PostBeef200ResponseNet.to_json())

# convert the object into a dict
post_beef200_response_net_dict = post_beef200_response_net_instance.to_dict()
# create an instance of PostBeef200ResponseNet from a dict
post_beef200_response_net_from_dict = PostBeef200ResponseNet.from_dict(post_beef200_response_net_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


