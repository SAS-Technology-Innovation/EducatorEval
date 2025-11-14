#!/bin/bash

echo "🔍 Environment Variable Diagnostic Tool"
echo "========================================"
echo ""

echo "📋 Current Shell Environment Variables (VITE_*):"
env | grep VITE_ || echo "  ✅ No VITE_ variables in shell environment"
echo ""

echo "📄 .env file contents:"
cat .env 2>/dev/null | grep VITE_ || echo "  ❌ .env file not found or no VITE_ variables"
echo ""

echo "📄 .env.staging file contents:"
cat .env.staging 2>/dev/null | grep VITE_ || echo "  ❌ .env.staging file not found"
echo ""

echo "🔍 Checking common config files for VITE_ variables:"
echo "  ~/.zshrc:"
grep VITE_ ~/.zshrc 2>/dev/null || echo "    ✅ No VITE_ variables found"
echo "  ~/.bashrc:"
grep VITE_ ~/.bashrc 2>/dev/null || echo "    ✅ No VITE_ variables found"
echo "  ~/.bash_profile:"
grep VITE_ ~/.bash_profile 2>/dev/null || echo "    ✅ No VITE_ variables found"
echo "  ~/.profile:"
grep VITE_ ~/.profile 2>/dev/null || echo "    ✅ No VITE_ variables found"
echo "  .vscode/settings.json:"
grep VITE_ .vscode/settings.json 2>/dev/null || echo "    ✅ No VITE_ variables found (or file doesn't exist)"
echo ""

echo "🧪 Testing what Node.js sees:"
node -e "
  console.log('  VITE_FIREBASE_API_KEY:', process.env.VITE_FIREBASE_API_KEY || 'undefined');
  console.log('  VITE_ENVIRONMENT:', process.env.VITE_ENVIRONMENT || 'undefined');
  console.log('  VITE_USE_MOCK_AUTH:', process.env.VITE_USE_MOCK_AUTH || 'undefined');
"
echo ""

echo "💡 Recommendation:"
echo "If you see placeholder values like 'your-api-key-here' in the shell environment,"
echo "you need to unset them before building:"
echo ""
echo "  unset VITE_FIREBASE_API_KEY VITE_FIREBASE_AUTH_DOMAIN VITE_FIREBASE_PROJECT_ID"
echo "  unset VITE_FIREBASE_STORAGE_BUCKET VITE_FIREBASE_MESSAGING_SENDER_ID VITE_FIREBASE_APP_ID"
echo "  unset VITE_USE_MOCK_AUTH"
echo ""
echo "Then rebuild:"
echo "  npm run build:staging"
echo "  npx firebase deploy --only hosting"
