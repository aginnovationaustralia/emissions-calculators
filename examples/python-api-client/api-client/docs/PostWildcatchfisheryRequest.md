# PostWildcatchfisheryRequest

Input data required for the `wildcatchfishery` calculator

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**enterprises** | [**List[PostWildcatchfisheryRequestEnterprisesInner]**](PostWildcatchfisheryRequestEnterprisesInner.md) |  | 

## Example

```python
from openapi_client.models.post_wildcatchfishery_request import PostWildcatchfisheryRequest

# TODO update the JSON string below
json = "{}"
# create an instance of PostWildcatchfisheryRequest from a JSON string
post_wildcatchfishery_request_instance = PostWildcatchfisheryRequest.from_json(json)
# print the JSON string representation of the object
print(PostWildcatchfisheryRequest.to_json())

# convert the object into a dict
post_wildcatchfishery_request_dict = post_wildcatchfishery_request_instance.to_dict()
# create an instance of PostWildcatchfisheryRequest from a dict
post_wildcatchfishery_request_from_dict = PostWildcatchfisheryRequest.from_dict(post_wildcatchfishery_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


