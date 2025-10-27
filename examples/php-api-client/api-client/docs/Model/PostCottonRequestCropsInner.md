# # PostCottonRequestCropsInner

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Unique identifier for this activity | [optional]
**state** | **string** | What state the location is in. Note: Western Australia is split up into two regions, &#x60;wa_nw&#x60; is North-West Western Australia, &#x60;wa_sw&#x60; is South-West Western Australia |
**average_cotton_yield** | **float** | Average cotton yield, in t/ha (tonnes per hectare) |
**area_sown** | **float** | Area sown, in ha (hectares) |
**average_weight_per_bale_kg** | **float** | Average weight of unprocessed cotton per bale, in kg |
**cotton_lint_per_bale_kg** | **float** | Average weight of cotton lint per bale, in kg |
**cotton_seed_per_bale_kg** | **float** | Average weight of cotton seed produced per bale, in kg |
**waste_per_bale_kg** | **float** | Average weight of cotton waste produced per bale, in kg |
**urea_application** | **float** | Urea application, in kg Urea/ha (kilograms of urea per hectare) |
**other_fertiliser_type** | **string** | Other N fertiliser type | [optional]
**other_fertiliser_application** | **float** | Other N fertiliser application, in kg/ha (kilograms per hectare) |
**non_urea_nitrogen** | **float** | Non-urea nitrogen application, in kg N/ha (kilograms of nitrogen per hectare) | [default to 0]
**urea_ammonium_nitrate** | **float** | Urea-Ammonium nitrate application, in kg product/ha (kilograms of product per hectare) | [default to 0]
**phosphorus_application** | **float** | Phosphorus application, in kg P/ha (kilograms of phosphorus per hectare) | [default to 0]
**potassium_application** | **float** | Potassium application, in kg K/ha (kilograms of potassium per hectare) | [default to 0]
**sulfur_application** | **float** | Sulfur application, in kg S/ha (kilograms of sulfur per hectare) | [default to 0]
**single_super_phosphate** | **float** | Single superphosphate use, in kg/ha (kilograms per hectare) |
**rainfall_above600** | **bool** | Is there enough rainfall or irrigation to drain through the soil profile, typically above 600mm |
**fraction_of_annual_crop_burnt** | **float** | Fraction of annual production of crop that is burnt. If included, this should only ever be 0 for cotton | [default to 0]
**herbicide_use** | **float** | Total amount of active ingredients from general herbicide/pesticide use, in kg (kilogram) |
**glyphosate_other_herbicide_use** | **float** | Total amount of active ingredients from other herbicide use (Paraquat, Diquat, Glyphosate), in kg (kilogram) |
**electricity_allocation** | **float** | Percentage of electricity use to allocate to this crop, from 0 to 1 |
**limestone** | **float** | Lime applied in tonnes |
**limestone_fraction** | **float** | Fraction of lime as limestone vs dolomite, between 0 and 1 |
**diesel_use** | **float** | Diesel usage in L (litres) |
**petrol_use** | **float** | Petrol usage in L (litres) |
**lpg** | **float** | LPG Fuel usage in L (litres) |

[[Back to Model list]](../../README.md#models) [[Back to API list]](../../README.md#endpoints) [[Back to README]](../../README.md)
