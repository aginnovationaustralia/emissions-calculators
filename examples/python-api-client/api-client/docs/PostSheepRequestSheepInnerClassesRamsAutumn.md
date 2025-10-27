# PostSheepRequestSheepInnerClassesRamsAutumn


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**head** | **float** | Number of animals (head) | 
**liveweight** | **float** | Average liveweight of animals in kg/head (kilogram per head) | 
**liveweight_gain** | **float** | Average liveweight gain in kg/day (kilogram per day) | 
**crude_protein** | **float** | Crude protein percent, between 0 and 100 | [optional] 
**dry_matter_digestibility** | **float** | Dry matter digestibility percent, between 0 and 100 | [optional] 
**feed_availability** | **float** | Feed availability, in t/ha (tonnes per hectare) | [optional] 

## Example

```python
from openapi_client.models.post_sheep_request_sheep_inner_classes_rams_autumn import PostSheepRequestSheepInnerClassesRamsAutumn

# TODO update the JSON string below
json = "{}"
# create an instance of PostSheepRequestSheepInnerClassesRamsAutumn from a JSON string
post_sheep_request_sheep_inner_classes_rams_autumn_instance = PostSheepRequestSheepInnerClassesRamsAutumn.from_json(json)
# print the JSON string representation of the object
print(PostSheepRequestSheepInnerClassesRamsAutumn.to_json())

# convert the object into a dict
post_sheep_request_sheep_inner_classes_rams_autumn_dict = post_sheep_request_sheep_inner_classes_rams_autumn_instance.to_dict()
# create an instance of PostSheepRequestSheepInnerClassesRamsAutumn from a dict
post_sheep_request_sheep_inner_classes_rams_autumn_from_dict = PostSheepRequestSheepInnerClassesRamsAutumn.from_dict(post_sheep_request_sheep_inner_classes_rams_autumn_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


