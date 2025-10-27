# PostVineyardRequestVineyardsInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | Unique identifier for this activity | [optional] 
**state** | **str** | What state the location is in. Note: Western Australia is split up into two regions, &#x60;wa_nw&#x60; is North-West Western Australia, &#x60;wa_sw&#x60; is South-West Western Australia | 
**rainfall_above600** | **bool** | Is there enough rainfall or irrigation to drain through the soil profile, typically above 600mm | 
**irrigated** | **bool** | Is the crop irrigated? | 
**area_planted** | **float** | Area planted, in ha (hectares) | 
**average_yield** | **float** | Average yield, in t/ha (tonnes per hectare) | 
**non_urea_nitrogen** | **float** | Non-urea nitrogen application, in kg N/ha (kilograms of nitrogen per hectare) | 
**phosphorus_application** | **float** | Phosphorus application, in kg P/ha (kilograms of phosphorus per hectare) | 
**potassium_application** | **float** | Potassium application, in kg K/ha (kilograms of potassium per hectare) | 
**sulfur_application** | **float** | Sulfur application, in kg S/ha (kilograms of sulfur per hectare) | 
**urea_application** | **float** | Urea nitrogen application, in kg Urea/ha (kilograms of urea per hectare) | 
**urea_ammonium_nitrate** | **float** | Urea-Ammonium nitrate application, in kg product/ha (kilograms of product per hectare) | 
**limestone** | **float** | Lime applied in tonnes | 
**limestone_fraction** | **float** | Fraction of lime as limestone vs dolomite, between 0 and 1 | 
**herbicide_use** | **float** | Total amount of active ingredients from general herbicide/pesticide use, in kg (kilogram) | 
**glyphosate_other_herbicide_use** | **float** | Total amount of active ingredients from other herbicide use (Paraquat, Diquat, Glyphosate), in kg (kilogram) | 
**electricity_renewable** | **float** | Percent of total electricity usage that is drawn from renewable sources, between 0 and 1. Unused if &#x60;electricitySource&#x60; is &#x60;Renewable&#x60; | 
**electricity_use** | **float** | Electricity use in KWh (kilowatt hours) | 
**electricity_source** | **str** | Source of electricity | 
**fuel** | [**PostAquacultureRequestEnterprisesInnerFuel**](PostAquacultureRequestEnterprisesInnerFuel.md) |  | 
**fluid_waste** | [**List[PostAquacultureRequestEnterprisesInnerFluidWasteInner]**](PostAquacultureRequestEnterprisesInnerFluidWasteInner.md) | Amount of fluid waste, in kL (kilolitres) | 
**solid_waste** | [**PostAquacultureRequestEnterprisesInnerSolidWaste**](PostAquacultureRequestEnterprisesInnerSolidWaste.md) |  | 
**inbound_freight** | [**List[PostAquacultureRequestEnterprisesInnerInboundFreightInner]**](PostAquacultureRequestEnterprisesInnerInboundFreightInner.md) | Services used to transport goods to the enterprise | 
**outbound_freight** | [**List[PostAquacultureRequestEnterprisesInnerInboundFreightInner]**](PostAquacultureRequestEnterprisesInnerInboundFreightInner.md) | Services used to transport goods from the enterprise | 
**total_commercial_flights_km** | **float** | Total distance of commercial flights, in km (kilometers) | 

## Example

```python
from openapi_client.models.post_vineyard_request_vineyards_inner import PostVineyardRequestVineyardsInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostVineyardRequestVineyardsInner from a JSON string
post_vineyard_request_vineyards_inner_instance = PostVineyardRequestVineyardsInner.from_json(json)
# print the JSON string representation of the object
print(PostVineyardRequestVineyardsInner.to_json())

# convert the object into a dict
post_vineyard_request_vineyards_inner_dict = post_vineyard_request_vineyards_inner_instance.to_dict()
# create an instance of PostVineyardRequestVineyardsInner from a dict
post_vineyard_request_vineyards_inner_from_dict = PostVineyardRequestVineyardsInner.from_dict(post_vineyard_request_vineyards_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


