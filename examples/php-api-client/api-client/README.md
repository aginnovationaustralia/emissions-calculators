# OpenAPIClient-php

Emissions Calculators for various farming activities

For more information, please visit [https://aginnovationaustralia.com.au/contact-us/](https://aginnovationaustralia.com.au/contact-us/).

## Installation & Usage

### Requirements

PHP 8.1 and later.

### Composer

To install the bindings via [Composer](https://getcomposer.org/), add the following to `composer.json`:

```json
{
  "repositories": [
    {
      "type": "vcs",
      "url": "https://github.com/GIT_USER_ID/GIT_REPO_ID.git"
    }
  ],
  "require": {
    "GIT_USER_ID/GIT_REPO_ID": "*@dev"
  }
}
```

Then run `composer install`

### Manual Installation

Download the files and include `autoload.php`:

```php
<?php
require_once('/path/to/OpenAPIClient-php/vendor/autoload.php');
```

## Getting Started

Please follow the [installation procedure](#installation--usage) and then run the following:

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

## API Endpoints

All URIs are relative to *https://emissionscalculator-mtls.development.aiaapi.com/calculator/3.0.0*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*GAFApi* | [**postAquaculture**](docs/Api/GAFApi.md#postaquaculture) | **POST** /aquaculture | Perform aquaculture calculation
*GAFApi* | [**postBeef**](docs/Api/GAFApi.md#postbeef) | **POST** /beef | Perform beef calculation
*GAFApi* | [**postBuffalo**](docs/Api/GAFApi.md#postbuffalo) | **POST** /buffalo | Perform buffalo calculation
*GAFApi* | [**postCotton**](docs/Api/GAFApi.md#postcotton) | **POST** /cotton | Perform cotton calculation
*GAFApi* | [**postDairy**](docs/Api/GAFApi.md#postdairy) | **POST** /dairy | Perform dairy calculation
*GAFApi* | [**postDeer**](docs/Api/GAFApi.md#postdeer) | **POST** /deer | Perform deer calculation
*GAFApi* | [**postFeedlot**](docs/Api/GAFApi.md#postfeedlot) | **POST** /feedlot | Perform feedlot calculation
*GAFApi* | [**postGoat**](docs/Api/GAFApi.md#postgoat) | **POST** /goat | Perform goat calculation
*GAFApi* | [**postGrains**](docs/Api/GAFApi.md#postgrains) | **POST** /grains | Perform grains calculation
*GAFApi* | [**postHorticulture**](docs/Api/GAFApi.md#posthorticulture) | **POST** /horticulture | Perform horticulture calculation
*GAFApi* | [**postPork**](docs/Api/GAFApi.md#postpork) | **POST** /pork | Perform pork calculation
*GAFApi* | [**postPoultry**](docs/Api/GAFApi.md#postpoultry) | **POST** /poultry | Perform poultry calculation
*GAFApi* | [**postProcessing**](docs/Api/GAFApi.md#postprocessing) | **POST** /processing | Perform processing calculation
*GAFApi* | [**postRice**](docs/Api/GAFApi.md#postrice) | **POST** /rice | Perform rice calculation
*GAFApi* | [**postSheep**](docs/Api/GAFApi.md#postsheep) | **POST** /sheep | Perform sheep calculation
*GAFApi* | [**postSheepbeef**](docs/Api/GAFApi.md#postsheepbeef) | **POST** /sheepbeef | Perform sheepbeef calculation
*GAFApi* | [**postSugar**](docs/Api/GAFApi.md#postsugar) | **POST** /sugar | Perform sugar calculation
*GAFApi* | [**postVineyard**](docs/Api/GAFApi.md#postvineyard) | **POST** /vineyard | Perform vineyard calculation
*GAFApi* | [**postWildcatchfishery**](docs/Api/GAFApi.md#postwildcatchfishery) | **POST** /wildcatchfishery | Perform wildcatchfishery calculation
*GAFApi* | [**postWildseafisheries**](docs/Api/GAFApi.md#postwildseafisheries) | **POST** /wildseafisheries | Perform wildseafisheries calculation

## Models

- [PostAquaculture200Response](docs/Model/PostAquaculture200Response.md)
- [PostAquaculture200ResponseCarbonSequestration](docs/Model/PostAquaculture200ResponseCarbonSequestration.md)
- [PostAquaculture200ResponseIntensities](docs/Model/PostAquaculture200ResponseIntensities.md)
- [PostAquaculture200ResponseIntermediateInner](docs/Model/PostAquaculture200ResponseIntermediateInner.md)
- [PostAquaculture200ResponseIntermediateInnerCarbonSequestration](docs/Model/PostAquaculture200ResponseIntermediateInnerCarbonSequestration.md)
- [PostAquaculture200ResponseNet](docs/Model/PostAquaculture200ResponseNet.md)
- [PostAquaculture200ResponsePurchasedOffsets](docs/Model/PostAquaculture200ResponsePurchasedOffsets.md)
- [PostAquaculture200ResponseScope1](docs/Model/PostAquaculture200ResponseScope1.md)
- [PostAquaculture200ResponseScope2](docs/Model/PostAquaculture200ResponseScope2.md)
- [PostAquaculture200ResponseScope3](docs/Model/PostAquaculture200ResponseScope3.md)
- [PostAquacultureRequest](docs/Model/PostAquacultureRequest.md)
- [PostAquacultureRequestEnterprisesInner](docs/Model/PostAquacultureRequestEnterprisesInner.md)
- [PostAquacultureRequestEnterprisesInnerBaitInner](docs/Model/PostAquacultureRequestEnterprisesInnerBaitInner.md)
- [PostAquacultureRequestEnterprisesInnerCustomBaitInner](docs/Model/PostAquacultureRequestEnterprisesInnerCustomBaitInner.md)
- [PostAquacultureRequestEnterprisesInnerFluidWasteInner](docs/Model/PostAquacultureRequestEnterprisesInnerFluidWasteInner.md)
- [PostAquacultureRequestEnterprisesInnerFuel](docs/Model/PostAquacultureRequestEnterprisesInnerFuel.md)
- [PostAquacultureRequestEnterprisesInnerFuelStationaryFuelInner](docs/Model/PostAquacultureRequestEnterprisesInnerFuelStationaryFuelInner.md)
- [PostAquacultureRequestEnterprisesInnerFuelTransportFuelInner](docs/Model/PostAquacultureRequestEnterprisesInnerFuelTransportFuelInner.md)
- [PostAquacultureRequestEnterprisesInnerInboundFreightInner](docs/Model/PostAquacultureRequestEnterprisesInnerInboundFreightInner.md)
- [PostAquacultureRequestEnterprisesInnerRefrigerantsInner](docs/Model/PostAquacultureRequestEnterprisesInnerRefrigerantsInner.md)
- [PostAquacultureRequestEnterprisesInnerSolidWaste](docs/Model/PostAquacultureRequestEnterprisesInnerSolidWaste.md)
- [PostBeef200Response](docs/Model/PostBeef200Response.md)
- [PostBeef200ResponseIntermediateInner](docs/Model/PostBeef200ResponseIntermediateInner.md)
- [PostBeef200ResponseIntermediateInnerIntensities](docs/Model/PostBeef200ResponseIntermediateInnerIntensities.md)
- [PostBeef200ResponseNet](docs/Model/PostBeef200ResponseNet.md)
- [PostBeef200ResponseScope1](docs/Model/PostBeef200ResponseScope1.md)
- [PostBeef200ResponseScope3](docs/Model/PostBeef200ResponseScope3.md)
- [PostBeefRequest](docs/Model/PostBeefRequest.md)
- [PostBeefRequestBeefInner](docs/Model/PostBeefRequestBeefInner.md)
- [PostBeefRequestBeefInnerClasses](docs/Model/PostBeefRequestBeefInnerClasses.md)
- [PostBeefRequestBeefInnerClassesBullsGt1](docs/Model/PostBeefRequestBeefInnerClassesBullsGt1.md)
- [PostBeefRequestBeefInnerClassesBullsGt1Autumn](docs/Model/PostBeefRequestBeefInnerClassesBullsGt1Autumn.md)
- [PostBeefRequestBeefInnerClassesBullsGt1PurchasesInner](docs/Model/PostBeefRequestBeefInnerClassesBullsGt1PurchasesInner.md)
- [PostBeefRequestBeefInnerClassesBullsGt1Traded](docs/Model/PostBeefRequestBeefInnerClassesBullsGt1Traded.md)
- [PostBeefRequestBeefInnerClassesCowsGt2](docs/Model/PostBeefRequestBeefInnerClassesCowsGt2.md)
- [PostBeefRequestBeefInnerClassesCowsGt2Traded](docs/Model/PostBeefRequestBeefInnerClassesCowsGt2Traded.md)
- [PostBeefRequestBeefInnerClassesHeifers1To2](docs/Model/PostBeefRequestBeefInnerClassesHeifers1To2.md)
- [PostBeefRequestBeefInnerClassesHeifers1To2Traded](docs/Model/PostBeefRequestBeefInnerClassesHeifers1To2Traded.md)
- [PostBeefRequestBeefInnerClassesHeifersGt2](docs/Model/PostBeefRequestBeefInnerClassesHeifersGt2.md)
- [PostBeefRequestBeefInnerClassesHeifersGt2Traded](docs/Model/PostBeefRequestBeefInnerClassesHeifersGt2Traded.md)
- [PostBeefRequestBeefInnerClassesHeifersLt1](docs/Model/PostBeefRequestBeefInnerClassesHeifersLt1.md)
- [PostBeefRequestBeefInnerClassesHeifersLt1Traded](docs/Model/PostBeefRequestBeefInnerClassesHeifersLt1Traded.md)
- [PostBeefRequestBeefInnerClassesSteers1To2](docs/Model/PostBeefRequestBeefInnerClassesSteers1To2.md)
- [PostBeefRequestBeefInnerClassesSteers1To2Traded](docs/Model/PostBeefRequestBeefInnerClassesSteers1To2Traded.md)
- [PostBeefRequestBeefInnerClassesSteersGt2](docs/Model/PostBeefRequestBeefInnerClassesSteersGt2.md)
- [PostBeefRequestBeefInnerClassesSteersGt2Traded](docs/Model/PostBeefRequestBeefInnerClassesSteersGt2Traded.md)
- [PostBeefRequestBeefInnerClassesSteersLt1](docs/Model/PostBeefRequestBeefInnerClassesSteersLt1.md)
- [PostBeefRequestBeefInnerClassesSteersLt1Traded](docs/Model/PostBeefRequestBeefInnerClassesSteersLt1Traded.md)
- [PostBeefRequestBeefInnerCowsCalving](docs/Model/PostBeefRequestBeefInnerCowsCalving.md)
- [PostBeefRequestBeefInnerFertiliser](docs/Model/PostBeefRequestBeefInnerFertiliser.md)
- [PostBeefRequestBeefInnerFertiliserOtherFertilisersInner](docs/Model/PostBeefRequestBeefInnerFertiliserOtherFertilisersInner.md)
- [PostBeefRequestBeefInnerMineralSupplementation](docs/Model/PostBeefRequestBeefInnerMineralSupplementation.md)
- [PostBeefRequestBurningInner](docs/Model/PostBeefRequestBurningInner.md)
- [PostBeefRequestBurningInnerBurning](docs/Model/PostBeefRequestBurningInnerBurning.md)
- [PostBeefRequestVegetationInner](docs/Model/PostBeefRequestVegetationInner.md)
- [PostBeefRequestVegetationInnerVegetation](docs/Model/PostBeefRequestVegetationInnerVegetation.md)
- [PostBuffalo200Response](docs/Model/PostBuffalo200Response.md)
- [PostBuffalo200ResponseIntensities](docs/Model/PostBuffalo200ResponseIntensities.md)
- [PostBuffalo200ResponseIntermediateInner](docs/Model/PostBuffalo200ResponseIntermediateInner.md)
- [PostBuffalo200ResponseNet](docs/Model/PostBuffalo200ResponseNet.md)
- [PostBuffalo200ResponseScope1](docs/Model/PostBuffalo200ResponseScope1.md)
- [PostBuffalo200ResponseScope3](docs/Model/PostBuffalo200ResponseScope3.md)
- [PostBuffaloRequest](docs/Model/PostBuffaloRequest.md)
- [PostBuffaloRequestBuffalosInner](docs/Model/PostBuffaloRequestBuffalosInner.md)
- [PostBuffaloRequestBuffalosInnerClasses](docs/Model/PostBuffaloRequestBuffalosInnerClasses.md)
- [PostBuffaloRequestBuffalosInnerClassesBulls](docs/Model/PostBuffaloRequestBuffalosInnerClassesBulls.md)
- [PostBuffaloRequestBuffalosInnerClassesBullsAutumn](docs/Model/PostBuffaloRequestBuffalosInnerClassesBullsAutumn.md)
- [PostBuffaloRequestBuffalosInnerClassesBullsPurchasesInner](docs/Model/PostBuffaloRequestBuffalosInnerClassesBullsPurchasesInner.md)
- [PostBuffaloRequestBuffalosInnerClassesCalfs](docs/Model/PostBuffaloRequestBuffalosInnerClassesCalfs.md)
- [PostBuffaloRequestBuffalosInnerClassesCows](docs/Model/PostBuffaloRequestBuffalosInnerClassesCows.md)
- [PostBuffaloRequestBuffalosInnerClassesSteers](docs/Model/PostBuffaloRequestBuffalosInnerClassesSteers.md)
- [PostBuffaloRequestBuffalosInnerClassesTradeBulls](docs/Model/PostBuffaloRequestBuffalosInnerClassesTradeBulls.md)
- [PostBuffaloRequestBuffalosInnerClassesTradeCalfs](docs/Model/PostBuffaloRequestBuffalosInnerClassesTradeCalfs.md)
- [PostBuffaloRequestBuffalosInnerClassesTradeCows](docs/Model/PostBuffaloRequestBuffalosInnerClassesTradeCows.md)
- [PostBuffaloRequestBuffalosInnerClassesTradeSteers](docs/Model/PostBuffaloRequestBuffalosInnerClassesTradeSteers.md)
- [PostBuffaloRequestBuffalosInnerCowsCalving](docs/Model/PostBuffaloRequestBuffalosInnerCowsCalving.md)
- [PostBuffaloRequestBuffalosInnerSeasonalCalving](docs/Model/PostBuffaloRequestBuffalosInnerSeasonalCalving.md)
- [PostBuffaloRequestVegetationInner](docs/Model/PostBuffaloRequestVegetationInner.md)
- [PostCotton200Response](docs/Model/PostCotton200Response.md)
- [PostCotton200ResponseIntermediateInner](docs/Model/PostCotton200ResponseIntermediateInner.md)
- [PostCotton200ResponseIntermediateInnerIntensities](docs/Model/PostCotton200ResponseIntermediateInnerIntensities.md)
- [PostCotton200ResponseNet](docs/Model/PostCotton200ResponseNet.md)
- [PostCotton200ResponseScope1](docs/Model/PostCotton200ResponseScope1.md)
- [PostCotton200ResponseScope3](docs/Model/PostCotton200ResponseScope3.md)
- [PostCottonRequest](docs/Model/PostCottonRequest.md)
- [PostCottonRequestCropsInner](docs/Model/PostCottonRequestCropsInner.md)
- [PostCottonRequestVegetationInner](docs/Model/PostCottonRequestVegetationInner.md)
- [PostDairy200Response](docs/Model/PostDairy200Response.md)
- [PostDairy200ResponseIntensities](docs/Model/PostDairy200ResponseIntensities.md)
- [PostDairy200ResponseIntermediateInner](docs/Model/PostDairy200ResponseIntermediateInner.md)
- [PostDairy200ResponseNet](docs/Model/PostDairy200ResponseNet.md)
- [PostDairy200ResponseScope1](docs/Model/PostDairy200ResponseScope1.md)
- [PostDairy200ResponseScope3](docs/Model/PostDairy200ResponseScope3.md)
- [PostDairyRequest](docs/Model/PostDairyRequest.md)
- [PostDairyRequestDairyInner](docs/Model/PostDairyRequestDairyInner.md)
- [PostDairyRequestDairyInnerAreas](docs/Model/PostDairyRequestDairyInnerAreas.md)
- [PostDairyRequestDairyInnerClasses](docs/Model/PostDairyRequestDairyInnerClasses.md)
- [PostDairyRequestDairyInnerClassesDairyBullsGt1](docs/Model/PostDairyRequestDairyInnerClassesDairyBullsGt1.md)
- [PostDairyRequestDairyInnerClassesDairyBullsLt1](docs/Model/PostDairyRequestDairyInnerClassesDairyBullsLt1.md)
- [PostDairyRequestDairyInnerClassesHeifersGt1](docs/Model/PostDairyRequestDairyInnerClassesHeifersGt1.md)
- [PostDairyRequestDairyInnerClassesHeifersLt1](docs/Model/PostDairyRequestDairyInnerClassesHeifersLt1.md)
- [PostDairyRequestDairyInnerClassesMilkingCows](docs/Model/PostDairyRequestDairyInnerClassesMilkingCows.md)
- [PostDairyRequestDairyInnerClassesMilkingCowsAutumn](docs/Model/PostDairyRequestDairyInnerClassesMilkingCowsAutumn.md)
- [PostDairyRequestDairyInnerManureManagementMilkingCows](docs/Model/PostDairyRequestDairyInnerManureManagementMilkingCows.md)
- [PostDairyRequestDairyInnerSeasonalFertiliser](docs/Model/PostDairyRequestDairyInnerSeasonalFertiliser.md)
- [PostDairyRequestDairyInnerSeasonalFertiliserAutumn](docs/Model/PostDairyRequestDairyInnerSeasonalFertiliserAutumn.md)
- [PostDairyRequestVegetationInner](docs/Model/PostDairyRequestVegetationInner.md)
- [PostDeer200Response](docs/Model/PostDeer200Response.md)
- [PostDeer200ResponseIntensities](docs/Model/PostDeer200ResponseIntensities.md)
- [PostDeer200ResponseIntermediateInner](docs/Model/PostDeer200ResponseIntermediateInner.md)
- [PostDeer200ResponseNet](docs/Model/PostDeer200ResponseNet.md)
- [PostDeerRequest](docs/Model/PostDeerRequest.md)
- [PostDeerRequestDeersInner](docs/Model/PostDeerRequestDeersInner.md)
- [PostDeerRequestDeersInnerClasses](docs/Model/PostDeerRequestDeersInnerClasses.md)
- [PostDeerRequestDeersInnerClassesBreedingDoes](docs/Model/PostDeerRequestDeersInnerClassesBreedingDoes.md)
- [PostDeerRequestDeersInnerClassesBucks](docs/Model/PostDeerRequestDeersInnerClassesBucks.md)
- [PostDeerRequestDeersInnerClassesFawn](docs/Model/PostDeerRequestDeersInnerClassesFawn.md)
- [PostDeerRequestDeersInnerClassesOtherDoes](docs/Model/PostDeerRequestDeersInnerClassesOtherDoes.md)
- [PostDeerRequestDeersInnerClassesTradeBucks](docs/Model/PostDeerRequestDeersInnerClassesTradeBucks.md)
- [PostDeerRequestDeersInnerClassesTradeDoes](docs/Model/PostDeerRequestDeersInnerClassesTradeDoes.md)
- [PostDeerRequestDeersInnerClassesTradeFawn](docs/Model/PostDeerRequestDeersInnerClassesTradeFawn.md)
- [PostDeerRequestDeersInnerClassesTradeOtherDoes](docs/Model/PostDeerRequestDeersInnerClassesTradeOtherDoes.md)
- [PostDeerRequestDeersInnerDoesFawning](docs/Model/PostDeerRequestDeersInnerDoesFawning.md)
- [PostDeerRequestDeersInnerSeasonalFawning](docs/Model/PostDeerRequestDeersInnerSeasonalFawning.md)
- [PostDeerRequestVegetationInner](docs/Model/PostDeerRequestVegetationInner.md)
- [PostFeedlot200Response](docs/Model/PostFeedlot200Response.md)
- [PostFeedlot200ResponseIntermediateInner](docs/Model/PostFeedlot200ResponseIntermediateInner.md)
- [PostFeedlot200ResponseIntermediateInnerIntensities](docs/Model/PostFeedlot200ResponseIntermediateInnerIntensities.md)
- [PostFeedlot200ResponseIntermediateInnerNet](docs/Model/PostFeedlot200ResponseIntermediateInnerNet.md)
- [PostFeedlot200ResponseScope1](docs/Model/PostFeedlot200ResponseScope1.md)
- [PostFeedlot200ResponseScope3](docs/Model/PostFeedlot200ResponseScope3.md)
- [PostFeedlotRequest](docs/Model/PostFeedlotRequest.md)
- [PostFeedlotRequestFeedlotsInner](docs/Model/PostFeedlotRequestFeedlotsInner.md)
- [PostFeedlotRequestFeedlotsInnerGroupsInner](docs/Model/PostFeedlotRequestFeedlotsInnerGroupsInner.md)
- [PostFeedlotRequestFeedlotsInnerGroupsInnerStaysInner](docs/Model/PostFeedlotRequestFeedlotsInnerGroupsInnerStaysInner.md)
- [PostFeedlotRequestFeedlotsInnerPurchases](docs/Model/PostFeedlotRequestFeedlotsInnerPurchases.md)
- [PostFeedlotRequestFeedlotsInnerPurchasesBullsGt1Inner](docs/Model/PostFeedlotRequestFeedlotsInnerPurchasesBullsGt1Inner.md)
- [PostFeedlotRequestFeedlotsInnerSales](docs/Model/PostFeedlotRequestFeedlotsInnerSales.md)
- [PostFeedlotRequestFeedlotsInnerSalesBullsGt1Inner](docs/Model/PostFeedlotRequestFeedlotsInnerSalesBullsGt1Inner.md)
- [PostFeedlotRequestVegetationInner](docs/Model/PostFeedlotRequestVegetationInner.md)
- [PostGoat200Response](docs/Model/PostGoat200Response.md)
- [PostGoat200ResponseIntensities](docs/Model/PostGoat200ResponseIntensities.md)
- [PostGoat200ResponseIntermediateInner](docs/Model/PostGoat200ResponseIntermediateInner.md)
- [PostGoat200ResponseNet](docs/Model/PostGoat200ResponseNet.md)
- [PostGoatRequest](docs/Model/PostGoatRequest.md)
- [PostGoatRequestGoatsInner](docs/Model/PostGoatRequestGoatsInner.md)
- [PostGoatRequestGoatsInnerClasses](docs/Model/PostGoatRequestGoatsInnerClasses.md)
- [PostGoatRequestGoatsInnerClassesBreedingDoesNannies](docs/Model/PostGoatRequestGoatsInnerClassesBreedingDoesNannies.md)
- [PostGoatRequestGoatsInnerClassesBucksBilly](docs/Model/PostGoatRequestGoatsInnerClassesBucksBilly.md)
- [PostGoatRequestGoatsInnerClassesKids](docs/Model/PostGoatRequestGoatsInnerClassesKids.md)
- [PostGoatRequestGoatsInnerClassesMaidenBreedingDoesNannies](docs/Model/PostGoatRequestGoatsInnerClassesMaidenBreedingDoesNannies.md)
- [PostGoatRequestGoatsInnerClassesOtherDoesCulledFemales](docs/Model/PostGoatRequestGoatsInnerClassesOtherDoesCulledFemales.md)
- [PostGoatRequestGoatsInnerClassesTradeBreedingDoesNannies](docs/Model/PostGoatRequestGoatsInnerClassesTradeBreedingDoesNannies.md)
- [PostGoatRequestGoatsInnerClassesTradeBucks](docs/Model/PostGoatRequestGoatsInnerClassesTradeBucks.md)
- [PostGoatRequestGoatsInnerClassesTradeDoes](docs/Model/PostGoatRequestGoatsInnerClassesTradeDoes.md)
- [PostGoatRequestGoatsInnerClassesTradeKids](docs/Model/PostGoatRequestGoatsInnerClassesTradeKids.md)
- [PostGoatRequestGoatsInnerClassesTradeMaidenBreedingDoesNannies](docs/Model/PostGoatRequestGoatsInnerClassesTradeMaidenBreedingDoesNannies.md)
- [PostGoatRequestGoatsInnerClassesTradeOtherDoesCulledFemales](docs/Model/PostGoatRequestGoatsInnerClassesTradeOtherDoesCulledFemales.md)
- [PostGoatRequestGoatsInnerClassesTradeWethers](docs/Model/PostGoatRequestGoatsInnerClassesTradeWethers.md)
- [PostGoatRequestGoatsInnerClassesWethers](docs/Model/PostGoatRequestGoatsInnerClassesWethers.md)
- [PostGoatRequestVegetationInner](docs/Model/PostGoatRequestVegetationInner.md)
- [PostGrains200Response](docs/Model/PostGrains200Response.md)
- [PostGrains200ResponseIntermediateInner](docs/Model/PostGrains200ResponseIntermediateInner.md)
- [PostGrains200ResponseIntermediateInnerIntensitiesWithSequestration](docs/Model/PostGrains200ResponseIntermediateInnerIntensitiesWithSequestration.md)
- [PostGrainsRequest](docs/Model/PostGrainsRequest.md)
- [PostGrainsRequestCropsInner](docs/Model/PostGrainsRequestCropsInner.md)
- [PostHorticulture200Response](docs/Model/PostHorticulture200Response.md)
- [PostHorticulture200ResponseIntermediateInner](docs/Model/PostHorticulture200ResponseIntermediateInner.md)
- [PostHorticulture200ResponseIntermediateInnerIntensitiesWithSequestration](docs/Model/PostHorticulture200ResponseIntermediateInnerIntensitiesWithSequestration.md)
- [PostHorticulture200ResponseScope1](docs/Model/PostHorticulture200ResponseScope1.md)
- [PostHorticultureRequest](docs/Model/PostHorticultureRequest.md)
- [PostHorticultureRequestCropsInner](docs/Model/PostHorticultureRequestCropsInner.md)
- [PostHorticultureRequestCropsInnerRefrigerantsInner](docs/Model/PostHorticultureRequestCropsInnerRefrigerantsInner.md)
- [PostPork200Response](docs/Model/PostPork200Response.md)
- [PostPork200ResponseIntensities](docs/Model/PostPork200ResponseIntensities.md)
- [PostPork200ResponseIntermediateInner](docs/Model/PostPork200ResponseIntermediateInner.md)
- [PostPork200ResponseNet](docs/Model/PostPork200ResponseNet.md)
- [PostPork200ResponseScope1](docs/Model/PostPork200ResponseScope1.md)
- [PostPork200ResponseScope3](docs/Model/PostPork200ResponseScope3.md)
- [PostPorkRequest](docs/Model/PostPorkRequest.md)
- [PostPorkRequestPorkInner](docs/Model/PostPorkRequestPorkInner.md)
- [PostPorkRequestPorkInnerClasses](docs/Model/PostPorkRequestPorkInnerClasses.md)
- [PostPorkRequestPorkInnerClassesBoars](docs/Model/PostPorkRequestPorkInnerClassesBoars.md)
- [PostPorkRequestPorkInnerClassesGilts](docs/Model/PostPorkRequestPorkInnerClassesGilts.md)
- [PostPorkRequestPorkInnerClassesGrowers](docs/Model/PostPorkRequestPorkInnerClassesGrowers.md)
- [PostPorkRequestPorkInnerClassesSlaughterPigs](docs/Model/PostPorkRequestPorkInnerClassesSlaughterPigs.md)
- [PostPorkRequestPorkInnerClassesSows](docs/Model/PostPorkRequestPorkInnerClassesSows.md)
- [PostPorkRequestPorkInnerClassesSowsManure](docs/Model/PostPorkRequestPorkInnerClassesSowsManure.md)
- [PostPorkRequestPorkInnerClassesSowsManureSpring](docs/Model/PostPorkRequestPorkInnerClassesSowsManureSpring.md)
- [PostPorkRequestPorkInnerClassesSuckers](docs/Model/PostPorkRequestPorkInnerClassesSuckers.md)
- [PostPorkRequestPorkInnerClassesWeaners](docs/Model/PostPorkRequestPorkInnerClassesWeaners.md)
- [PostPorkRequestPorkInnerFeedProductsInner](docs/Model/PostPorkRequestPorkInnerFeedProductsInner.md)
- [PostPorkRequestPorkInnerFeedProductsInnerIngredients](docs/Model/PostPorkRequestPorkInnerFeedProductsInnerIngredients.md)
- [PostPorkRequestVegetationInner](docs/Model/PostPorkRequestVegetationInner.md)
- [PostPoultry200Response](docs/Model/PostPoultry200Response.md)
- [PostPoultry200ResponseIntensities](docs/Model/PostPoultry200ResponseIntensities.md)
- [PostPoultry200ResponseIntermediateBroilersInner](docs/Model/PostPoultry200ResponseIntermediateBroilersInner.md)
- [PostPoultry200ResponseIntermediateBroilersInnerIntensities](docs/Model/PostPoultry200ResponseIntermediateBroilersInnerIntensities.md)
- [PostPoultry200ResponseIntermediateLayersInner](docs/Model/PostPoultry200ResponseIntermediateLayersInner.md)
- [PostPoultry200ResponseIntermediateLayersInnerIntensities](docs/Model/PostPoultry200ResponseIntermediateLayersInnerIntensities.md)
- [PostPoultry200ResponseNet](docs/Model/PostPoultry200ResponseNet.md)
- [PostPoultry200ResponseScope1](docs/Model/PostPoultry200ResponseScope1.md)
- [PostPoultry200ResponseScope3](docs/Model/PostPoultry200ResponseScope3.md)
- [PostPoultryRequest](docs/Model/PostPoultryRequest.md)
- [PostPoultryRequestBroilersInner](docs/Model/PostPoultryRequestBroilersInner.md)
- [PostPoultryRequestBroilersInnerGroupsInner](docs/Model/PostPoultryRequestBroilersInnerGroupsInner.md)
- [PostPoultryRequestBroilersInnerGroupsInnerFeedInner](docs/Model/PostPoultryRequestBroilersInnerGroupsInnerFeedInner.md)
- [PostPoultryRequestBroilersInnerGroupsInnerFeedInnerIngredients](docs/Model/PostPoultryRequestBroilersInnerGroupsInnerFeedInnerIngredients.md)
- [PostPoultryRequestBroilersInnerGroupsInnerMeatChickenGrowers](docs/Model/PostPoultryRequestBroilersInnerGroupsInnerMeatChickenGrowers.md)
- [PostPoultryRequestBroilersInnerMeatChickenGrowersPurchases](docs/Model/PostPoultryRequestBroilersInnerMeatChickenGrowersPurchases.md)
- [PostPoultryRequestBroilersInnerMeatChickenLayersPurchases](docs/Model/PostPoultryRequestBroilersInnerMeatChickenLayersPurchases.md)
- [PostPoultryRequestBroilersInnerMeatOtherPurchases](docs/Model/PostPoultryRequestBroilersInnerMeatOtherPurchases.md)
- [PostPoultryRequestBroilersInnerSalesInner](docs/Model/PostPoultryRequestBroilersInnerSalesInner.md)
- [PostPoultryRequestLayersInner](docs/Model/PostPoultryRequestLayersInner.md)
- [PostPoultryRequestLayersInnerLayers](docs/Model/PostPoultryRequestLayersInnerLayers.md)
- [PostPoultryRequestLayersInnerLayersEggSale](docs/Model/PostPoultryRequestLayersInnerLayersEggSale.md)
- [PostPoultryRequestLayersInnerLayersPurchases](docs/Model/PostPoultryRequestLayersInnerLayersPurchases.md)
- [PostPoultryRequestLayersInnerMeatChickenLayers](docs/Model/PostPoultryRequestLayersInnerMeatChickenLayers.md)
- [PostPoultryRequestLayersInnerMeatChickenLayersEggSale](docs/Model/PostPoultryRequestLayersInnerMeatChickenLayersEggSale.md)
- [PostPoultryRequestVegetationInner](docs/Model/PostPoultryRequestVegetationInner.md)
- [PostProcessing200Response](docs/Model/PostProcessing200Response.md)
- [PostProcessing200ResponseIntensitiesInner](docs/Model/PostProcessing200ResponseIntensitiesInner.md)
- [PostProcessing200ResponseIntermediateInner](docs/Model/PostProcessing200ResponseIntermediateInner.md)
- [PostProcessing200ResponseNet](docs/Model/PostProcessing200ResponseNet.md)
- [PostProcessing200ResponseScope1](docs/Model/PostProcessing200ResponseScope1.md)
- [PostProcessing200ResponseScope3](docs/Model/PostProcessing200ResponseScope3.md)
- [PostProcessingRequest](docs/Model/PostProcessingRequest.md)
- [PostProcessingRequestProductsInner](docs/Model/PostProcessingRequestProductsInner.md)
- [PostProcessingRequestProductsInnerProduct](docs/Model/PostProcessingRequestProductsInnerProduct.md)
- [PostRice200Response](docs/Model/PostRice200Response.md)
- [PostRice200ResponseIntensities](docs/Model/PostRice200ResponseIntensities.md)
- [PostRice200ResponseIntermediateInner](docs/Model/PostRice200ResponseIntermediateInner.md)
- [PostRice200ResponseIntermediateInnerIntensities](docs/Model/PostRice200ResponseIntermediateInnerIntensities.md)
- [PostRice200ResponseScope1](docs/Model/PostRice200ResponseScope1.md)
- [PostRiceRequest](docs/Model/PostRiceRequest.md)
- [PostRiceRequestCropsInner](docs/Model/PostRiceRequestCropsInner.md)
- [PostSheep200Response](docs/Model/PostSheep200Response.md)
- [PostSheep200ResponseIntermediateInner](docs/Model/PostSheep200ResponseIntermediateInner.md)
- [PostSheep200ResponseIntermediateInnerIntensities](docs/Model/PostSheep200ResponseIntermediateInnerIntensities.md)
- [PostSheep200ResponseNet](docs/Model/PostSheep200ResponseNet.md)
- [PostSheepRequest](docs/Model/PostSheepRequest.md)
- [PostSheepRequestSheepInner](docs/Model/PostSheepRequestSheepInner.md)
- [PostSheepRequestSheepInnerClasses](docs/Model/PostSheepRequestSheepInnerClasses.md)
- [PostSheepRequestSheepInnerClassesRams](docs/Model/PostSheepRequestSheepInnerClassesRams.md)
- [PostSheepRequestSheepInnerClassesRamsAutumn](docs/Model/PostSheepRequestSheepInnerClassesRamsAutumn.md)
- [PostSheepRequestSheepInnerClassesTradeEwes](docs/Model/PostSheepRequestSheepInnerClassesTradeEwes.md)
- [PostSheepRequestSheepInnerClassesTradeLambsAndHoggets](docs/Model/PostSheepRequestSheepInnerClassesTradeLambsAndHoggets.md)
- [PostSheepRequestSheepInnerEwesLambing](docs/Model/PostSheepRequestSheepInnerEwesLambing.md)
- [PostSheepRequestSheepInnerSeasonalLambing](docs/Model/PostSheepRequestSheepInnerSeasonalLambing.md)
- [PostSheepRequestVegetationInner](docs/Model/PostSheepRequestVegetationInner.md)
- [PostSheepbeef200Response](docs/Model/PostSheepbeef200Response.md)
- [PostSheepbeef200ResponseIntensities](docs/Model/PostSheepbeef200ResponseIntensities.md)
- [PostSheepbeef200ResponseIntermediate](docs/Model/PostSheepbeef200ResponseIntermediate.md)
- [PostSheepbeef200ResponseIntermediateBeef](docs/Model/PostSheepbeef200ResponseIntermediateBeef.md)
- [PostSheepbeef200ResponseIntermediateSheep](docs/Model/PostSheepbeef200ResponseIntermediateSheep.md)
- [PostSheepbeef200ResponseNet](docs/Model/PostSheepbeef200ResponseNet.md)
- [PostSheepbeefRequest](docs/Model/PostSheepbeefRequest.md)
- [PostSheepbeefRequestVegetationInner](docs/Model/PostSheepbeefRequestVegetationInner.md)
- [PostSugar200Response](docs/Model/PostSugar200Response.md)
- [PostSugar200ResponseIntermediateInner](docs/Model/PostSugar200ResponseIntermediateInner.md)
- [PostSugar200ResponseIntermediateInnerIntensities](docs/Model/PostSugar200ResponseIntermediateInnerIntensities.md)
- [PostSugarRequest](docs/Model/PostSugarRequest.md)
- [PostSugarRequestCropsInner](docs/Model/PostSugarRequestCropsInner.md)
- [PostVineyard200Response](docs/Model/PostVineyard200Response.md)
- [PostVineyard200ResponseIntermediateInner](docs/Model/PostVineyard200ResponseIntermediateInner.md)
- [PostVineyard200ResponseIntermediateInnerIntensities](docs/Model/PostVineyard200ResponseIntermediateInnerIntensities.md)
- [PostVineyard200ResponseNet](docs/Model/PostVineyard200ResponseNet.md)
- [PostVineyard200ResponseScope1](docs/Model/PostVineyard200ResponseScope1.md)
- [PostVineyard200ResponseScope3](docs/Model/PostVineyard200ResponseScope3.md)
- [PostVineyardRequest](docs/Model/PostVineyardRequest.md)
- [PostVineyardRequestVegetationInner](docs/Model/PostVineyardRequestVegetationInner.md)
- [PostVineyardRequestVineyardsInner](docs/Model/PostVineyardRequestVineyardsInner.md)
- [PostWildcatchfishery200Response](docs/Model/PostWildcatchfishery200Response.md)
- [PostWildcatchfishery200ResponseIntensities](docs/Model/PostWildcatchfishery200ResponseIntensities.md)
- [PostWildcatchfishery200ResponseIntermediateInner](docs/Model/PostWildcatchfishery200ResponseIntermediateInner.md)
- [PostWildcatchfishery200ResponseScope1](docs/Model/PostWildcatchfishery200ResponseScope1.md)
- [PostWildcatchfisheryRequest](docs/Model/PostWildcatchfisheryRequest.md)
- [PostWildcatchfisheryRequestEnterprisesInner](docs/Model/PostWildcatchfisheryRequestEnterprisesInner.md)
- [PostWildcatchfisheryRequestEnterprisesInnerBaitInner](docs/Model/PostWildcatchfisheryRequestEnterprisesInnerBaitInner.md)
- [PostWildseafisheries200Response](docs/Model/PostWildseafisheries200Response.md)
- [PostWildseafisheries200ResponseIntermediateInner](docs/Model/PostWildseafisheries200ResponseIntermediateInner.md)
- [PostWildseafisheries200ResponseIntermediateInnerIntensities](docs/Model/PostWildseafisheries200ResponseIntermediateInnerIntensities.md)
- [PostWildseafisheries200ResponseScope1](docs/Model/PostWildseafisheries200ResponseScope1.md)
- [PostWildseafisheries200ResponseScope3](docs/Model/PostWildseafisheries200ResponseScope3.md)
- [PostWildseafisheriesRequest](docs/Model/PostWildseafisheriesRequest.md)
- [PostWildseafisheriesRequestEnterprisesInner](docs/Model/PostWildseafisheriesRequestEnterprisesInner.md)
- [PostWildseafisheriesRequestEnterprisesInnerBaitInner](docs/Model/PostWildseafisheriesRequestEnterprisesInnerBaitInner.md)
- [PostWildseafisheriesRequestEnterprisesInnerCustombaitInner](docs/Model/PostWildseafisheriesRequestEnterprisesInnerCustombaitInner.md)
- [PostWildseafisheriesRequestEnterprisesInnerFlightsInner](docs/Model/PostWildseafisheriesRequestEnterprisesInnerFlightsInner.md)
- [PostWildseafisheriesRequestEnterprisesInnerRefrigerantsInner](docs/Model/PostWildseafisheriesRequestEnterprisesInnerRefrigerantsInner.md)
- [PostWildseafisheriesRequestEnterprisesInnerTransportsInner](docs/Model/PostWildseafisheriesRequestEnterprisesInnerTransportsInner.md)

## Authorization
Endpoints do not require authorization.

## Tests

To run the tests, use:

```bash
composer install
vendor/bin/phpunit
```

## Author

contact@aginnovationaustralia.com.au

## About this package

This PHP package is automatically generated by the [OpenAPI Generator](https://openapi-generator.tech) project:

- API version: `3.0.0`
    - Generator version: `7.16.0`
- Build package: `org.openapitools.codegen.languages.PhpClientCodegen`
