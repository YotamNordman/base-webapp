#\!/bin/bash
echo "Starting build process..."
cd /Users/yotamnordman/Work/base/base-webapp

echo "Checking TypeScript errors..."
npx tsc --noEmit

if [ $? -ne 0 ]; then
    echo "TypeScript compilation failed. Please fix the errors above."
    exit 1
fi

echo "Running build..."
npm run build

if [ $? -ne 0 ]; then
    echo "Build failed. Please check the errors above."
    exit 1
fi

echo "Build completed successfully\!"
