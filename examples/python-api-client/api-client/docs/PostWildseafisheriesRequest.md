# PostWildseafisheriesRequest

Input data required for the `wildseafisheries` calculator

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**enterprises** | [**List[PostWildseafisheriesRequestEnterprisesInner]**](PostWildseafisheriesRequestEnterprisesInner.md) |  | 

## Example

```python
from openapi_client.models.post_wildseafisheries_request import PostWildseafisheriesRequest

# TODO update the JSON string below
json = "{}"
# create an instance of PostWildseafisheriesRequest from a JSON string
post_wildseafisheries_request_instance = PostWildseafisheriesRequest.from_json(json)
# print the JSON string representation of the object
print(PostWildseafisheriesRequest.to_json())

# convert the object into a dict
post_wildseafisheries_request_dict = post_wildseafisheries_request_instance.to_dict()
# create an instance of PostWildseafisheriesRequest from a dict
post_wildseafisheries_request_from_dict = PostWildseafisheriesRequest.from_dict(post_wildseafisheries_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


