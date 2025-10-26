<?php
require_once(__DIR__ . '/vendor/autoload.php');

use OpenAPI\Client\Api\GAFApi;
use OpenAPI\Client\Model\PostAquacultureRequest;
use GuzzleHttp\Client;
use OpenAPI\Client\Configuration;


try {
    // Create request object
    $request = new PostAquacultureRequest([
        'enterprises' => [
            // Add your enterprise data here
            // See lib/Model/PostAquacultureRequestEnterprisesInner.php for structure
        ]
    ]);

    $config = Configuration::getDefaultConfiguration();
    $config->setHost('https://emissionscalculator-mtls.staging.aiaapi.com/calculator/3.0.0');

    $config->setCertFile(__DIR__ . '/cert.pem');
    $config->setKeyFile(__DIR__ . '/key.pem');

    // Initialize API
    $api = new GAFApi(new Client(), $config);

    // Make the API call
    $result = $api->postAquaculture($request);

    // Print the result
    print_r($result);

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}