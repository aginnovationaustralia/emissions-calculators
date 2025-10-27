# PostAquacultureRequest

Input data required for the `aquaculture` calculator

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**enterprises** | [**List[PostAquacultureRequestEnterprisesInner]**](PostAquacultureRequestEnterprisesInner.md) |  | 

## Example

```python
from openapi_client.models.post_aquaculture_request import PostAquacultureRequest

# TODO update the JSON string below
json = "{}"
# create an instance of PostAquacultureRequest from a JSON string
post_aquaculture_request_instance = PostAquacultureRequest.from_json(json)
# print the JSON string representation of the object
print(PostAquacultureRequest.to_json())

# convert the object into a dict
post_aquaculture_request_dict = post_aquaculture_request_instance.to_dict()
# create an instance of PostAquacultureRequest from a dict
post_aquaculture_request_from_dict = PostAquacultureRequest.from_dict(post_aquaculture_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


