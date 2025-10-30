#!/bin/bash

# Lens Comparator Deployment Script
# This script builds the project and deploys static files to Nginx directory

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

# Check if pnpm is available
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install it first:"
    echo "   npm install -g pnpm"
    exit 1
fi

# Check if node_modules exists, if not, install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

# Build the project for production
echo "🔨 Building project for production..."
pnpm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

# Deploy static files to Nginx directory
DEPLOY_DIR="/var/www/yage/lens-comparator"
echo "📦 Deploying static files to $DEPLOY_DIR..."

# Create target directory if it doesn't exist
if [ ! -d "$DEPLOY_DIR" ]; then
    echo "📁 Creating directory $DEPLOY_DIR..."
    sudo mkdir -p "$DEPLOY_DIR"
fi

# Copy all files from dist to deploy directory
echo "📋 Copying files..."
sudo cp -r dist/* "$DEPLOY_DIR/"
if [ $? -ne 0 ]; then
    echo "❌ Failed to copy files"
    exit 1
fi

# Set proper permissions
sudo chown -R www-data:www-data "$DEPLOY_DIR" 2>/dev/null || true

echo "✅ Deployment completed successfully!"
echo "🌐 Files are now available at /var/www/yage/lens-comparator"
echo "📍 Make sure your Nginx is configured to serve from this location"

