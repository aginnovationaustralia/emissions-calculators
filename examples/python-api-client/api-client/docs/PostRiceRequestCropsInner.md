# PostRiceRequestCropsInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | Unique identifier for this activity | [optional] 
**state** | **str** | What state the location is in. Note: Western Australia is split up into two regions, &#x60;wa_nw&#x60; is North-West Western Australia, &#x60;wa_sw&#x60; is South-West Western Australia | 
**average_rice_yield** | **float** | Average rice yield, in t/ha (tonnes per hectare) | 
**area_sown** | **float** | Area sown, in ha (hectares) | 
**growing_season_days** | **float** | The length of the growing season for this crop, in days | 
**water_regime_type** | **str** |  | 
**water_regime_sub_type** | **str** |  | 
**rice_preseason_flooding_period** | **str** |  | 
**urea_application** | **float** | Urea application, in kg Urea/ha (kilograms of urea per hectare) | 
**non_urea_nitrogen** | **float** | Non-urea nitrogen application, in kg N/ha (kilograms of nitrogen per hectare) | 
**urea_ammonium_nitrate** | **float** | Urea-Ammonium nitrate application, in kg product/ha (kilograms of product per hectare) | 
**phosphorus_application** | **float** | Phosphorus application, in kg P/ha (kilograms of phosphorus per hectare) | 
**potassium_application** | **float** | Potassium application, in kg K/ha (kilograms of potassium per hectare) | 
**sulfur_application** | **float** | Sulfur application, in kg S/ha (kilograms of sulfur per hectare) | 
**fraction_of_annual_crop_burnt** | **float** | Fraction of annual production of crop that is burnt, from 0 to 1 | 
**herbicide_use** | **float** | Total amount of active ingredients from general herbicide/pesticide use, in kg (kilogram) | 
**glyphosate_other_herbicide_use** | **float** | Total amount of active ingredients from other herbicide use (Paraquat, Diquat, Glyphosate), in kg (kilogram) | 
**electricity_allocation** | **float** | Percentage of electricity use to allocate to this crop, from 0 to 1 | 
**limestone** | **float** | Lime applied in tonnes | 
**limestone_fraction** | **float** | Fraction of lime as limestone vs dolomite, between 0 and 1 | 
**diesel_use** | **float** | Diesel usage in L (litres) | 
**petrol_use** | **float** | Petrol usage in L (litres) | 
**lpg** | **float** | LPG Fuel usage in L (litres) | 

## Example

```python
from openapi_client.models.post_rice_request_crops_inner import PostRiceRequestCropsInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostRiceRequestCropsInner from a JSON string
post_rice_request_crops_inner_instance = PostRiceRequestCropsInner.from_json(json)
# print the JSON string representation of the object
print(PostRiceRequestCropsInner.to_json())

# convert the object into a dict
post_rice_request_crops_inner_dict = post_rice_request_crops_inner_instance.to_dict()
# create an instance of PostRiceRequestCropsInner from a dict
post_rice_request_crops_inner_from_dict = PostRiceRequestCropsInner.from_dict(post_rice_request_crops_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


