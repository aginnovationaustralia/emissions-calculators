# Example PHP API client for the AIA Carbon Calculators API

This example shows how to call the REST API available at https://emissionscalculator-mtls.production.aiaapi.com/calculator/3.0.0 using a simple PHP script.

## Running the example

You can execute a simple request to the `beef` endpoint using the example provided. You just need to update the calls `$config->setCertFile` and `$config->setKeyFile` in [example.php](./api-client/example.php) so they point to your client certificate and key files. This allows the client to authenticate with the endpoint via mTLS. Once that has been done you just need to run:

```
cd api-client
composer install
php example.php
```

## Code generation

The PHP API client has been generated using the [openapi-generator-cli](https://www.npmjs.com/package/@openapitools/openapi-generator-cli) tool. The generation can be reproduced with a script like:

```
API_CLIENT_DIR=api-client
API_VERSION=3.0.0
rm -rf $API_CLIENT_DIR

npm -g install @openapitools/openapi-generator-cli
openapi-generator-cli generate \
  -i https://d2awla29kxgk7i.cloudfront.net/api/$API_VERSION/openapi.json \
  -g php \
  -o $API_CLIENT_DIR \
  --global-property apiTests=false,apiDocs=false,modelTests=false,modelDocs=false
```

For now, the PHP generator does not support all the configuration needed for an mTLS connection out of the box. Several fixes have been applied to the generated code in the `api-client` folder to let this work end to end. Once this [PR](https://github.com/OpenAPITools/openapi-generator/pull/22229) has been merged and released, it will be possible to make requests via mTLS without any code changes to the generated PHP client code needed.
