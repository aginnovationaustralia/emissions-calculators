# PostBeefRequestVegetationInnerVegetation

Inputs required for non-productive vegetation in order to calculate carbon sequestration

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**region** | **str** | The rainfall region that the vegetation is in | 
**tree_species** | **str** | The species of tree | 
**soil** | **str** | The soil type the tree is in | 
**area** | **float** | The area of trees, in ha (hectares) | 
**age** | **float** | The age of the trees, in years | 

## Example

```python
from openapi_client.models.post_beef_request_vegetation_inner_vegetation import PostBeefRequestVegetationInnerVegetation

# TODO update the JSON string below
json = "{}"
# create an instance of PostBeefRequestVegetationInnerVegetation from a JSON string
post_beef_request_vegetation_inner_vegetation_instance = PostBeefRequestVegetationInnerVegetation.from_json(json)
# print the JSON string representation of the object
print(PostBeefRequestVegetationInnerVegetation.to_json())

# convert the object into a dict
post_beef_request_vegetation_inner_vegetation_dict = post_beef_request_vegetation_inner_vegetation_instance.to_dict()
# create an instance of PostBeefRequestVegetationInnerVegetation from a dict
post_beef_request_vegetation_inner_vegetation_from_dict = PostBeefRequestVegetationInnerVegetation.from_dict(post_beef_request_vegetation_inner_vegetation_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


