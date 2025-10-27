# PostProcessingRequestProductsInner

Input data required for processing a specific product

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | Unique identifier for this activity | [optional] 
**product** | [**PostProcessingRequestProductsInnerProduct**](PostProcessingRequestProductsInnerProduct.md) |  | 
**electricity_renewable** | **float** | Percent of total electricity usage that is drawn from renewable sources, between 0 and 1. Unused if &#x60;electricitySource&#x60; is &#x60;Renewable&#x60; | 
**electricity_use** | **float** | Electricity use in KWh (kilowatt hours) | 
**electricity_source** | **str** | Source of electricity | 
**fuel** | [**PostAquacultureRequestEnterprisesInnerFuel**](PostAquacultureRequestEnterprisesInnerFuel.md) |  | 
**refrigerants** | [**List[PostHorticultureRequestCropsInnerRefrigerantsInner]**](PostHorticultureRequestCropsInnerRefrigerantsInner.md) | Refrigerant type | 
**fluid_waste** | [**List[PostAquacultureRequestEnterprisesInnerFluidWasteInner]**](PostAquacultureRequestEnterprisesInnerFluidWasteInner.md) | Amount of fluid waste, in kL (kilolitres) | 
**solid_waste** | [**PostAquacultureRequestEnterprisesInnerSolidWaste**](PostAquacultureRequestEnterprisesInnerSolidWaste.md) |  | 
**purchased_co2** | **float** | Quantity of CO2 purchased, in kg CO2 | 
**carbon_offsets** | **float** | Carbon offsets purchased, in t CO2. Offsetting 2 t CO2 would be 2.0 (not -2.0) | [optional] 

## Example

```python
from openapi_client.models.post_processing_request_products_inner import PostProcessingRequestProductsInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostProcessingRequestProductsInner from a JSON string
post_processing_request_products_inner_instance = PostProcessingRequestProductsInner.from_json(json)
# print the JSON string representation of the object
print(PostProcessingRequestProductsInner.to_json())

# convert the object into a dict
post_processing_request_products_inner_dict = post_processing_request_products_inner_instance.to_dict()
# create an instance of PostProcessingRequestProductsInner from a dict
post_processing_request_products_inner_from_dict = PostProcessingRequestProductsInner.from_dict(post_processing_request_products_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


