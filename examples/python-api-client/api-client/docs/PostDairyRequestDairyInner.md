# PostDairyRequestDairyInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | Unique identifier for this activity | [optional] 
**classes** | [**PostDairyRequestDairyInnerClasses**](PostDairyRequestDairyInnerClasses.md) |  | 
**limestone** | **float** | Lime applied in tonnes | 
**limestone_fraction** | **float** | Fraction of lime as limestone vs dolomite, between 0 and 1 | 
**fertiliser** | [**PostBeefRequestBeefInnerFertiliser**](PostBeefRequestBeefInnerFertiliser.md) |  | 
**seasonal_fertiliser** | [**PostDairyRequestDairyInnerSeasonalFertiliser**](PostDairyRequestDairyInnerSeasonalFertiliser.md) |  | 
**areas** | [**PostDairyRequestDairyInnerAreas**](PostDairyRequestDairyInnerAreas.md) |  | 
**diesel** | **float** | Diesel usage in L (litres) | 
**petrol** | **float** | Petrol usage in L (litres) | 
**lpg** | **float** | LPG Fuel usage in L (litres) | 
**electricity_renewable** | **float** | Percent of total electricity usage that is drawn from renewable sources, between 0 and 1. Unused if &#x60;electricitySource&#x60; is &#x60;Renewable&#x60; | 
**electricity_use** | **float** | Electricity use in KWh (kilowatt hours) | 
**grain_feed** | **float** | Grain purchased for cattle feed in tonnes | 
**hay_feed** | **float** | Hay purchased for cattle feed in tonnes | 
**cottonseed_feed** | **float** | Cotton seed purchased for cattle feed in tonnes | 
**herbicide** | **float** | Total amount of active ingredients of from herbicide (Paraquat, Diquat, Glyphosate) in kg (kilograms) | 
**herbicide_other** | **float** | Total amount of active ingredients of from other herbicides in kg (kilograms) | 
**manure_management_milking_cows** | [**PostDairyRequestDairyInnerManureManagementMilkingCows**](PostDairyRequestDairyInnerManureManagementMilkingCows.md) |  | 
**manure_management_other_dairy_cows** | [**PostDairyRequestDairyInnerManureManagementMilkingCows**](PostDairyRequestDairyInnerManureManagementMilkingCows.md) |  | 
**emissions_allocation_to_red_meat_production** | **float** | Allocation as a fraction, from 0 to 1 | 
**truck_type** | **str** | Type of truck used for cattle transport | 
**distance_cattle_transported** | **float** | Distance cattle are transported between farms, in km (kilometres) | 

## Example

```python
from openapi_client.models.post_dairy_request_dairy_inner import PostDairyRequestDairyInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostDairyRequestDairyInner from a JSON string
post_dairy_request_dairy_inner_instance = PostDairyRequestDairyInner.from_json(json)
# print the JSON string representation of the object
print(PostDairyRequestDairyInner.to_json())

# convert the object into a dict
post_dairy_request_dairy_inner_dict = post_dairy_request_dairy_inner_instance.to_dict()
# create an instance of PostDairyRequestDairyInner from a dict
post_dairy_request_dairy_inner_from_dict = PostDairyRequestDairyInner.from_dict(post_dairy_request_dairy_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


