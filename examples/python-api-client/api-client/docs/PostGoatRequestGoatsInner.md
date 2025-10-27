# PostGoatRequestGoatsInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | Unique identifier for this activity | [optional] 
**classes** | [**PostGoatRequestGoatsInnerClasses**](PostGoatRequestGoatsInnerClasses.md) |  | 
**limestone** | **float** | Lime applied in tonnes | 
**limestone_fraction** | **float** | Fraction of lime as limestone vs dolomite, between 0 and 1 | 
**fertiliser** | [**PostBeefRequestBeefInnerFertiliser**](PostBeefRequestBeefInnerFertiliser.md) |  | 
**diesel** | **float** | Diesel usage in L (litres) | 
**petrol** | **float** | Petrol usage in L (litres) | 
**lpg** | **float** | LPG Fuel usage in L (litres) | 
**mineral_supplementation** | [**PostBeefRequestBeefInnerMineralSupplementation**](PostBeefRequestBeefInnerMineralSupplementation.md) |  | 
**electricity_source** | **str** | Source of electricity | 
**electricity_renewable** | **float** | Percent of total electricity usage that is drawn from renewable sources, between 0 and 1. Unused if &#x60;electricitySource&#x60; is &#x60;Renewable&#x60; | 
**electricity_use** | **float** | Electricity use in KWh (kilowatt hours) | 
**grain_feed** | **float** | Grain purchased for cattle feed in tonnes | 
**hay_feed** | **float** | Hay purchased for cattle feed in tonnes | 
**herbicide** | **float** | Total amount of active ingredients of from herbicide (Paraquat, Diquat, Glyphosate) in kg (kilograms) | 
**herbicide_other** | **float** | Total amount of active ingredients of from other herbicides in kg (kilograms) | 

## Example

```python
from openapi_client.models.post_goat_request_goats_inner import PostGoatRequestGoatsInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostGoatRequestGoatsInner from a JSON string
post_goat_request_goats_inner_instance = PostGoatRequestGoatsInner.from_json(json)
# print the JSON string representation of the object
print(PostGoatRequestGoatsInner.to_json())

# convert the object into a dict
post_goat_request_goats_inner_dict = post_goat_request_goats_inner_instance.to_dict()
# create an instance of PostGoatRequestGoatsInner from a dict
post_goat_request_goats_inner_from_dict = PostGoatRequestGoatsInner.from_dict(post_goat_request_goats_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


