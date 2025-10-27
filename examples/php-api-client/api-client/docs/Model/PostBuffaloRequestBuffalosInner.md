# # PostBuffaloRequestBuffalosInner

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Unique identifier for this activity | [optional]
**classes** | [**\OpenAPI\Client\Model\PostBuffaloRequestBuffalosInnerClasses**](PostBuffaloRequestBuffalosInnerClasses.md) |  |
**limestone** | **float** | Lime applied in tonnes |
**limestone_fraction** | **float** | Fraction of lime as limestone vs dolomite, between 0 and 1 |
**fertiliser** | [**\OpenAPI\Client\Model\PostBeefRequestBeefInnerFertiliser**](PostBeefRequestBeefInnerFertiliser.md) |  |
**diesel** | **float** | Diesel usage in L (litres) |
**petrol** | **float** | Petrol usage in L (litres) |
**lpg** | **float** | LPG Fuel usage in L (litres) |
**electricity_source** | **string** | Source of electricity |
**electricity_renewable** | **float** | Percent of total electricity usage that is drawn from renewable sources, between 0 and 1. Unused if &#x60;electricitySource&#x60; is &#x60;Renewable&#x60; |
**electricity_use** | **float** | Electricity use in KWh (kilowatt hours) |
**grain_feed** | **float** | Grain purchased for cattle feed in tonnes |
**hay_feed** | **float** | Hay purchased for cattle feed in tonnes |
**herbicide** | **float** | Total amount of active ingredients of from herbicide (Paraquat, Diquat, Glyphosate) in kg (kilograms) |
**herbicide_other** | **float** | Total amount of active ingredients of from other herbicides in kg (kilograms) |
**cows_calving** | [**\OpenAPI\Client\Model\PostBuffaloRequestBuffalosInnerCowsCalving**](PostBuffaloRequestBuffalosInnerCowsCalving.md) |  |
**seasonal_calving** | [**\OpenAPI\Client\Model\PostBuffaloRequestBuffalosInnerSeasonalCalving**](PostBuffaloRequestBuffalosInnerSeasonalCalving.md) |  |

[[Back to Model list]](../../README.md#models) [[Back to API list]](../../README.md#endpoints) [[Back to README]](../../README.md)
