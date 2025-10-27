# # PostPoultryRequestLayersInner

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Unique identifier for this activity | [optional]
**layers** | [**\OpenAPI\Client\Model\PostPoultryRequestLayersInnerLayers**](PostPoultryRequestLayersInnerLayers.md) |  |
**meat_chicken_layers** | [**\OpenAPI\Client\Model\PostPoultryRequestLayersInnerMeatChickenLayers**](PostPoultryRequestLayersInnerMeatChickenLayers.md) |  |
**feed** | [**\OpenAPI\Client\Model\PostPoultryRequestBroilersInnerGroupsInnerFeedInner[]**](PostPoultryRequestBroilersInnerGroupsInnerFeedInner.md) |  |
**purchased_free_range** | **float** | Fraction of chickens purchased that are free range. Note: fraction of chickens purchased that are conventional is &#x60;1 - purchasedFreeRange&#x60; |
**diesel** | **float** | Diesel usage in L (litres) |
**petrol** | **float** | Petrol usage in L (litres) |
**lpg** | **float** | LPG Fuel usage in L (litres) |
**electricity_source** | **string** | Source of electricity |
**electricity_renewable** | **float** | Percent of total electricity usage that is drawn from renewable sources, between 0 and 1. Unused if &#x60;electricitySource&#x60; is &#x60;Renewable&#x60; |
**electricity_use** | **float** | Electricity use in KWh (kilowatt hours) |
**hay** | **float** | Hay purchased in tonnes |
**herbicide** | **float** | Total amount of active ingredients of from herbicide (Paraquat, Diquat, Glyphosate) in kg (kilograms) |
**herbicide_other** | **float** | Total amount of active ingredients of from other herbicides in kg (kilograms) |
**manure_waste_allocation** | **float** | Fraction allocation of manure waste, from 0 to 1. Note: only for pasture range, paddock and free range systems |
**waste_handled_drylot_or_storage** | **float** | Fraction of waste handled through dryland and solid storage, from 0 to 1 |
**litter_recycled** | **float** | Fraction of litter recycled, from 0 to 1 |
**litter_recycle_frequency** | **float** | Number of litter cycles per year |
**meat_chicken_layers_purchases** | [**\OpenAPI\Client\Model\PostPoultryRequestBroilersInnerMeatChickenLayersPurchases**](PostPoultryRequestBroilersInnerMeatChickenLayersPurchases.md) |  |
**layers_purchases** | [**\OpenAPI\Client\Model\PostPoultryRequestLayersInnerLayersPurchases**](PostPoultryRequestLayersInnerLayersPurchases.md) |  |
**custom_feed_purchased** | **float** | Custom feed purchased, in tonnes |
**custom_feed_emission_intensity** | **float** | Emissions intensity of custom feed in GHG (kg CO2-e/kg input) |
**meat_chicken_layers_egg_sale** | [**\OpenAPI\Client\Model\PostPoultryRequestLayersInnerMeatChickenLayersEggSale**](PostPoultryRequestLayersInnerMeatChickenLayersEggSale.md) |  |
**layers_egg_sale** | [**\OpenAPI\Client\Model\PostPoultryRequestLayersInnerLayersEggSale**](PostPoultryRequestLayersInnerLayersEggSale.md) |  |

[[Back to Model list]](../../README.md#models) [[Back to API list]](../../README.md#endpoints) [[Back to README]](../../README.md)
