# PostPorkRequestPorkInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | Unique identifier for this activity | [optional] 
**classes** | [**PostPorkRequestPorkInnerClasses**](PostPorkRequestPorkInnerClasses.md) |  | 
**limestone** | **float** | Lime applied in tonnes | 
**limestone_fraction** | **float** | Fraction of lime as limestone vs dolomite, between 0 and 1 | 
**fertiliser** | [**PostBeefRequestBeefInnerFertiliser**](PostBeefRequestBeefInnerFertiliser.md) |  | 
**diesel** | **float** | Diesel usage in L (litres) | 
**petrol** | **float** | Petrol usage in L (litres) | 
**lpg** | **float** | LPG Fuel usage in L (litres) | 
**electricity_source** | **str** | Source of electricity | 
**electricity_renewable** | **float** | Percent of total electricity usage that is drawn from renewable sources, between 0 and 1. Unused if &#x60;electricitySource&#x60; is &#x60;Renewable&#x60; | 
**electricity_use** | **float** | Electricity use in KWh (kilowatt hours) | 
**herbicide** | **float** | Total amount of active ingredients of from herbicide (Paraquat, Diquat, Glyphosate) in kg (kilograms) | 
**herbicide_other** | **float** | Total amount of active ingredients of from other herbicides in kg (kilograms) | 
**bedding_hay_barley_straw** | **float** | Hay, barley, straw, etc. purchased for pig bedding, in tonnes | 
**feed_products** | [**List[PostPorkRequestPorkInnerFeedProductsInner]**](PostPorkRequestPorkInnerFeedProductsInner.md) |  | 

## Example

```python
from openapi_client.models.post_pork_request_pork_inner import PostPorkRequestPorkInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostPorkRequestPorkInner from a JSON string
post_pork_request_pork_inner_instance = PostPorkRequestPorkInner.from_json(json)
# print the JSON string representation of the object
print(PostPorkRequestPorkInner.to_json())

# convert the object into a dict
post_pork_request_pork_inner_dict = post_pork_request_pork_inner_instance.to_dict()
# create an instance of PostPorkRequestPorkInner from a dict
post_pork_request_pork_inner_from_dict = PostPorkRequestPorkInner.from_dict(post_pork_request_pork_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


