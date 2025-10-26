#!/usr/bin/env python3
"""
Test script for the AIA Calculator API client
This script demonstrates how to use the generated API client locally
"""

import openapi_client
from openapi_client.rest import ApiException
from pprint import pprint

def create_valid_aquaculture_input():
    """Create a valid aquaculture input using from_dict methods"""
    
    # Create sample data for a salmon farming operation
    enterprise_data = {
        "id": "salmon_farm_001",
        "state": "tas",  # Tasmania
        "productionSystem": "Offshore Caged Aquaculture",
        "totalHarvestKg": 50000,  # 50 tonnes
        "refrigerants": [
            {
                "refrigerant": "R-134a",
                "chargeSize": 2.5
            }
        ],
        "bait": [
            {
                "type": "High Animal Protein Formulated Feed",
                "purchasedTonnes": 75.0,
                "additionalIngredients": 0.1,
                "emissionsIntensity": 2.5
            }
        ],
        "customBait": [],  # Empty list
        "inboundFreight": [],  # Empty list
        "outboundFreight": [],  # Empty list
        "totalCommercialFlightsKm": 0,
        "electricityRenewable": 0.3,  # 30% renewable
        "electricityUse": 15000,  # 15 MWh
        "electricitySource": "State Grid",
        "fuel": {
            "transportFuel": [
                {
                    "type": "diesel",
                    "amountLitres": 500
                }
            ],
            "stationaryFuel": [
                {
                    "type": "diesel",
                    "amountLitres": 200
                }
            ],
            "naturalGas": 0
        },
        "fluidWaste": [],  # Empty list
        "solidWaste": {
            "sentOffsiteTonnes": 5.0,
            "onsiteCompostingTonnes": 2.0
        },
        "carbonOffsets": 10.0  # 10 tonnes CO2 offset
    }
    
    # Create the enterprise input using from_dict
    enterprise = openapi_client.AquacultureEnterpriseInput.from_dict(enterprise_data)
    
    # Create the main aquaculture input
    aquaculture_data = {
        "enterprises": [enterprise_data]  # Pass the dict directly
    }
    
    aquaculture_input = openapi_client.AquacultureInput.from_dict(aquaculture_data)
    
    return aquaculture_input

def test_aquaculture_api():
    """Test the aquaculture API endpoint with valid input"""
    
    # Defining the host is optional and defaults to https://emissionscalculator-mtls.production.aiaapi.com/calculator/2.0.0
    # See configuration.py for a list of all supported configuration parameters.
    configuration = openapi_client.Configuration(
        host="https://emissionscalculator-mtls.staging.aiaapi.com/calculator/2.0.0",
        cert_file="./cert.pem",
        key_file="./key.pem"
    )

    # Create a valid aquaculture input
    aquaculture_input = create_valid_aquaculture_input()
    
    print("Created aquaculture input:")
    print("=" * 50)
    pprint(aquaculture_input.to_dict())
    print("=" * 50)

    # Enter a context with an instance of the API client
    with openapi_client.ApiClient(configuration) as api_client:
        # Create an instance of the API class
        api_instance = openapi_client.GAFApi(api_client)

        try:
            # Perform Aquaculture calculation
            print("Calling aquaculture API...")
            api_response = api_instance.post_aquaculture(aquaculture_input)
            print("The response of GAFApi->post_aquaculture:\n")
            pprint(api_response)
        except ApiException as e:
            print("Exception when calling GAFApi->post_aquaculture: %s\n" % e)
            print("This is expected if you don't have proper authentication configured")

def create_valid_beef_input():
    """Create a valid beef input using from_dict methods"""
    
    # Create sample data for a beef cattle operation
    beef_data = {
        "enterprises": [
            {
                "id": "beef_cattle_001",
                "state": "qld",  # Queensland
                "productionSystem": "Grass-fed",
                "totalHarvestKg": 300000,  # 300 tonnes
                "refrigerants": [
                    {
                        "refrigerant": "R-134a",
                        "chargeSize": 1.0
                    }
                ],
                "bait": [],  # Empty for beef
                "customBait": [],
                "inboundFreight": [],
                "outboundFreight": [],
                "totalCommercialFlightsKm": 0,
                "electricityRenewable": 0.2,  # 20% renewable
                "electricityUse": 5000,  # 5 MWh
                "electricitySource": "State Grid",
                "fuel": {
                    "transportFuel": [
                        {
                            "type": "diesel",
                            "amountLitres": 1000
                        }
                    ],
                    "stationaryFuel": [
                        {
                            "type": "diesel",
                            "amountLitres": 500
                        }
                    ],
                    "naturalGas": 0
                },
                "fluidWaste": [],
                "solidWaste": {
                    "sentOffsiteTonnes": 10.0,
                    "onsiteCompostingTonnes": 5.0
                },
                "carbonOffsets": 5.0
            }
        ]
    }
    
    beef_input = openapi_client.BeefInput.from_dict(beef_data)
    return beef_input

def test_beef_api():
    """Test the beef API endpoint with valid input"""
    
    configuration = openapi_client.Configuration(
        host="https://emissionscalculator-mtls.production.aiaapi.com/calculator/2.0.0"
    )

    # Create a valid beef input
    beef_input = create_valid_beef_input()
    
    print("Created beef input:")
    print("=" * 50)
    pprint(beef_input.to_dict())
    print("=" * 50)

    with openapi_client.ApiClient(configuration) as api_client:
        api_instance = openapi_client.GAFApi(api_client)

        try:
            print("Calling beef API...")
            api_response = api_instance.post_beef(beef_input)
            print("The response of GAFApi->post_beef:\n")
            pprint(api_response)
        except ApiException as e:
            print("Exception when calling GAFApi->post_beef: %s\n" % e)
            print("This is expected if you don't have proper authentication configured")

def main():
    """Main function to run API tests"""
    print("Testing AIA Calculator API Client")
    print("=" * 40)
    
    # Test aquaculture endpoint
    test_aquaculture_api()
    print("\n" + "=" * 40)
    
    # Test beef endpoint
    # test_beef_api()
    # print("\n" + "=" * 40)
    
    print("API testing complete!")
    print("\nNote: Authentication errors are expected if you haven't configured")
    print("proper credentials for the production API endpoint.")

if __name__ == "__main__":
    main()
