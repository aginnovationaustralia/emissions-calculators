# PostDairyRequestDairyInnerClassesMilkingCowsAutumn


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**head** | **float** | Number of animals (head) | 
**liveweight** | **float** | Average liveweight of animals in kg/head (kilogram per head) | 
**liveweight_gain** | **float** | Average liveweight gain in kg/day (kilogram per day) | 
**crude_protein** | **float** | Crude protein percent, between 0 and 100. Note: If no value is provided, zero will be assumed. This will result in large, negative output values. This input will become mandatory in a future version. | [optional] 
**dry_matter_digestibility** | **float** | Dry matter digestibility percent, between 0 and 100. Note: If no value is provided, zero will be assumed. This will result in large, negative output values. This input will become mandatory in a future version. | [optional] 
**milk_production** | **float** | Milk produced in L/day/head (litres per day per head) | [optional] 

## Example

```python
from openapi_client.models.post_dairy_request_dairy_inner_classes_milking_cows_autumn import PostDairyRequestDairyInnerClassesMilkingCowsAutumn

# TODO update the JSON string below
json = "{}"
# create an instance of PostDairyRequestDairyInnerClassesMilkingCowsAutumn from a JSON string
post_dairy_request_dairy_inner_classes_milking_cows_autumn_instance = PostDairyRequestDairyInnerClassesMilkingCowsAutumn.from_json(json)
# print the JSON string representation of the object
print(PostDairyRequestDairyInnerClassesMilkingCowsAutumn.to_json())

# convert the object into a dict
post_dairy_request_dairy_inner_classes_milking_cows_autumn_dict = post_dairy_request_dairy_inner_classes_milking_cows_autumn_instance.to_dict()
# create an instance of PostDairyRequestDairyInnerClassesMilkingCowsAutumn from a dict
post_dairy_request_dairy_inner_classes_milking_cows_autumn_from_dict = PostDairyRequestDairyInnerClassesMilkingCowsAutumn.from_dict(post_dairy_request_dairy_inner_classes_milking_cows_autumn_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


