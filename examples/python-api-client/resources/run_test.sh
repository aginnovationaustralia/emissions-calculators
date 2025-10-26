#!/bin/bash

# Quick run script for testing the API client
# This script activates the virtual environment and runs the test

set -e

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Virtual environment not found. Please run ./setup_local.sh first"
    exit 1
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Run the test script
echo "Running API test script..."
python test_api.py

echo ""
echo "Test complete! Virtual environment is still active."
echo "To deactivate: deactivate"

