# PostDairyRequestDairyInnerClasses

Dairy classes of different types and age ranges

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**milking_cows** | [**PostDairyRequestDairyInnerClassesMilkingCows**](PostDairyRequestDairyInnerClassesMilkingCows.md) |  | 
**heifers_lt1** | [**PostDairyRequestDairyInnerClassesHeifersLt1**](PostDairyRequestDairyInnerClassesHeifersLt1.md) |  | 
**heifers_gt1** | [**PostDairyRequestDairyInnerClassesHeifersGt1**](PostDairyRequestDairyInnerClassesHeifersGt1.md) |  | 
**dairy_bulls_lt1** | [**PostDairyRequestDairyInnerClassesDairyBullsLt1**](PostDairyRequestDairyInnerClassesDairyBullsLt1.md) |  | 
**dairy_bulls_gt1** | [**PostDairyRequestDairyInnerClassesDairyBullsGt1**](PostDairyRequestDairyInnerClassesDairyBullsGt1.md) |  | 

## Example

```python
from openapi_client.models.post_dairy_request_dairy_inner_classes import PostDairyRequestDairyInnerClasses

# TODO update the JSON string below
json = "{}"
# create an instance of PostDairyRequestDairyInnerClasses from a JSON string
post_dairy_request_dairy_inner_classes_instance = PostDairyRequestDairyInnerClasses.from_json(json)
# print the JSON string representation of the object
print(PostDairyRequestDairyInnerClasses.to_json())

# convert the object into a dict
post_dairy_request_dairy_inner_classes_dict = post_dairy_request_dairy_inner_classes_instance.to_dict()
# create an instance of PostDairyRequestDairyInnerClasses from a dict
post_dairy_request_dairy_inner_classes_from_dict = PostDairyRequestDairyInnerClasses.from_dict(post_dairy_request_dairy_inner_classes_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


