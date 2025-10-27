# # PostDairyRequestDairyInner

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Unique identifier for this activity | [optional]
**classes** | [**\OpenAPI\Client\Model\PostDairyRequestDairyInnerClasses**](PostDairyRequestDairyInnerClasses.md) |  |
**limestone** | **float** | Lime applied in tonnes |
**limestone_fraction** | **float** | Fraction of lime as limestone vs dolomite, between 0 and 1 |
**fertiliser** | [**\OpenAPI\Client\Model\PostBeefRequestBeefInnerFertiliser**](PostBeefRequestBeefInnerFertiliser.md) |  |
**seasonal_fertiliser** | [**\OpenAPI\Client\Model\PostDairyRequestDairyInnerSeasonalFertiliser**](PostDairyRequestDairyInnerSeasonalFertiliser.md) |  |
**areas** | [**\OpenAPI\Client\Model\PostDairyRequestDairyInnerAreas**](PostDairyRequestDairyInnerAreas.md) |  |
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
**manure_management_milking_cows** | [**\OpenAPI\Client\Model\PostDairyRequestDairyInnerManureManagementMilkingCows**](PostDairyRequestDairyInnerManureManagementMilkingCows.md) |  |
**manure_management_other_dairy_cows** | [**\OpenAPI\Client\Model\PostDairyRequestDairyInnerManureManagementMilkingCows**](PostDairyRequestDairyInnerManureManagementMilkingCows.md) |  |
**emissions_allocation_to_red_meat_production** | **float** | Allocation as a fraction, from 0 to 1 |
**truck_type** | **string** | Type of truck used for cattle transport |
**distance_cattle_transported** | **float** | Distance cattle are transported between farms, in km (kilometres) |

[[Back to Model list]](../../README.md#models) [[Back to API list]](../../README.md#endpoints) [[Back to README]](../../README.md)
