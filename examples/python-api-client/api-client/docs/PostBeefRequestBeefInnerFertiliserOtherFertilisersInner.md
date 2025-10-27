# PostBeefRequestBeefInnerFertiliserOtherFertilisersInner

Other fertiliser, of a specific type, used for different applications (such as dryland pasture)

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**other_type** | **str** | Other N fertiliser type | 
**other_dryland** | **float** | Other N fertiliser used for dryland. From v1.1.0, supply tonnes of product. For earlier versions, supply tonnes of N | 
**other_irrigated** | **float** | Other N fertiliser used for irrigated. From v1.1.0, supply tonnes of product. For earlier versions, supply tonnes of N | 

## Example

```python
from openapi_client.models.post_beef_request_beef_inner_fertiliser_other_fertilisers_inner import PostBeefRequestBeefInnerFertiliserOtherFertilisersInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostBeefRequestBeefInnerFertiliserOtherFertilisersInner from a JSON string
post_beef_request_beef_inner_fertiliser_other_fertilisers_inner_instance = PostBeefRequestBeefInnerFertiliserOtherFertilisersInner.from_json(json)
# print the JSON string representation of the object
print(PostBeefRequestBeefInnerFertiliserOtherFertilisersInner.to_json())

# convert the object into a dict
post_beef_request_beef_inner_fertiliser_other_fertilisers_inner_dict = post_beef_request_beef_inner_fertiliser_other_fertilisers_inner_instance.to_dict()
# create an instance of PostBeefRequestBeefInnerFertiliserOtherFertilisersInner from a dict
post_beef_request_beef_inner_fertiliser_other_fertilisers_inner_from_dict = PostBeefRequestBeefInnerFertiliserOtherFertilisersInner.from_dict(post_beef_request_beef_inner_fertiliser_other_fertilisers_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


