# PostAquaculture200ResponseScope1

Scope 1 greenhouse gas emissions are the emissions released to the atmosphere as a direct result of an activity, in tonnes-CO2e (tonnes of carbon dioxide equivalent)

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**fuel_co2** | **float** | CO2 emissions from fuel use, in tonnes-CO2e | 
**fuel_ch4** | **float** | CH4 emissions from fuel use, in tonnes-CO2e | 
**fuel_n2_o** | **float** | N2O emissions from fuel use, in tonnes-CO2e | 
**hfcs_refrigerant_leakage** | **float** | Emissions from refrigerant leakage, in tonnes-HFCs | 
**waste_water_co2** | **float** | Emissions from wastewater, in tonnes-CO2e | 
**composted_solid_waste_co2** | **float** | Emissions from composted solid waste, in tonnes-CO2e | 
**total_co2** | **float** | Total CO2 scope 1 emissions, in tonnes-CO2e | 
**total_ch4** | **float** | Total CH4 scope 1 emissions, in tonnes-CO2e | 
**total_n2_o** | **float** | Total N2O scope 1 emissions, in tonnes-CO2e | 
**total_hfcs** | **float** | Total HFCs scope 1 emissions, in tonnes-CO2e | 
**total** | **float** | Total scope 1 emissions, in tonnes-CO2e | 

## Example

```python
from openapi_client.models.post_aquaculture200_response_scope1 import PostAquaculture200ResponseScope1

# TODO update the JSON string below
json = "{}"
# create an instance of PostAquaculture200ResponseScope1 from a JSON string
post_aquaculture200_response_scope1_instance = PostAquaculture200ResponseScope1.from_json(json)
# print the JSON string representation of the object
print(PostAquaculture200ResponseScope1.to_json())

# convert the object into a dict
post_aquaculture200_response_scope1_dict = post_aquaculture200_response_scope1_instance.to_dict()
# create an instance of PostAquaculture200ResponseScope1 from a dict
post_aquaculture200_response_scope1_from_dict = PostAquaculture200ResponseScope1.from_dict(post_aquaculture200_response_scope1_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


