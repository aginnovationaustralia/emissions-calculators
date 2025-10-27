# PostAquacultureRequestEnterprisesInnerFluidWasteInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**fluid_waste_kl** | **float** | Amount of fluid waste, in kL (kilolitres) | 
**fluid_waste_treatment_type** | **str** | Type of fluid waste treatment | 
**average_inlet_cod** | **float** | Average inlet COD (mg per litre) | 
**average_outlet_cod** | **float** | Average outlet COD (mg per litre) | 
**flared_combusted_fraction** | **float** | Fraction of waste flared or combusted, between 0 and 1 | 

## Example

```python
from openapi_client.models.post_aquaculture_request_enterprises_inner_fluid_waste_inner import PostAquacultureRequestEnterprisesInnerFluidWasteInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostAquacultureRequestEnterprisesInnerFluidWasteInner from a JSON string
post_aquaculture_request_enterprises_inner_fluid_waste_inner_instance = PostAquacultureRequestEnterprisesInnerFluidWasteInner.from_json(json)
# print the JSON string representation of the object
print(PostAquacultureRequestEnterprisesInnerFluidWasteInner.to_json())

# convert the object into a dict
post_aquaculture_request_enterprises_inner_fluid_waste_inner_dict = post_aquaculture_request_enterprises_inner_fluid_waste_inner_instance.to_dict()
# create an instance of PostAquacultureRequestEnterprisesInnerFluidWasteInner from a dict
post_aquaculture_request_enterprises_inner_fluid_waste_inner_from_dict = PostAquacultureRequestEnterprisesInnerFluidWasteInner.from_dict(post_aquaculture_request_enterprises_inner_fluid_waste_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


