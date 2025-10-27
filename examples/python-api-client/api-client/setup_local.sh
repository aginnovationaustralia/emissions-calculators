#!/bin/bash

# Setup script for local development and testing of the API client
# This script creates a virtual environment and installs the client locally

set -e

echo "Setting up Python API client for local development..."

# Check if Python 3.9+ is available
python_version=$(python3 --version 2>&1 | grep -o '[0-9]\+\.[0-9]\+' | head -1)
required_version="3.9"

if [ "$(printf '%s\n' "$required_version" "$python_version" | sort -V | head -n1)" != "$required_version" ]; then
    echo "Error: Python 3.9+ is required, but found Python $python_version"
    echo "Please install Python 3.9 or later"
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
else
    echo "Virtual environment already exists"
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip

# Install the client in development mode
echo "Installing API client in development mode..."
pip install -e .

# Install additional dependencies for testing
echo "Installing additional dependencies..."
pip install pytest

echo ""
echo "Setup complete! To use the API client:"
echo "1. Activate the virtual environment: source venv/bin/activate"
echo "2. Run the test script: python test_api.py"
echo "3. Or run tests: pytest"
echo ""
echo "To deactivate the virtual environment when done: deactivate"

