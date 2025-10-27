# PostFeedlot200ResponseScope1

Scope 1 greenhouse gas emissions are the emissions released to the atmosphere as a direct result of an activity, in tonnes-CO2e (tonnes of carbon dioxide equivalent)

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**fuel_co2** | **float** | CO2 emissions from fuel use, in tonnes-CO2e | 
**fuel_ch4** | **float** | CH4 emissions from fuel use, in tonnes-CO2e | 
**fuel_n2_o** | **float** | N2O emissions from fuel use, in tonnes-CO2e | 
**transport_co2** | **float** | CO2 emissions from transport, in tonnes-CO2e | 
**transport_ch4** | **float** | CH4 emissions from transport, in tonnes-CO2e | 
**transport_n2_o** | **float** | N2O emissions from transport, in tonnes-CO2e | 
**urea_co2** | **float** | CO2 emissions from urea, in tonnes-CO2e | 
**lime_co2** | **float** | CO2 emissions from lime, in tonnes-CO2e | 
**atmospheric_deposition_n2_o** | **float** | N2O emissions from atmospheric deposition, in tonnes-CO2e | 
**manure_direct_n2_o** | **float** | CH4 emissions from manure management (direct), in tonnes-CO2e | 
**manure_indirect_n2_o** | **float** | CH4 emissions from manure management (indirect), in tonnes-CO2e | 
**manure_management_ch4** | **float** | CH4 emissions from manure management, in tonnes-CO2e | 
**manure_applied_to_soil_n2_o** | **float** | CH4 emissions from manure applied to soil, in tonnes-CO2e | 
**enteric_ch4** | **float** | CH4 emissions from enteric fermentation, in tonnes-CO2e | 
**total_co2** | **float** | Total CO2 scope 1 emissions, in tonnes-CO2e | 
**total_ch4** | **float** | Total CH4 scope 1 emissions, in tonnes-CO2e | 
**total_n2_o** | **float** | Total N2O scope 1 emissions, in tonnes-CO2e | 
**total** | **float** | Total scope 1 emissions, in tonnes-CO2e | 

## Example

```python
from openapi_client.models.post_feedlot200_response_scope1 import PostFeedlot200ResponseScope1

# TODO update the JSON string below
json = "{}"
# create an instance of PostFeedlot200ResponseScope1 from a JSON string
post_feedlot200_response_scope1_instance = PostFeedlot200ResponseScope1.from_json(json)
# print the JSON string representation of the object
print(PostFeedlot200ResponseScope1.to_json())

# convert the object into a dict
post_feedlot200_response_scope1_dict = post_feedlot200_response_scope1_instance.to_dict()
# create an instance of PostFeedlot200ResponseScope1 from a dict
post_feedlot200_response_scope1_from_dict = PostFeedlot200ResponseScope1.from_dict(post_feedlot200_response_scope1_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


