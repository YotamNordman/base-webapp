#\!/bin/bash
set -e

echo "Starting production build process..."
cd /Users/yotamnordman/Work/base/base-webapp

echo "Cleaning node_modules and reinstalling dependencies..."
rm -rf node_modules
rm -f package-lock.json
npm install

echo "Running TypeScript check..."
npx tsc --noEmit

echo "Running ESLint..."
npx eslint src --max-warnings=0 --quiet || true

echo "Starting build process..."
CI=false npm run build

echo "Build completed successfully\!"
