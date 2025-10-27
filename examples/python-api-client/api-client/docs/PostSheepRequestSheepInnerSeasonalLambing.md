# PostSheepRequestSheepInnerSeasonalLambing

Seasonal lamb marking rates, i.e. the rate of lambs marked per ewe lambed. Values may exceed 1 if there are more lambs marked than ewes lambed in a season.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**autumn** | **float** |  | 
**winter** | **float** |  | 
**spring** | **float** |  | 
**summer** | **float** |  | 

## Example

```python
from openapi_client.models.post_sheep_request_sheep_inner_seasonal_lambing import PostSheepRequestSheepInnerSeasonalLambing

# TODO update the JSON string below
json = "{}"
# create an instance of PostSheepRequestSheepInnerSeasonalLambing from a JSON string
post_sheep_request_sheep_inner_seasonal_lambing_instance = PostSheepRequestSheepInnerSeasonalLambing.from_json(json)
# print the JSON string representation of the object
print(PostSheepRequestSheepInnerSeasonalLambing.to_json())

# convert the object into a dict
post_sheep_request_sheep_inner_seasonal_lambing_dict = post_sheep_request_sheep_inner_seasonal_lambing_instance.to_dict()
# create an instance of PostSheepRequestSheepInnerSeasonalLambing from a dict
post_sheep_request_sheep_inner_seasonal_lambing_from_dict = PostSheepRequestSheepInnerSeasonalLambing.from_dict(post_sheep_request_sheep_inner_seasonal_lambing_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


