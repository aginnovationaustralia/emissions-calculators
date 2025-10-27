# PostHorticulture200ResponseScope1

Scope 1 greenhouse gas emissions are the emissions released to the atmosphere as a direct result of an activity, in tonnes-CO2e (tonnes of carbon dioxide equivalent)

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**fuel_co2** | **float** | CO2 emissions from fuel use, in tonnes-CO2e | 
**fuel_ch4** | **float** | CH4 emissions from fuel use, in tonnes-CO2e | 
**fuel_n2_o** | **float** | N2O emissions from fuel use, in tonnes-CO2e | 
**urea_co2** | **float** | CO2 emissions from urea, in tonnes-CO2e | 
**lime_co2** | **float** | CO2 emissions from lime, in tonnes-CO2e | 
**fertiliser_n2_o** | **float** | N2O emissions from fertiliser, in tonnes-CO2e | 
**atmospheric_deposition_n2_o** | **float** | N2O emissions from atmospheric deposition, in tonnes-CO2e | 
**leaching_and_runoff_n2_o** | **float** | N2O emissions from leeching and runoff, in tonnes-CO2e | 
**crop_residue_n2_o** | **float** | N2O emissions from crop residue, in tonnes-CO2e | 
**field_burning_n2_o** | **float** | N2O emissions from field burning, in tonnes-CO2e | 
**field_burning_ch4** | **float** | CH4 emissions from field burning, in tonnes-CO2e | 
**hfcs_refrigerant_leakage** | **float** | Emissions from refrigerant leakage, in tonnes-HFCs | 
**total_co2** | **float** | Total CO2 scope 1 emissions, in tonnes-CO2e | 
**total_ch4** | **float** | Total CH4 scope 1 emissions, in tonnes-CO2e | 
**total_n2_o** | **float** | Total N2O scope 1 emissions, in tonnes-CO2e | 
**total_hfcs** | **float** | Total HFCs scope 1 emissions, in tonnes-CO2e | 
**total** | **float** | Total scope 1 emissions, in tonnes-CO2e | 

## Example

```python
from openapi_client.models.post_horticulture200_response_scope1 import PostHorticulture200ResponseScope1

# TODO update the JSON string below
json = "{}"
# create an instance of PostHorticulture200ResponseScope1 from a JSON string
post_horticulture200_response_scope1_instance = PostHorticulture200ResponseScope1.from_json(json)
# print the JSON string representation of the object
print(PostHorticulture200ResponseScope1.to_json())

# convert the object into a dict
post_horticulture200_response_scope1_dict = post_horticulture200_response_scope1_instance.to_dict()
# create an instance of PostHorticulture200ResponseScope1 from a dict
post_horticulture200_response_scope1_from_dict = PostHorticulture200ResponseScope1.from_dict(post_horticulture200_response_scope1_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


