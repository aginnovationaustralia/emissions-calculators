# PostAquacultureRequestEnterprisesInnerFuel

Fuels used in this enterprise

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**transport_fuel** | [**List[PostAquacultureRequestEnterprisesInnerFuelTransportFuelInner]**](PostAquacultureRequestEnterprisesInnerFuelTransportFuelInner.md) | A list of fuels used in transportation and vehicles | 
**stationary_fuel** | [**List[PostAquacultureRequestEnterprisesInnerFuelStationaryFuelInner]**](PostAquacultureRequestEnterprisesInnerFuelStationaryFuelInner.md) | A list of fuels used in stationary applications | 
**natural_gas** | **float** | Amount of natural gas consumed in Mj (megajoules) | 

## Example

```python
from openapi_client.models.post_aquaculture_request_enterprises_inner_fuel import PostAquacultureRequestEnterprisesInnerFuel

# TODO update the JSON string below
json = "{}"
# create an instance of PostAquacultureRequestEnterprisesInnerFuel from a JSON string
post_aquaculture_request_enterprises_inner_fuel_instance = PostAquacultureRequestEnterprisesInnerFuel.from_json(json)
# print the JSON string representation of the object
print(PostAquacultureRequestEnterprisesInnerFuel.to_json())

# convert the object into a dict
post_aquaculture_request_enterprises_inner_fuel_dict = post_aquaculture_request_enterprises_inner_fuel_instance.to_dict()
# create an instance of PostAquacultureRequestEnterprisesInnerFuel from a dict
post_aquaculture_request_enterprises_inner_fuel_from_dict = PostAquacultureRequestEnterprisesInnerFuel.from_dict(post_aquaculture_request_enterprises_inner_fuel_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


