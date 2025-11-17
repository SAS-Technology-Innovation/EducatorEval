#!/bin/bash

echo "🧹 Cleaning environment and rebuilding staging..."
echo ""

# Unset all VITE_ environment variables to prevent shell override
echo "1️⃣ Unsetting shell environment variables..."
unset VITE_FIREBASE_API_KEY
unset VITE_FIREBASE_AUTH_DOMAIN
unset VITE_FIREBASE_PROJECT_ID
unset VITE_FIREBASE_STORAGE_BUCKET
unset VITE_FIREBASE_MESSAGING_SENDER_ID
unset VITE_FIREBASE_APP_ID
unset VITE_FIREBASE_MEASUREMENT_ID
unset VITE_USE_MOCK_AUTH
unset VITE_USE_FIREBASE_EMULATORS
unset VITE_ENVIRONMENT
echo "   ✅ Environment variables unset"

# Verify they're gone
echo ""
echo "2️⃣ Verifying environment is clean..."
if env | grep -q "VITE_"; then
    echo "   ⚠️  Warning: Some VITE_ variables still present:"
    env | grep "VITE_"
else
    echo "   ✅ No VITE_ variables in environment"
fi

# Clean build
echo ""
echo "3️⃣ Cleaning previous build..."
rm -rf dist
echo "   ✅ dist/ removed"

# Build with staging config
echo ""
echo "4️⃣ Building with staging configuration..."
cp .env.staging .env
npm run build

# Verify API key in build
echo ""
echo "5️⃣ Verifying staging API key in build..."
if grep -q "AIzaSyC2xZ14Td7ktxEgryYJHZ3qAK4V-gv5UaM" dist/assets/index-*.js 2>/dev/null; then
    echo "   ✅ Staging API key found in build!"
else
    echo "   ⚠️  Staging API key NOT found - checking what's there..."
    echo ""
    echo "   Searching for Firebase config in bundle:"
    grep -o "apiKey:[^,]*" dist/assets/index-*.js | head -1
    echo ""
    echo "   ⚠️  Build may still have incorrect configuration"
    echo "   This suggests Vite is not reading .env properly"
    echo ""
    read -p "   Continue with deployment anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "   ❌ Deployment cancelled"
        exit 1
    fi
fi

# Deploy
echo ""
echo "6️⃣ Deploying to Firebase staging..."
npx firebase use staging
npx firebase deploy --only hosting

echo ""
echo "✅ Complete! Test at: https://educatoreval-staging.web.app"
echo ""
echo "📧 Login with:"
echo "   Email: bryan@nyuchi.com"
echo "   Password: TempPassword123!"
