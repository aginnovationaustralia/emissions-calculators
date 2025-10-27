# PostWildseafisheriesRequestEnterprisesInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | Unique identifier for this activity | [optional] 
**state** | **str** | What state the location is in. Note: Western Australia is split up into two regions, &#x60;wa_nw&#x60; is North-West Western Australia, &#x60;wa_sw&#x60; is South-West Western Australia | 
**electricity_source** | **str** | Source of electricity | 
**electricity_renewable** | **float** | Percent of total electricity usage that is drawn from renewable sources, between 0 and 1. Unused if &#x60;electricitySource&#x60; is &#x60;Renewable&#x60; | 
**electricity_use** | **float** | Electricity use in KWh (kilowatt hours) | 
**total_whole_weight_caught** | **float** | Total whole weight caught in kg | 
**diesel** | **float** | Diesel usage in L (litres) | 
**petrol** | **float** | Petrol usage in L (litres) | 
**lpg** | **float** | LPG Fuel usage in L (litres) | 
**refrigerants** | [**List[PostWildseafisheriesRequestEnterprisesInnerRefrigerantsInner]**](PostWildseafisheriesRequestEnterprisesInnerRefrigerantsInner.md) |  | 
**transports** | [**List[PostWildseafisheriesRequestEnterprisesInnerTransportsInner]**](PostWildseafisheriesRequestEnterprisesInnerTransportsInner.md) | Transportation | 
**flights** | [**List[PostWildseafisheriesRequestEnterprisesInnerFlightsInner]**](PostWildseafisheriesRequestEnterprisesInnerFlightsInner.md) | CommercialFlight | 
**bait** | [**List[PostWildseafisheriesRequestEnterprisesInnerBaitInner]**](PostWildseafisheriesRequestEnterprisesInnerBaitInner.md) | Bait | 
**custombait** | [**List[PostWildseafisheriesRequestEnterprisesInnerCustombaitInner]**](PostWildseafisheriesRequestEnterprisesInnerCustombaitInner.md) | Custom bait | 
**carbon_offset** | **float** | Carbon offsets purchased, in t CO2. Offsetting 2 t CO2 would be 2.0 (not -2.0) | 

## Example

```python
from openapi_client.models.post_wildseafisheries_request_enterprises_inner import PostWildseafisheriesRequestEnterprisesInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostWildseafisheriesRequestEnterprisesInner from a JSON string
post_wildseafisheries_request_enterprises_inner_instance = PostWildseafisheriesRequestEnterprisesInner.from_json(json)
# print the JSON string representation of the object
print(PostWildseafisheriesRequestEnterprisesInner.to_json())

# convert the object into a dict
post_wildseafisheries_request_enterprises_inner_dict = post_wildseafisheries_request_enterprises_inner_instance.to_dict()
# create an instance of PostWildseafisheriesRequestEnterprisesInner from a dict
post_wildseafisheries_request_enterprises_inner_from_dict = PostWildseafisheriesRequestEnterprisesInner.from_dict(post_wildseafisheries_request_enterprises_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


