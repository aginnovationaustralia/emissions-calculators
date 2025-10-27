#!/usr/bin/env python3
"""
Test script for the AIA Calculator API client
This script demonstrates how to use the generated API client locally
"""

import openapi_client
from openapi_client.rest import ApiException
from pprint import pprint

def create_valid_beef_input():
    """Create a valid beef input using from_dict methods"""
    
    # Create sample data for a beef cattle operation
    # This structure matches PostBeefRequest model requirements
    beef_data = {
        "state": "qld",  # Queensland (must be valid enum: nsw, vic, qld, sa, wa_nw, wa_sw, tas, nt, act)
        "northOfTropicOfCapricorn": True,
        "rainfallAbove600": True,
        "beef": [
            {
                "id": "beef_cattle_001",
                "classes": {
                    # Example: Cows greater than 2 years old
                    "cowsGt2": {
                        "spring": {
                            "head": 50,  # number of animals
                            "liveweight": 450,  # average kg/head
                            "liveweightGain": 0.5,  # kg/day
                            "crudeProtein": None,  # optional
                            "dryMatterDigestibility": None  # optional
                        },
                        "summer": {
                            "head": 50,
                            "liveweight": 440,
                            "liveweightGain": 0.3,
                            "crudeProtein": None,
                            "dryMatterDigestibility": None
                        },
                        "autumn": {
                            "head": 50,
                            "liveweight": 460,
                            "liveweightGain": 0.4,
                            "crudeProtein": None,
                            "dryMatterDigestibility": None
                        },
                        "winter": {
                            "head": 50,
                            "liveweight": 450,
                            "liveweightGain": 0.4,
                            "crudeProtein": None,
                            "dryMatterDigestibility": None
                        },
                        "headSold": 25,  # required: number sold
                        "saleWeight": 500,  # required: weight at sale in kg/head
                        "headPurchased": None,  # optional
                        "purchasedWeight": None,  # optional
                        "source": None,  # optional
                        "purchases": None  # optional
                    }
                },
                "limestone": 10.0,
                "limestoneFraction": 0.8,  # Fraction between 0 and 1
                "fertiliser": {
                    "singleSuperphosphate": 5.0,
                    "pastureDryland": 10.0,
                    "pastureIrrigated": 2.0,
                    "cropsDryland": 8.0,
                    "cropsIrrigated": 1.0,
                    "otherDryland": None,
                    "otherIrrigated": None,
                    "otherType": None,
                    "otherFertilisers": None
                },
                "diesel": 1000,
                "petrol": 200,
                "lpg": 100,
                "mineralSupplementation": {
                    "mineralBlock": 2.0,
                    "mineralBlockUrea": 0.3,
                    "weanerBlock": 1.0,
                    "weanerBlockUrea": 0.2,
                    "drySeasonMix": 1.5,
                    "drySeasonMixUrea": 0.25
                },
                "electricitySource": "State Grid",  # Must be 'State Grid' or 'Renewable'
                "electricityRenewable": 0.2,  # Fraction between 0 and 1
                "electricityUse": 5000,  # kWh
                "grainFeed": 10.0,  # tonnes
                "hayFeed": 5.0,
                "cottonseedFeed": 2.0,
                "herbicide": 50.0,  # kg
                "herbicideOther": 20.0,
                "cowsCalving": {
                    "spring": 0.2,
                    "summer": 0.1,
                    "autumn": 0.5,
                    "winter": 0.2
                }
            }
        ],
        "burning": [],  # List of burning activities (optional)
        "vegetation": []  # List of vegetation activities (optional)
    }
    
    beef_input = openapi_client.PostBeefRequest.from_dict(beef_data)
    return beef_input

def test_beef_api():
    """Test the beef API endpoint with valid input"""
    
    configuration = openapi_client.Configuration(
        host="https://emissionscalculator-mtls.staging.aiaapi.com/calculator/3.0.0",
        cert_file="cert.pem",
        key_file="key.pem",
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
    
    # Test beef endpoint
    test_beef_api()
    print("\n" + "=" * 40)
    
    print("API testing complete!")
    print("\nNote: Authentication errors are expected if you haven't configured")
    print("proper credentials for the production API endpoint.")

if __name__ == "__main__":
    main()
