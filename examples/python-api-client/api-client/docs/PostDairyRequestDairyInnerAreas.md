# PostDairyRequestDairyInnerAreas

Areas in hectares (ha)

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**cropped_dryland** | **float** |  | [default to 0]
**cropped_irrigated** | **float** |  | [default to 0]
**improved_pasture_dryland** | **float** |  | [default to 0]
**improved_pasture_irrigated** | **float** |  | [default to 0]

## Example

```python
from openapi_client.models.post_dairy_request_dairy_inner_areas import PostDairyRequestDairyInnerAreas

# TODO update the JSON string below
json = "{}"
# create an instance of PostDairyRequestDairyInnerAreas from a JSON string
post_dairy_request_dairy_inner_areas_instance = PostDairyRequestDairyInnerAreas.from_json(json)
# print the JSON string representation of the object
print(PostDairyRequestDairyInnerAreas.to_json())

# convert the object into a dict
post_dairy_request_dairy_inner_areas_dict = post_dairy_request_dairy_inner_areas_instance.to_dict()
# create an instance of PostDairyRequestDairyInnerAreas from a dict
post_dairy_request_dairy_inner_areas_from_dict = PostDairyRequestDairyInnerAreas.from_dict(post_dairy_request_dairy_inner_areas_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


