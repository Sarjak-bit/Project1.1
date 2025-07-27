#!/bin/bash

echo "🎯 Starting Club Connect Backend System..."
echo "========================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p public uploads

# Start the server
echo "🚀 Starting Club Connect server..."
echo ""
echo "🌐 Your website will be available at: http://localhost:3000"
echo "🔧 Admin panel will be available at: http://localhost:3000/admin/login"
echo "🔑 Default admin credentials: admin / admin123"
echo ""
echo "Press Ctrl+C to stop the server"
echo "========================================"

node server.js