# OpenAPI\Client\GAFApi

All URIs are relative to https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**postAquaculture()**](GAFApi.md#postAquaculture) | **POST** /aquaculture | Perform aquaculture calculation |
| [**postBeef()**](GAFApi.md#postBeef) | **POST** /beef | Perform beef calculation |
| [**postBuffalo()**](GAFApi.md#postBuffalo) | **POST** /buffalo | Perform buffalo calculation |
| [**postCotton()**](GAFApi.md#postCotton) | **POST** /cotton | Perform cotton calculation |
| [**postDairy()**](GAFApi.md#postDairy) | **POST** /dairy | Perform dairy calculation |
| [**postDeer()**](GAFApi.md#postDeer) | **POST** /deer | Perform deer calculation |
| [**postFeedlot()**](GAFApi.md#postFeedlot) | **POST** /feedlot | Perform feedlot calculation |
| [**postGoat()**](GAFApi.md#postGoat) | **POST** /goat | Perform goat calculation |
| [**postGrains()**](GAFApi.md#postGrains) | **POST** /grains | Perform grains calculation |
| [**postHorticulture()**](GAFApi.md#postHorticulture) | **POST** /horticulture | Perform horticulture calculation |
| [**postPork()**](GAFApi.md#postPork) | **POST** /pork | Perform pork calculation |
| [**postPoultry()**](GAFApi.md#postPoultry) | **POST** /poultry | Perform poultry calculation |
| [**postProcessing()**](GAFApi.md#postProcessing) | **POST** /processing | Perform processing calculation |
| [**postRice()**](GAFApi.md#postRice) | **POST** /rice | Perform rice calculation |
| [**postSheep()**](GAFApi.md#postSheep) | **POST** /sheep | Perform sheep calculation |
| [**postSheepbeef()**](GAFApi.md#postSheepbeef) | **POST** /sheepbeef | Perform sheepbeef calculation |
| [**postSugar()**](GAFApi.md#postSugar) | **POST** /sugar | Perform sugar calculation |
| [**postVineyard()**](GAFApi.md#postVineyard) | **POST** /vineyard | Perform vineyard calculation |
| [**postWildcatchfishery()**](GAFApi.md#postWildcatchfishery) | **POST** /wildcatchfishery | Perform wildcatchfishery calculation |
| [**postWildseafisheries()**](GAFApi.md#postWildseafisheries) | **POST** /wildseafisheries | Perform wildseafisheries calculation |


## `postAquaculture()`

```php
postAquaculture($post_aquaculture_request): \OpenAPI\Client\Model\PostAquaculture200Response
```

Perform aquaculture calculation

Retrieve a simple JSON response

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new OpenAPI\Client\Api\GAFApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$post_aquaculture_request = new \OpenAPI\Client\Model\PostAquacultureRequest(); // \OpenAPI\Client\Model\PostAquacultureRequest

try {
    $result = $apiInstance->postAquaculture($post_aquaculture_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling GAFApi->postAquaculture: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **post_aquaculture_request** | [**\OpenAPI\Client\Model\PostAquacultureRequest**](../Model/PostAquacultureRequest.md)|  | |

### Return type

[**\OpenAPI\Client\Model\PostAquaculture200Response**](../Model/PostAquaculture200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `postBeef()`

```php
postBeef($post_beef_request): \OpenAPI\Client\Model\PostBeef200Response
```

Perform beef calculation

Retrieve a simple JSON response

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new OpenAPI\Client\Api\GAFApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$post_beef_request = new \OpenAPI\Client\Model\PostBeefRequest(); // \OpenAPI\Client\Model\PostBeefRequest

try {
    $result = $apiInstance->postBeef($post_beef_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling GAFApi->postBeef: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **post_beef_request** | [**\OpenAPI\Client\Model\PostBeefRequest**](../Model/PostBeefRequest.md)|  | |

### Return type

[**\OpenAPI\Client\Model\PostBeef200Response**](../Model/PostBeef200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `postBuffalo()`

```php
postBuffalo($post_buffalo_request): \OpenAPI\Client\Model\PostBuffalo200Response
```

Perform buffalo calculation

Retrieve a simple JSON response

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new OpenAPI\Client\Api\GAFApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$post_buffalo_request = new \OpenAPI\Client\Model\PostBuffaloRequest(); // \OpenAPI\Client\Model\PostBuffaloRequest

try {
    $result = $apiInstance->postBuffalo($post_buffalo_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling GAFApi->postBuffalo: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **post_buffalo_request** | [**\OpenAPI\Client\Model\PostBuffaloRequest**](../Model/PostBuffaloRequest.md)|  | |

### Return type

[**\OpenAPI\Client\Model\PostBuffalo200Response**](../Model/PostBuffalo200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `postCotton()`

```php
postCotton($post_cotton_request): \OpenAPI\Client\Model\PostCotton200Response
```

Perform cotton calculation

Retrieve a simple JSON response

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new OpenAPI\Client\Api\GAFApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$post_cotton_request = new \OpenAPI\Client\Model\PostCottonRequest(); // \OpenAPI\Client\Model\PostCottonRequest

try {
    $result = $apiInstance->postCotton($post_cotton_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling GAFApi->postCotton: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **post_cotton_request** | [**\OpenAPI\Client\Model\PostCottonRequest**](../Model/PostCottonRequest.md)|  | |

### Return type

[**\OpenAPI\Client\Model\PostCotton200Response**](../Model/PostCotton200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `postDairy()`

```php
postDairy($post_dairy_request): \OpenAPI\Client\Model\PostDairy200Response
```

Perform dairy calculation

Retrieve a simple JSON response

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new OpenAPI\Client\Api\GAFApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$post_dairy_request = new \OpenAPI\Client\Model\PostDairyRequest(); // \OpenAPI\Client\Model\PostDairyRequest

try {
    $result = $apiInstance->postDairy($post_dairy_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling GAFApi->postDairy: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **post_dairy_request** | [**\OpenAPI\Client\Model\PostDairyRequest**](../Model/PostDairyRequest.md)|  | |

### Return type

[**\OpenAPI\Client\Model\PostDairy200Response**](../Model/PostDairy200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `postDeer()`

```php
postDeer($post_deer_request): \OpenAPI\Client\Model\PostDeer200Response
```

Perform deer calculation

Retrieve a simple JSON response

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new OpenAPI\Client\Api\GAFApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$post_deer_request = new \OpenAPI\Client\Model\PostDeerRequest(); // \OpenAPI\Client\Model\PostDeerRequest

try {
    $result = $apiInstance->postDeer($post_deer_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling GAFApi->postDeer: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **post_deer_request** | [**\OpenAPI\Client\Model\PostDeerRequest**](../Model/PostDeerRequest.md)|  | |

### Return type

[**\OpenAPI\Client\Model\PostDeer200Response**](../Model/PostDeer200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `postFeedlot()`

```php
postFeedlot($post_feedlot_request): \OpenAPI\Client\Model\PostFeedlot200Response
```

Perform feedlot calculation

Retrieve a simple JSON response

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new OpenAPI\Client\Api\GAFApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$post_feedlot_request = new \OpenAPI\Client\Model\PostFeedlotRequest(); // \OpenAPI\Client\Model\PostFeedlotRequest

try {
    $result = $apiInstance->postFeedlot($post_feedlot_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling GAFApi->postFeedlot: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **post_feedlot_request** | [**\OpenAPI\Client\Model\PostFeedlotRequest**](../Model/PostFeedlotRequest.md)|  | |

### Return type

[**\OpenAPI\Client\Model\PostFeedlot200Response**](../Model/PostFeedlot200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `postGoat()`

```php
postGoat($post_goat_request): \OpenAPI\Client\Model\PostGoat200Response
```

Perform goat calculation

Retrieve a simple JSON response

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new OpenAPI\Client\Api\GAFApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$post_goat_request = new \OpenAPI\Client\Model\PostGoatRequest(); // \OpenAPI\Client\Model\PostGoatRequest

try {
    $result = $apiInstance->postGoat($post_goat_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling GAFApi->postGoat: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **post_goat_request** | [**\OpenAPI\Client\Model\PostGoatRequest**](../Model/PostGoatRequest.md)|  | |

### Return type

[**\OpenAPI\Client\Model\PostGoat200Response**](../Model/PostGoat200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `postGrains()`

```php
postGrains($post_grains_request): \OpenAPI\Client\Model\PostGrains200Response
```

Perform grains calculation

Retrieve a simple JSON response

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new OpenAPI\Client\Api\GAFApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$post_grains_request = new \OpenAPI\Client\Model\PostGrainsRequest(); // \OpenAPI\Client\Model\PostGrainsRequest

try {
    $result = $apiInstance->postGrains($post_grains_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling GAFApi->postGrains: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **post_grains_request** | [**\OpenAPI\Client\Model\PostGrainsRequest**](../Model/PostGrainsRequest.md)|  | |

### Return type

[**\OpenAPI\Client\Model\PostGrains200Response**](../Model/PostGrains200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `postHorticulture()`

```php
postHorticulture($post_horticulture_request): \OpenAPI\Client\Model\PostHorticulture200Response
```

Perform horticulture calculation

Retrieve a simple JSON response

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new OpenAPI\Client\Api\GAFApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$post_horticulture_request = new \OpenAPI\Client\Model\PostHorticultureRequest(); // \OpenAPI\Client\Model\PostHorticultureRequest

try {
    $result = $apiInstance->postHorticulture($post_horticulture_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling GAFApi->postHorticulture: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **post_horticulture_request** | [**\OpenAPI\Client\Model\PostHorticultureRequest**](../Model/PostHorticultureRequest.md)|  | |

### Return type

[**\OpenAPI\Client\Model\PostHorticulture200Response**](../Model/PostHorticulture200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `postPork()`

```php
postPork($post_pork_request): \OpenAPI\Client\Model\PostPork200Response
```

Perform pork calculation

Retrieve a simple JSON response

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new OpenAPI\Client\Api\GAFApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$post_pork_request = new \OpenAPI\Client\Model\PostPorkRequest(); // \OpenAPI\Client\Model\PostPorkRequest

try {
    $result = $apiInstance->postPork($post_pork_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling GAFApi->postPork: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **post_pork_request** | [**\OpenAPI\Client\Model\PostPorkRequest**](../Model/PostPorkRequest.md)|  | |

### Return type

[**\OpenAPI\Client\Model\PostPork200Response**](../Model/PostPork200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `postPoultry()`

```php
postPoultry($post_poultry_request): \OpenAPI\Client\Model\PostPoultry200Response
```

Perform poultry calculation

Retrieve a simple JSON response

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new OpenAPI\Client\Api\GAFApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$post_poultry_request = new \OpenAPI\Client\Model\PostPoultryRequest(); // \OpenAPI\Client\Model\PostPoultryRequest

try {
    $result = $apiInstance->postPoultry($post_poultry_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling GAFApi->postPoultry: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **post_poultry_request** | [**\OpenAPI\Client\Model\PostPoultryRequest**](../Model/PostPoultryRequest.md)|  | |

### Return type

[**\OpenAPI\Client\Model\PostPoultry200Response**](../Model/PostPoultry200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `postProcessing()`

```php
postProcessing($post_processing_request): \OpenAPI\Client\Model\PostProcessing200Response
```

Perform processing calculation

Retrieve a simple JSON response

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new OpenAPI\Client\Api\GAFApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$post_processing_request = new \OpenAPI\Client\Model\PostProcessingRequest(); // \OpenAPI\Client\Model\PostProcessingRequest

try {
    $result = $apiInstance->postProcessing($post_processing_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling GAFApi->postProcessing: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **post_processing_request** | [**\OpenAPI\Client\Model\PostProcessingRequest**](../Model/PostProcessingRequest.md)|  | |

### Return type

[**\OpenAPI\Client\Model\PostProcessing200Response**](../Model/PostProcessing200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `postRice()`

```php
postRice($post_rice_request): \OpenAPI\Client\Model\PostRice200Response
```

Perform rice calculation

Retrieve a simple JSON response

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new OpenAPI\Client\Api\GAFApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$post_rice_request = new \OpenAPI\Client\Model\PostRiceRequest(); // \OpenAPI\Client\Model\PostRiceRequest

try {
    $result = $apiInstance->postRice($post_rice_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling GAFApi->postRice: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **post_rice_request** | [**\OpenAPI\Client\Model\PostRiceRequest**](../Model/PostRiceRequest.md)|  | |

### Return type

[**\OpenAPI\Client\Model\PostRice200Response**](../Model/PostRice200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `postSheep()`

```php
postSheep($post_sheep_request): \OpenAPI\Client\Model\PostSheep200Response
```

Perform sheep calculation

Retrieve a simple JSON response

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new OpenAPI\Client\Api\GAFApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$post_sheep_request = new \OpenAPI\Client\Model\PostSheepRequest(); // \OpenAPI\Client\Model\PostSheepRequest

try {
    $result = $apiInstance->postSheep($post_sheep_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling GAFApi->postSheep: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **post_sheep_request** | [**\OpenAPI\Client\Model\PostSheepRequest**](../Model/PostSheepRequest.md)|  | |

### Return type

[**\OpenAPI\Client\Model\PostSheep200Response**](../Model/PostSheep200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `postSheepbeef()`

```php
postSheepbeef($post_sheepbeef_request): \OpenAPI\Client\Model\PostSheepbeef200Response
```

Perform sheepbeef calculation

Retrieve a simple JSON response

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new OpenAPI\Client\Api\GAFApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$post_sheepbeef_request = new \OpenAPI\Client\Model\PostSheepbeefRequest(); // \OpenAPI\Client\Model\PostSheepbeefRequest

try {
    $result = $apiInstance->postSheepbeef($post_sheepbeef_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling GAFApi->postSheepbeef: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **post_sheepbeef_request** | [**\OpenAPI\Client\Model\PostSheepbeefRequest**](../Model/PostSheepbeefRequest.md)|  | |

### Return type

[**\OpenAPI\Client\Model\PostSheepbeef200Response**](../Model/PostSheepbeef200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `postSugar()`

```php
postSugar($post_sugar_request): \OpenAPI\Client\Model\PostSugar200Response
```

Perform sugar calculation

Retrieve a simple JSON response

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new OpenAPI\Client\Api\GAFApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$post_sugar_request = new \OpenAPI\Client\Model\PostSugarRequest(); // \OpenAPI\Client\Model\PostSugarRequest

try {
    $result = $apiInstance->postSugar($post_sugar_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling GAFApi->postSugar: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **post_sugar_request** | [**\OpenAPI\Client\Model\PostSugarRequest**](../Model/PostSugarRequest.md)|  | |

### Return type

[**\OpenAPI\Client\Model\PostSugar200Response**](../Model/PostSugar200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `postVineyard()`

```php
postVineyard($post_vineyard_request): \OpenAPI\Client\Model\PostVineyard200Response
```

Perform vineyard calculation

Retrieve a simple JSON response

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new OpenAPI\Client\Api\GAFApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$post_vineyard_request = new \OpenAPI\Client\Model\PostVineyardRequest(); // \OpenAPI\Client\Model\PostVineyardRequest

try {
    $result = $apiInstance->postVineyard($post_vineyard_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling GAFApi->postVineyard: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **post_vineyard_request** | [**\OpenAPI\Client\Model\PostVineyardRequest**](../Model/PostVineyardRequest.md)|  | |

### Return type

[**\OpenAPI\Client\Model\PostVineyard200Response**](../Model/PostVineyard200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `postWildcatchfishery()`

```php
postWildcatchfishery($post_wildcatchfishery_request): \OpenAPI\Client\Model\PostWildcatchfishery200Response
```

Perform wildcatchfishery calculation

Retrieve a simple JSON response

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new OpenAPI\Client\Api\GAFApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$post_wildcatchfishery_request = new \OpenAPI\Client\Model\PostWildcatchfisheryRequest(); // \OpenAPI\Client\Model\PostWildcatchfisheryRequest

try {
    $result = $apiInstance->postWildcatchfishery($post_wildcatchfishery_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling GAFApi->postWildcatchfishery: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **post_wildcatchfishery_request** | [**\OpenAPI\Client\Model\PostWildcatchfisheryRequest**](../Model/PostWildcatchfisheryRequest.md)|  | |

### Return type

[**\OpenAPI\Client\Model\PostWildcatchfishery200Response**](../Model/PostWildcatchfishery200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `postWildseafisheries()`

```php
postWildseafisheries($post_wildseafisheries_request): \OpenAPI\Client\Model\PostWildseafisheries200Response
```

Perform wildseafisheries calculation

Retrieve a simple JSON response

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new OpenAPI\Client\Api\GAFApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$post_wildseafisheries_request = new \OpenAPI\Client\Model\PostWildseafisheriesRequest(); // \OpenAPI\Client\Model\PostWildseafisheriesRequest

try {
    $result = $apiInstance->postWildseafisheries($post_wildseafisheries_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling GAFApi->postWildseafisheries: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **post_wildseafisheries_request** | [**\OpenAPI\Client\Model\PostWildseafisheriesRequest**](../Model/PostWildseafisheriesRequest.md)|  | |

### Return type

[**\OpenAPI\Client\Model\PostWildseafisheries200Response**](../Model/PostWildseafisheries200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
