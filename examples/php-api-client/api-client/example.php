<?php
require_once(__DIR__ . '/vendor/autoload.php');

use OpenAPI\Client\Api\GAFApi;
use OpenAPI\Client\Model\PostBeefRequest;
use OpenAPI\Client\Model\PostBeefRequestBeefInner;
use OpenAPI\Client\Model\PostBeefRequestBeefInnerClasses;
use OpenAPI\Client\Model\PostBeefRequestBeefInnerClassesCowsGt2;
use OpenAPI\Client\Model\PostBeefRequestBeefInnerClassesBullsGt1Autumn;
use OpenAPI\Client\Model\PostBeefRequestBeefInnerFertiliser;
use OpenAPI\Client\Model\PostBeefRequestBeefInnerMineralSupplementation;
use OpenAPI\Client\Model\PostBeefRequestBeefInnerCowsCalving;
use GuzzleHttp\Client;
use OpenAPI\Client\Configuration;

try {
    // Create seasonal data for cows
    $springSeason = new PostBeefRequestBeefInnerClassesBullsGt1Autumn([
        'head' => 50,
        'liveweight' => 450,
        'liveweight_gain' => 0.5
    ]);

    $summerSeason = new PostBeefRequestBeefInnerClassesBullsGt1Autumn([
        'head' => 50,
        'liveweight' => 440,
        'liveweight_gain' => 0.3
    ]);

    $autumnSeason = new PostBeefRequestBeefInnerClassesBullsGt1Autumn([
        'head' => 50,
        'liveweight' => 460,
        'liveweight_gain' => 0.4
    ]);

    $winterSeason = new PostBeefRequestBeefInnerClassesBullsGt1Autumn([
        'head' => 50,
        'liveweight' => 450,
        'liveweight_gain' => 0.4
    ]);

    // Create cows class (greater than 2 years old)
    $cowsGt2 = new PostBeefRequestBeefInnerClassesCowsGt2([
        'spring' => $springSeason,
        'summer' => $summerSeason,
        'autumn' => $autumnSeason,
        'winter' => $winterSeason,
        'head_sold' => 25,
        'sale_weight' => 500
    ]);

    // Create classes object with cows
    $classes = new PostBeefRequestBeefInnerClasses([
        'cows_gt2' => $cowsGt2
    ]);

    // Create fertiliser object
    $fertiliser = new PostBeefRequestBeefInnerFertiliser([
        'single_superphosphate' => 5.0,
        'pasture_dryland' => 10.0,
        'pasture_irrigated' => 2.0,
        'crops_dryland' => 8.0,
        'crops_irrigated' => 1.0
    ]);

    // Create mineral supplementation object
    $mineralSupplementation = new PostBeefRequestBeefInnerMineralSupplementation([
        'mineral_block' => 2.0,
        'mineral_block_urea' => 0.3,
        'weaner_block' => 1.0,
        'weaner_block_urea' => 0.2,
        'dry_season_mix' => 1.5,
        'dry_season_mix_urea' => 0.25
    ]);

    // Create cows calving object
    $cowsCalving = new PostBeefRequestBeefInnerCowsCalving([
        'spring' => 0.2,
        'summer' => 0.1,
        'autumn' => 0.5,
        'winter' => 0.2
    ]);

    // Create beef inner object
    $beefInner = new PostBeefRequestBeefInner([
        'id' => 'beef_cattle_001',
        'classes' => $classes,
        'limestone' => 10.0,
        'limestone_fraction' => 0.8,
        'fertiliser' => $fertiliser,
        'diesel' => 1000,
        'petrol' => 200,
        'lpg' => 100,
        'mineral_supplementation' => $mineralSupplementation,
        'electricity_source' => 'State Grid',
        'electricity_renewable' => 0.2,
        'electricity_use' => 5000,
        'grain_feed' => 10.0,
        'hay_feed' => 5.0,
        'cottonseed_feed' => 2.0,
        'herbicide' => 50.0,
        'herbicide_other' => 20.0,
        'cows_calving' => $cowsCalving
    ]);

    // Create main request object
    $request = new PostBeefRequest([
        'state' => 'qld',
        'north_of_tropic_of_capricorn' => true,
        'rainfall_above600' => true,
        'beef' => [$beefInner],
        'burning' => [],
        'vegetation' => []
    ]);

    // Configure API
    $config = Configuration::getDefaultConfiguration();
    $config->setHost('https://emissionscalculator-mtls.staging.aiaapi.com/calculator/3.0.0');
    $config->setCertFile(__DIR__ . '/cert.pem');
    $config->setKeyFile(__DIR__ . '/key.pem');

    // Initialize API
    $api = new GAFApi(new Client(), $config);

    echo "Calling beef API...\n";
    echo "================================\n";

    // Make the API call
    $result = $api->postBeef($request);

    // Print the result
    echo "Success! API call completed.\n\n";
    echo "Response:\n";
    print_r($result);

    echo "\n================================\n";
    echo "API call complete!\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . "\n";
    echo "Line: " . $e->getLine() . "\n";
}