#!/bin/bash

# This script should be run from within the docker directory.

echo "Building Docker image..."

VERSION=0.1.0

docker build -t keeejinnn/naviz-ros2-interface-server:v$VERSION .

echo "Docker image built successfully."