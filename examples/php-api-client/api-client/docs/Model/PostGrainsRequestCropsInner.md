# # PostGrainsRequestCropsInner

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Unique identifier for this activity | [optional]
**type** | **string** | Crop type. Note that the following crop types are now deprecated, the relevant full calculator should be used instead: &#39;Cotton&#39;, &#39;Rice&#39;, &#39;Sugar Cane&#39; |
**state** | **string** | What state the location is in. Note: Western Australia is split up into two regions, &#x60;wa_nw&#x60; is North-West Western Australia, &#x60;wa_sw&#x60; is South-West Western Australia |
**production_system** | **string** | Production system of this crop. Note that the following production systems are now deprecated, the relevant full calculator should be used instead: &#39;Cotton&#39;, &#39;Rice&#39;, &#39;Sugar cane&#39; |
**average_grain_yield** | **float** | Average grain yield, in t/ha (tonnes per hectare) |
**area_sown** | **float** | Area sown, in ha (hectares) |
**non_urea_nitrogen** | **float** | Non-urea nitrogen application, in kg N/ha (kilograms of nitrogen per hectare) |
**urea_application** | **float** | Urea nitrogen application, in kg Urea/ha (kilograms of urea per hectare) |
**urea_ammonium_nitrate** | **float** | Urea-Ammonium nitrate application, in kg product/ha (kilograms of product per hectare) |
**phosphorus_application** | **float** | Phosphorus application, in kg P/ha (kilograms of phosphorus per hectare) |
**potassium_application** | **float** | Potassium application, in kg K/ha (kilograms of potassium per hectare) |
**sulfur_application** | **float** | Sulfur application, in kg S/ha (kilograms of sulfur per hectare) |
**rainfall_above600** | **bool** | Is there enough rainfall or irrigation to drain through the soil profile, typically above 600mm |
**fraction_of_annual_crop_burnt** | **float** | Fraction of annual production of crop that is burnt, from 0 to 1 |
**herbicide_use** | **float** | Total amount of active ingredients from general herbicide/pesticide use, in kg (kilogram) |
**glyphosate_other_herbicide_use** | **float** | Total amount of active ingredients from other herbicide use (Paraquat, Diquat, Glyphosate), in kg (kilogram) |
**electricity_allocation** | **float** | Percentage of electricity use to allocate to this crop, from 0 to 1 |
**limestone** | **float** | Lime applied in tonnes |
**limestone_fraction** | **float** | Fraction of lime as limestone vs dolomite, between 0 and 1 |
**diesel_use** | **float** | Diesel usage in L (litres) |
**petrol_use** | **float** | Petrol usage in L (litres) |
**lpg** | **float** | LPG Fuel usage in L (litres) |

[[Back to Model list]](../../README.md#models) [[Back to API list]](../../README.md#endpoints) [[Back to README]](../../README.md)
