# openapi_client.GAFApi

All URIs are relative to *https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0*

Method | HTTP request | Description
------------- | ------------- | -------------
[**post_aquaculture**](GAFApi.md#post_aquaculture) | **POST** /aquaculture | Perform aquaculture calculation
[**post_beef**](GAFApi.md#post_beef) | **POST** /beef | Perform beef calculation
[**post_buffalo**](GAFApi.md#post_buffalo) | **POST** /buffalo | Perform buffalo calculation
[**post_cotton**](GAFApi.md#post_cotton) | **POST** /cotton | Perform cotton calculation
[**post_dairy**](GAFApi.md#post_dairy) | **POST** /dairy | Perform dairy calculation
[**post_deer**](GAFApi.md#post_deer) | **POST** /deer | Perform deer calculation
[**post_feedlot**](GAFApi.md#post_feedlot) | **POST** /feedlot | Perform feedlot calculation
[**post_goat**](GAFApi.md#post_goat) | **POST** /goat | Perform goat calculation
[**post_grains**](GAFApi.md#post_grains) | **POST** /grains | Perform grains calculation
[**post_horticulture**](GAFApi.md#post_horticulture) | **POST** /horticulture | Perform horticulture calculation
[**post_pork**](GAFApi.md#post_pork) | **POST** /pork | Perform pork calculation
[**post_poultry**](GAFApi.md#post_poultry) | **POST** /poultry | Perform poultry calculation
[**post_processing**](GAFApi.md#post_processing) | **POST** /processing | Perform processing calculation
[**post_rice**](GAFApi.md#post_rice) | **POST** /rice | Perform rice calculation
[**post_sheep**](GAFApi.md#post_sheep) | **POST** /sheep | Perform sheep calculation
[**post_sheepbeef**](GAFApi.md#post_sheepbeef) | **POST** /sheepbeef | Perform sheepbeef calculation
[**post_sugar**](GAFApi.md#post_sugar) | **POST** /sugar | Perform sugar calculation
[**post_vineyard**](GAFApi.md#post_vineyard) | **POST** /vineyard | Perform vineyard calculation
[**post_wildcatchfishery**](GAFApi.md#post_wildcatchfishery) | **POST** /wildcatchfishery | Perform wildcatchfishery calculation
[**post_wildseafisheries**](GAFApi.md#post_wildseafisheries) | **POST** /wildseafisheries | Perform wildseafisheries calculation


# **post_aquaculture**
> PostAquaculture200Response post_aquaculture(post_aquaculture_request)

Perform aquaculture calculation

Retrieve a simple JSON response

### Example


```python
import openapi_client
from openapi_client.models.post_aquaculture200_response import PostAquaculture200Response
from openapi_client.models.post_aquaculture_request import PostAquacultureRequest
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.GAFApi(api_client)
    post_aquaculture_request = openapi_client.PostAquacultureRequest() # PostAquacultureRequest | 

    try:
        # Perform aquaculture calculation
        api_response = api_instance.post_aquaculture(post_aquaculture_request)
        print("The response of GAFApi->post_aquaculture:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling GAFApi->post_aquaculture: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **post_aquaculture_request** | [**PostAquacultureRequest**](PostAquacultureRequest.md)|  | 

### Return type

[**PostAquaculture200Response**](PostAquaculture200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Executes a calculation |  -  |
**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_beef**
> PostBeef200Response post_beef(post_beef_request)

Perform beef calculation

Retrieve a simple JSON response

### Example


```python
import openapi_client
from openapi_client.models.post_beef200_response import PostBeef200Response
from openapi_client.models.post_beef_request import PostBeefRequest
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.GAFApi(api_client)
    post_beef_request = openapi_client.PostBeefRequest() # PostBeefRequest | 

    try:
        # Perform beef calculation
        api_response = api_instance.post_beef(post_beef_request)
        print("The response of GAFApi->post_beef:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling GAFApi->post_beef: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **post_beef_request** | [**PostBeefRequest**](PostBeefRequest.md)|  | 

### Return type

[**PostBeef200Response**](PostBeef200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Executes a calculation |  -  |
**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_buffalo**
> PostBuffalo200Response post_buffalo(post_buffalo_request)

Perform buffalo calculation

Retrieve a simple JSON response

### Example


```python
import openapi_client
from openapi_client.models.post_buffalo200_response import PostBuffalo200Response
from openapi_client.models.post_buffalo_request import PostBuffaloRequest
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.GAFApi(api_client)
    post_buffalo_request = openapi_client.PostBuffaloRequest() # PostBuffaloRequest | 

    try:
        # Perform buffalo calculation
        api_response = api_instance.post_buffalo(post_buffalo_request)
        print("The response of GAFApi->post_buffalo:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling GAFApi->post_buffalo: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **post_buffalo_request** | [**PostBuffaloRequest**](PostBuffaloRequest.md)|  | 

### Return type

[**PostBuffalo200Response**](PostBuffalo200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Executes a calculation |  -  |
**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_cotton**
> PostCotton200Response post_cotton(post_cotton_request)

Perform cotton calculation

Retrieve a simple JSON response

### Example


```python
import openapi_client
from openapi_client.models.post_cotton200_response import PostCotton200Response
from openapi_client.models.post_cotton_request import PostCottonRequest
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.GAFApi(api_client)
    post_cotton_request = openapi_client.PostCottonRequest() # PostCottonRequest | 

    try:
        # Perform cotton calculation
        api_response = api_instance.post_cotton(post_cotton_request)
        print("The response of GAFApi->post_cotton:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling GAFApi->post_cotton: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **post_cotton_request** | [**PostCottonRequest**](PostCottonRequest.md)|  | 

### Return type

[**PostCotton200Response**](PostCotton200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Executes a calculation |  -  |
**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_dairy**
> PostDairy200Response post_dairy(post_dairy_request)

Perform dairy calculation

Retrieve a simple JSON response

### Example


```python
import openapi_client
from openapi_client.models.post_dairy200_response import PostDairy200Response
from openapi_client.models.post_dairy_request import PostDairyRequest
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.GAFApi(api_client)
    post_dairy_request = openapi_client.PostDairyRequest() # PostDairyRequest | 

    try:
        # Perform dairy calculation
        api_response = api_instance.post_dairy(post_dairy_request)
        print("The response of GAFApi->post_dairy:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling GAFApi->post_dairy: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **post_dairy_request** | [**PostDairyRequest**](PostDairyRequest.md)|  | 

### Return type

[**PostDairy200Response**](PostDairy200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Executes a calculation |  -  |
**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_deer**
> PostDeer200Response post_deer(post_deer_request)

Perform deer calculation

Retrieve a simple JSON response

### Example


```python
import openapi_client
from openapi_client.models.post_deer200_response import PostDeer200Response
from openapi_client.models.post_deer_request import PostDeerRequest
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.GAFApi(api_client)
    post_deer_request = openapi_client.PostDeerRequest() # PostDeerRequest | 

    try:
        # Perform deer calculation
        api_response = api_instance.post_deer(post_deer_request)
        print("The response of GAFApi->post_deer:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling GAFApi->post_deer: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **post_deer_request** | [**PostDeerRequest**](PostDeerRequest.md)|  | 

### Return type

[**PostDeer200Response**](PostDeer200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Executes a calculation |  -  |
**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_feedlot**
> PostFeedlot200Response post_feedlot(post_feedlot_request)

Perform feedlot calculation

Retrieve a simple JSON response

### Example


```python
import openapi_client
from openapi_client.models.post_feedlot200_response import PostFeedlot200Response
from openapi_client.models.post_feedlot_request import PostFeedlotRequest
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.GAFApi(api_client)
    post_feedlot_request = openapi_client.PostFeedlotRequest() # PostFeedlotRequest | 

    try:
        # Perform feedlot calculation
        api_response = api_instance.post_feedlot(post_feedlot_request)
        print("The response of GAFApi->post_feedlot:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling GAFApi->post_feedlot: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **post_feedlot_request** | [**PostFeedlotRequest**](PostFeedlotRequest.md)|  | 

### Return type

[**PostFeedlot200Response**](PostFeedlot200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Executes a calculation |  -  |
**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_goat**
> PostGoat200Response post_goat(post_goat_request)

Perform goat calculation

Retrieve a simple JSON response

### Example


```python
import openapi_client
from openapi_client.models.post_goat200_response import PostGoat200Response
from openapi_client.models.post_goat_request import PostGoatRequest
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.GAFApi(api_client)
    post_goat_request = openapi_client.PostGoatRequest() # PostGoatRequest | 

    try:
        # Perform goat calculation
        api_response = api_instance.post_goat(post_goat_request)
        print("The response of GAFApi->post_goat:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling GAFApi->post_goat: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **post_goat_request** | [**PostGoatRequest**](PostGoatRequest.md)|  | 

### Return type

[**PostGoat200Response**](PostGoat200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Executes a calculation |  -  |
**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_grains**
> PostGrains200Response post_grains(post_grains_request)

Perform grains calculation

Retrieve a simple JSON response

### Example


```python
import openapi_client
from openapi_client.models.post_grains200_response import PostGrains200Response
from openapi_client.models.post_grains_request import PostGrainsRequest
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.GAFApi(api_client)
    post_grains_request = openapi_client.PostGrainsRequest() # PostGrainsRequest | 

    try:
        # Perform grains calculation
        api_response = api_instance.post_grains(post_grains_request)
        print("The response of GAFApi->post_grains:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling GAFApi->post_grains: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **post_grains_request** | [**PostGrainsRequest**](PostGrainsRequest.md)|  | 

### Return type

[**PostGrains200Response**](PostGrains200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Executes a calculation |  -  |
**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_horticulture**
> PostHorticulture200Response post_horticulture(post_horticulture_request)

Perform horticulture calculation

Retrieve a simple JSON response

### Example


```python
import openapi_client
from openapi_client.models.post_horticulture200_response import PostHorticulture200Response
from openapi_client.models.post_horticulture_request import PostHorticultureRequest
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.GAFApi(api_client)
    post_horticulture_request = openapi_client.PostHorticultureRequest() # PostHorticultureRequest | 

    try:
        # Perform horticulture calculation
        api_response = api_instance.post_horticulture(post_horticulture_request)
        print("The response of GAFApi->post_horticulture:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling GAFApi->post_horticulture: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **post_horticulture_request** | [**PostHorticultureRequest**](PostHorticultureRequest.md)|  | 

### Return type

[**PostHorticulture200Response**](PostHorticulture200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Executes a calculation |  -  |
**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_pork**
> PostPork200Response post_pork(post_pork_request)

Perform pork calculation

Retrieve a simple JSON response

### Example


```python
import openapi_client
from openapi_client.models.post_pork200_response import PostPork200Response
from openapi_client.models.post_pork_request import PostPorkRequest
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.GAFApi(api_client)
    post_pork_request = openapi_client.PostPorkRequest() # PostPorkRequest | 

    try:
        # Perform pork calculation
        api_response = api_instance.post_pork(post_pork_request)
        print("The response of GAFApi->post_pork:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling GAFApi->post_pork: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **post_pork_request** | [**PostPorkRequest**](PostPorkRequest.md)|  | 

### Return type

[**PostPork200Response**](PostPork200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Executes a calculation |  -  |
**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_poultry**
> PostPoultry200Response post_poultry(post_poultry_request)

Perform poultry calculation

Retrieve a simple JSON response

### Example


```python
import openapi_client
from openapi_client.models.post_poultry200_response import PostPoultry200Response
from openapi_client.models.post_poultry_request import PostPoultryRequest
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.GAFApi(api_client)
    post_poultry_request = openapi_client.PostPoultryRequest() # PostPoultryRequest | 

    try:
        # Perform poultry calculation
        api_response = api_instance.post_poultry(post_poultry_request)
        print("The response of GAFApi->post_poultry:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling GAFApi->post_poultry: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **post_poultry_request** | [**PostPoultryRequest**](PostPoultryRequest.md)|  | 

### Return type

[**PostPoultry200Response**](PostPoultry200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Executes a calculation |  -  |
**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_processing**
> PostProcessing200Response post_processing(post_processing_request)

Perform processing calculation

Retrieve a simple JSON response

### Example


```python
import openapi_client
from openapi_client.models.post_processing200_response import PostProcessing200Response
from openapi_client.models.post_processing_request import PostProcessingRequest
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.GAFApi(api_client)
    post_processing_request = openapi_client.PostProcessingRequest() # PostProcessingRequest | 

    try:
        # Perform processing calculation
        api_response = api_instance.post_processing(post_processing_request)
        print("The response of GAFApi->post_processing:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling GAFApi->post_processing: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **post_processing_request** | [**PostProcessingRequest**](PostProcessingRequest.md)|  | 

### Return type

[**PostProcessing200Response**](PostProcessing200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Executes a calculation |  -  |
**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_rice**
> PostRice200Response post_rice(post_rice_request)

Perform rice calculation

Retrieve a simple JSON response

### Example


```python
import openapi_client
from openapi_client.models.post_rice200_response import PostRice200Response
from openapi_client.models.post_rice_request import PostRiceRequest
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.GAFApi(api_client)
    post_rice_request = openapi_client.PostRiceRequest() # PostRiceRequest | 

    try:
        # Perform rice calculation
        api_response = api_instance.post_rice(post_rice_request)
        print("The response of GAFApi->post_rice:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling GAFApi->post_rice: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **post_rice_request** | [**PostRiceRequest**](PostRiceRequest.md)|  | 

### Return type

[**PostRice200Response**](PostRice200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Executes a calculation |  -  |
**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_sheep**
> PostSheep200Response post_sheep(post_sheep_request)

Perform sheep calculation

Retrieve a simple JSON response

### Example


```python
import openapi_client
from openapi_client.models.post_sheep200_response import PostSheep200Response
from openapi_client.models.post_sheep_request import PostSheepRequest
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.GAFApi(api_client)
    post_sheep_request = openapi_client.PostSheepRequest() # PostSheepRequest | 

    try:
        # Perform sheep calculation
        api_response = api_instance.post_sheep(post_sheep_request)
        print("The response of GAFApi->post_sheep:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling GAFApi->post_sheep: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **post_sheep_request** | [**PostSheepRequest**](PostSheepRequest.md)|  | 

### Return type

[**PostSheep200Response**](PostSheep200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Executes a calculation |  -  |
**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_sheepbeef**
> PostSheepbeef200Response post_sheepbeef(post_sheepbeef_request)

Perform sheepbeef calculation

Retrieve a simple JSON response

### Example


```python
import openapi_client
from openapi_client.models.post_sheepbeef200_response import PostSheepbeef200Response
from openapi_client.models.post_sheepbeef_request import PostSheepbeefRequest
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.GAFApi(api_client)
    post_sheepbeef_request = openapi_client.PostSheepbeefRequest() # PostSheepbeefRequest | 

    try:
        # Perform sheepbeef calculation
        api_response = api_instance.post_sheepbeef(post_sheepbeef_request)
        print("The response of GAFApi->post_sheepbeef:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling GAFApi->post_sheepbeef: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **post_sheepbeef_request** | [**PostSheepbeefRequest**](PostSheepbeefRequest.md)|  | 

### Return type

[**PostSheepbeef200Response**](PostSheepbeef200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Executes a calculation |  -  |
**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_sugar**
> PostSugar200Response post_sugar(post_sugar_request)

Perform sugar calculation

Retrieve a simple JSON response

### Example


```python
import openapi_client
from openapi_client.models.post_sugar200_response import PostSugar200Response
from openapi_client.models.post_sugar_request import PostSugarRequest
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.GAFApi(api_client)
    post_sugar_request = openapi_client.PostSugarRequest() # PostSugarRequest | 

    try:
        # Perform sugar calculation
        api_response = api_instance.post_sugar(post_sugar_request)
        print("The response of GAFApi->post_sugar:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling GAFApi->post_sugar: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **post_sugar_request** | [**PostSugarRequest**](PostSugarRequest.md)|  | 

### Return type

[**PostSugar200Response**](PostSugar200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Executes a calculation |  -  |
**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_vineyard**
> PostVineyard200Response post_vineyard(post_vineyard_request)

Perform vineyard calculation

Retrieve a simple JSON response

### Example


```python
import openapi_client
from openapi_client.models.post_vineyard200_response import PostVineyard200Response
from openapi_client.models.post_vineyard_request import PostVineyardRequest
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.GAFApi(api_client)
    post_vineyard_request = openapi_client.PostVineyardRequest() # PostVineyardRequest | 

    try:
        # Perform vineyard calculation
        api_response = api_instance.post_vineyard(post_vineyard_request)
        print("The response of GAFApi->post_vineyard:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling GAFApi->post_vineyard: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **post_vineyard_request** | [**PostVineyardRequest**](PostVineyardRequest.md)|  | 

### Return type

[**PostVineyard200Response**](PostVineyard200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Executes a calculation |  -  |
**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_wildcatchfishery**
> PostWildcatchfishery200Response post_wildcatchfishery(post_wildcatchfishery_request)

Perform wildcatchfishery calculation

Retrieve a simple JSON response

### Example


```python
import openapi_client
from openapi_client.models.post_wildcatchfishery200_response import PostWildcatchfishery200Response
from openapi_client.models.post_wildcatchfishery_request import PostWildcatchfisheryRequest
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.GAFApi(api_client)
    post_wildcatchfishery_request = openapi_client.PostWildcatchfisheryRequest() # PostWildcatchfisheryRequest | 

    try:
        # Perform wildcatchfishery calculation
        api_response = api_instance.post_wildcatchfishery(post_wildcatchfishery_request)
        print("The response of GAFApi->post_wildcatchfishery:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling GAFApi->post_wildcatchfishery: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **post_wildcatchfishery_request** | [**PostWildcatchfisheryRequest**](PostWildcatchfisheryRequest.md)|  | 

### Return type

[**PostWildcatchfishery200Response**](PostWildcatchfishery200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Executes a calculation |  -  |
**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_wildseafisheries**
> PostWildseafisheries200Response post_wildseafisheries(post_wildseafisheries_request)

Perform wildseafisheries calculation

Retrieve a simple JSON response

### Example


```python
import openapi_client
from openapi_client.models.post_wildseafisheries200_response import PostWildseafisheries200Response
from openapi_client.models.post_wildseafisheries_request import PostWildseafisheriesRequest
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.GAFApi(api_client)
    post_wildseafisheries_request = openapi_client.PostWildseafisheriesRequest() # PostWildseafisheriesRequest | 

    try:
        # Perform wildseafisheries calculation
        api_response = api_instance.post_wildseafisheries(post_wildseafisheries_request)
        print("The response of GAFApi->post_wildseafisheries:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling GAFApi->post_wildseafisheries: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **post_wildseafisheries_request** | [**PostWildseafisheriesRequest**](PostWildseafisheriesRequest.md)|  | 

### Return type

[**PostWildseafisheries200Response**](PostWildseafisheries200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Executes a calculation |  -  |
**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

