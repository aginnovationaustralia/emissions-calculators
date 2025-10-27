# PostAquacultureRequestEnterprisesInner

Input data required for a single aquaculture enterprise

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | Unique identifier for this activity | [optional] 
**state** | **str** | What state the location is in. Note: Western Australia is split up into two regions, &#x60;wa_nw&#x60; is North-West Western Australia, &#x60;wa_sw&#x60; is South-West Western Australia | 
**production_system** | **str** | Production system of the aquaculture enterprise | 
**total_harvest_kg** | **float** | Total harvest in kg | 
**refrigerants** | [**List[PostAquacultureRequestEnterprisesInnerRefrigerantsInner]**](PostAquacultureRequestEnterprisesInnerRefrigerantsInner.md) | Refrigerant type | 
**bait** | [**List[PostAquacultureRequestEnterprisesInnerBaitInner]**](PostAquacultureRequestEnterprisesInnerBaitInner.md) | Bait purchases | 
**custom_bait** | [**List[PostAquacultureRequestEnterprisesInnerCustomBaitInner]**](PostAquacultureRequestEnterprisesInnerCustomBaitInner.md) | Custom bait purchases | 
**inbound_freight** | [**List[PostAquacultureRequestEnterprisesInnerInboundFreightInner]**](PostAquacultureRequestEnterprisesInnerInboundFreightInner.md) | Services used to transport goods to the enterprise | 
**outbound_freight** | [**List[PostAquacultureRequestEnterprisesInnerInboundFreightInner]**](PostAquacultureRequestEnterprisesInnerInboundFreightInner.md) | Services used to transport goods from the enterprise | 
**total_commercial_flights_km** | **float** | Total distance of commercial flights, in km (kilometers) | 
**electricity_renewable** | **float** | Percent of total electricity usage that is drawn from renewable sources, between 0 and 1. Unused if &#x60;electricitySource&#x60; is &#x60;Renewable&#x60; | 
**electricity_use** | **float** | Electricity use in KWh (kilowatt hours) | 
**electricity_source** | **str** | Source of electricity | 
**fuel** | [**PostAquacultureRequestEnterprisesInnerFuel**](PostAquacultureRequestEnterprisesInnerFuel.md) |  | 
**fluid_waste** | [**List[PostAquacultureRequestEnterprisesInnerFluidWasteInner]**](PostAquacultureRequestEnterprisesInnerFluidWasteInner.md) | Amount of fluid waste, in kL (kilolitres) | 
**solid_waste** | [**PostAquacultureRequestEnterprisesInnerSolidWaste**](PostAquacultureRequestEnterprisesInnerSolidWaste.md) |  | 
**carbon_offsets** | **float** | Carbon offsets purchased, in t CO2. Offsetting 2 t CO2 would be 2.0 (not -2.0) | [optional] 

## Example

```python
from openapi_client.models.post_aquaculture_request_enterprises_inner import PostAquacultureRequestEnterprisesInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostAquacultureRequestEnterprisesInner from a JSON string
post_aquaculture_request_enterprises_inner_instance = PostAquacultureRequestEnterprisesInner.from_json(json)
# print the JSON string representation of the object
print(PostAquacultureRequestEnterprisesInner.to_json())

# convert the object into a dict
post_aquaculture_request_enterprises_inner_dict = post_aquaculture_request_enterprises_inner_instance.to_dict()
# create an instance of PostAquacultureRequestEnterprisesInner from a dict
post_aquaculture_request_enterprises_inner_from_dict = PostAquacultureRequestEnterprisesInner.from_dict(post_aquaculture_request_enterprises_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


