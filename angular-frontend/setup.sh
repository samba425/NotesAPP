#!/bin/bash

# Angular Frontend Setup Script
echo "🚀 Setting up Angular Notes App..."

# Navigate to frontend directory
cd "$(dirname "$0")"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo "✓ npm version: $(npm --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Installation completed successfully!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Configure backend in src/environments/environment.ts"
    echo "   - Change 'backendType' to 'nodejs' or 'python'"
    echo ""
    echo "2. Start the backend server:"
    echo "   Node.js: cd ../nodejs-backend && npm start"
    echo "   Python:  cd ../python-backend && uvicorn main:app --reload"
    echo ""
    echo "3. Start the Angular app:"
    echo "   npm start"
    echo ""
    echo "4. Open browser at: http://localhost:4200"
    echo ""
else
    echo ""
    echo "❌ Installation failed. Please check the error messages above."
    exit 1
fi
