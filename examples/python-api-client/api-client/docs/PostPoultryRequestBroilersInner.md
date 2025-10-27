# PostPoultryRequestBroilersInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | Unique identifier for this activity | [optional] 
**groups** | [**List[PostPoultryRequestBroilersInnerGroupsInner]**](PostPoultryRequestBroilersInnerGroupsInner.md) |  | 
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
**purchased_free_range** | **float** | Fraction of chickens purchased that are free range. Note: fraction of chickens purchased that are conventional is &#x60;1 - purchasedFreeRange&#x60; | 
**meat_chicken_growers_purchases** | [**PostPoultryRequestBroilersInnerMeatChickenGrowersPurchases**](PostPoultryRequestBroilersInnerMeatChickenGrowersPurchases.md) |  | 
**meat_chicken_layers_purchases** | [**PostPoultryRequestBroilersInnerMeatChickenLayersPurchases**](PostPoultryRequestBroilersInnerMeatChickenLayersPurchases.md) |  | 
**meat_other_purchases** | [**PostPoultryRequestBroilersInnerMeatOtherPurchases**](PostPoultryRequestBroilersInnerMeatOtherPurchases.md) |  | 
**sales** | [**List[PostPoultryRequestBroilersInnerSalesInner]**](PostPoultryRequestBroilersInnerSalesInner.md) | Broiler sales | 

## Example

```python
from openapi_client.models.post_poultry_request_broilers_inner import PostPoultryRequestBroilersInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostPoultryRequestBroilersInner from a JSON string
post_poultry_request_broilers_inner_instance = PostPoultryRequestBroilersInner.from_json(json)
# print the JSON string representation of the object
print(PostPoultryRequestBroilersInner.to_json())

# convert the object into a dict
post_poultry_request_broilers_inner_dict = post_poultry_request_broilers_inner_instance.to_dict()
# create an instance of PostPoultryRequestBroilersInner from a dict
post_poultry_request_broilers_inner_from_dict = PostPoultryRequestBroilersInner.from_dict(post_poultry_request_broilers_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


