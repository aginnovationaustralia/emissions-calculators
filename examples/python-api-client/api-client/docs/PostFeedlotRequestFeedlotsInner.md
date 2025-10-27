# PostFeedlotRequestFeedlotsInner

All fields needed to describe the activity of a single feedlot enterprise

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | Unique identifier for the feedlot enterprise | [optional] 
**system** | **str** | Type of feedlot/production system | 
**groups** | [**List[PostFeedlotRequestFeedlotsInnerGroupsInner]**](PostFeedlotRequestFeedlotsInnerGroupsInner.md) |  | 
**fertiliser** | [**PostBeefRequestBeefInnerFertiliser**](PostBeefRequestBeefInnerFertiliser.md) |  | 
**purchases** | [**PostFeedlotRequestFeedlotsInnerPurchases**](PostFeedlotRequestFeedlotsInnerPurchases.md) |  | 
**sales** | [**PostFeedlotRequestFeedlotsInnerSales**](PostFeedlotRequestFeedlotsInnerSales.md) |  | 
**diesel** | **float** | Diesel usage in L (litres) | 
**petrol** | **float** | Petrol usage in L (litres) | 
**lpg** | **float** | LPG Fuel usage in L (litres) | 
**electricity_source** | **str** | Source of electricity | 
**electricity_renewable** | **float** | Percent of total electricity usage that is drawn from renewable sources, between 0 and 1. Unused if &#x60;electricitySource&#x60; is &#x60;Renewable&#x60; | 
**electricity_use** | **float** | Electricity use in KWh (kilowatt hours) | 
**grain_feed** | **float** | Grain purchased for cattle feed in tonnes | 
**hay_feed** | **float** | Hay purchased for cattle feed in tonnes | 
**cottonseed_feed** | **float** | Cotton seed purchased for cattle feed in tonnes | 
**herbicide** | **float** | Total amount of active ingredients of from herbicide (Paraquat, Diquat, Glyphosate) in kg (kilograms) | 
**herbicide_other** | **float** | Total amount of active ingredients of from other herbicides in kg (kilograms) | 
**distance_cattle_transported** | **float** | Distance cattle are transported to farm, in km (kilometres) | 
**truck_type** | **str** | Type of truck used for cattle transport | 
**limestone** | **float** | Lime applied in tonnes | 
**limestone_fraction** | **float** | Fraction of lime as limestone vs dolomite, between 0 and 1 | 

## Example

```python
from openapi_client.models.post_feedlot_request_feedlots_inner import PostFeedlotRequestFeedlotsInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostFeedlotRequestFeedlotsInner from a JSON string
post_feedlot_request_feedlots_inner_instance = PostFeedlotRequestFeedlotsInner.from_json(json)
# print the JSON string representation of the object
print(PostFeedlotRequestFeedlotsInner.to_json())

# convert the object into a dict
post_feedlot_request_feedlots_inner_dict = post_feedlot_request_feedlots_inner_instance.to_dict()
# create an instance of PostFeedlotRequestFeedlotsInner from a dict
post_feedlot_request_feedlots_inner_from_dict = PostFeedlotRequestFeedlotsInner.from_dict(post_feedlot_request_feedlots_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


