# PostFeedlot200Response

Emissions calculation output for the `feedlot` calculator

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**scope1** | [**PostFeedlot200ResponseScope1**](PostFeedlot200ResponseScope1.md) |  | 
**scope2** | [**PostAquaculture200ResponseScope2**](PostAquaculture200ResponseScope2.md) |  | 
**scope3** | [**PostFeedlot200ResponseScope3**](PostFeedlot200ResponseScope3.md) |  | 
**carbon_sequestration** | [**PostAquaculture200ResponseCarbonSequestration**](PostAquaculture200ResponseCarbonSequestration.md) |  | 
**intermediate** | [**List[PostFeedlot200ResponseIntermediateInner]**](PostFeedlot200ResponseIntermediateInner.md) |  | 
**net** | [**PostFeedlot200ResponseIntermediateInnerNet**](PostFeedlot200ResponseIntermediateInnerNet.md) |  | 
**intensities** | [**PostFeedlot200ResponseIntermediateInnerIntensities**](PostFeedlot200ResponseIntermediateInnerIntensities.md) |  | 

## Example

```python
from openapi_client.models.post_feedlot200_response import PostFeedlot200Response

# TODO update the JSON string below
json = "{}"
# create an instance of PostFeedlot200Response from a JSON string
post_feedlot200_response_instance = PostFeedlot200Response.from_json(json)
# print the JSON string representation of the object
print(PostFeedlot200Response.to_json())

# convert the object into a dict
post_feedlot200_response_dict = post_feedlot200_response_instance.to_dict()
# create an instance of PostFeedlot200Response from a dict
post_feedlot200_response_from_dict = PostFeedlot200Response.from_dict(post_feedlot200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


