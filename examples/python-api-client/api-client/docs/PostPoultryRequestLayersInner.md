# PostPoultryRequestLayersInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | Unique identifier for this activity | [optional] 
**layers** | [**PostPoultryRequestLayersInnerLayers**](PostPoultryRequestLayersInnerLayers.md) |  | 
**meat_chicken_layers** | [**PostPoultryRequestLayersInnerMeatChickenLayers**](PostPoultryRequestLayersInnerMeatChickenLayers.md) |  | 
**feed** | [**List[PostPoultryRequestBroilersInnerGroupsInnerFeedInner]**](PostPoultryRequestBroilersInnerGroupsInnerFeedInner.md) |  | 
**purchased_free_range** | **float** | Fraction of chickens purchased that are free range. Note: fraction of chickens purchased that are conventional is &#x60;1 - purchasedFreeRange&#x60; | 
**diesel** | **float** | Diesel usage in L (litres) | 
**petrol** | **float** | Petrol usage in L (litres) | 
**lpg** | **float** | LPG Fuel usage in L (litres) | 
**electricity_source** | **str** | Source of electricity | 
**electricity_renewable** | **float** | Percent of total electricity usage that is drawn from renewable sources, between 0 and 1. Unused if &#x60;electricitySource&#x60; is &#x60;Renewable&#x60; | 
**electricity_use** | **float** | Electricity use in KWh (kilowatt hours) | 
**hay** | **float** | Hay purchased in tonnes | 
**herbicide** | **float** | Total amount of active ingredients of from herbicide (Paraquat, Diquat, Glyphosate) in kg (kilograms) | 
**herbicide_other** | **float** | Total amount of active ingredients of from other herbicides in kg (kilograms) | 
**manure_waste_allocation** | **float** | Fraction allocation of manure waste, from 0 to 1. Note: only for pasture range, paddock and free range systems | 
**waste_handled_drylot_or_storage** | **float** | Fraction of waste handled through dryland and solid storage, from 0 to 1 | 
**litter_recycled** | **float** | Fraction of litter recycled, from 0 to 1 | 
**litter_recycle_frequency** | **float** | Number of litter cycles per year | 
**meat_chicken_layers_purchases** | [**PostPoultryRequestBroilersInnerMeatChickenLayersPurchases**](PostPoultryRequestBroilersInnerMeatChickenLayersPurchases.md) |  | 
**layers_purchases** | [**PostPoultryRequestLayersInnerLayersPurchases**](PostPoultryRequestLayersInnerLayersPurchases.md) |  | 
**custom_feed_purchased** | **float** | Custom feed purchased, in tonnes | 
**custom_feed_emission_intensity** | **float** | Emissions intensity of custom feed in GHG (kg CO2-e/kg input) | 
**meat_chicken_layers_egg_sale** | [**PostPoultryRequestLayersInnerMeatChickenLayersEggSale**](PostPoultryRequestLayersInnerMeatChickenLayersEggSale.md) |  | 
**layers_egg_sale** | [**PostPoultryRequestLayersInnerLayersEggSale**](PostPoultryRequestLayersInnerLayersEggSale.md) |  | 

## Example

```python
from openapi_client.models.post_poultry_request_layers_inner import PostPoultryRequestLayersInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostPoultryRequestLayersInner from a JSON string
post_poultry_request_layers_inner_instance = PostPoultryRequestLayersInner.from_json(json)
# print the JSON string representation of the object
print(PostPoultryRequestLayersInner.to_json())

# convert the object into a dict
post_poultry_request_layers_inner_dict = post_poultry_request_layers_inner_instance.to_dict()
# create an instance of PostPoultryRequestLayersInner from a dict
post_poultry_request_layers_inner_from_dict = PostPoultryRequestLayersInner.from_dict(post_poultry_request_layers_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


