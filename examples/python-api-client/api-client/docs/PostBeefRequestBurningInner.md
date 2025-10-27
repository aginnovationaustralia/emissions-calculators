# PostBeefRequestBurningInner

Savannah burning along with allocations to beef

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**burning** | [**PostBeefRequestBurningInnerBurning**](PostBeefRequestBurningInnerBurning.md) |  | 
**allocation_to_beef** | **List[float]** | The proportion of the burning that is allocated to each beef | 

## Example

```python
from openapi_client.models.post_beef_request_burning_inner import PostBeefRequestBurningInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostBeefRequestBurningInner from a JSON string
post_beef_request_burning_inner_instance = PostBeefRequestBurningInner.from_json(json)
# print the JSON string representation of the object
print(PostBeefRequestBurningInner.to_json())

# convert the object into a dict
post_beef_request_burning_inner_dict = post_beef_request_burning_inner_instance.to_dict()
# create an instance of PostBeefRequestBurningInner from a dict
post_beef_request_burning_inner_from_dict = PostBeefRequestBurningInner.from_dict(post_beef_request_burning_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


