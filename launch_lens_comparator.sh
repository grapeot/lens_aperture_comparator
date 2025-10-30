#!/bin/bash

# Lens Comparator Launch Script for PM2 (Production Mode)
# This script builds the project and starts the production preview server

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

# Start the production preview server
echo "🚀 Starting Lens Comparator (Production Mode)..."
echo "📍 Server will be available at http://127.0.0.1:8018"
echo "🌐 Allowed host: yage.ai"

# Start vite preview server
exec pnpm run preview

