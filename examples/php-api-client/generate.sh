#!/bin/bash
set -e
API_CLIENT_DIR=api-client
API_VERSION=3.0.0
rm -rf $API_CLIENT_DIR

npm -g install @openapitools/openapi-generator-cli
openapi-generator-cli generate \
  -i https://d2awla29kxgk7i.cloudfront.net/api/$API_VERSION/openapi.json \
  -g python \
  -o $API_CLIENT_DIR

cp resources/* $API_CLIENT_DIR/

cd $API_CLIENT_DIR
./setup_local.sh
./run_test.sh