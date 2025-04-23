#\!/bin/bash
set -e

echo "Starting clean rebuild process..."
cd /Users/yotamnordman/Work/base/base-webapp

# Backup original files
mkdir -p _backup
cp -r src _backup/
cp package.json _backup/
cp tsconfig.json _backup/

# Create minimal functional app
mkdir -p src

# Create src/App.tsx
cat > src/App.tsx << 'APP'
import React from 'react';

function App() {
  return (
    <div>
      <h1>Base - מערכת ניהול מאמנים ומתאמנים</h1>
      <p>ברוכים הבאים למערכת Base</p>
    </div>
  );
}

export default App;
APP

# Create src/index.tsx
cat > src/index.tsx << 'INDEX'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
INDEX

# Create src/index.css
cat > src/index.css << 'CSS'
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  direction: rtl;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
CSS

# Create src/reportWebVitals.ts
cat > src/reportWebVitals.ts << 'WEBVITALS'
import { ReportHandler } from 'web-vitals';

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
WEBVITALS

# Create src/App.test.tsx
cat > src/App.test.tsx << 'APPTEST'
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders welcome message', () => {
  render(<App />);
  const textElement = screen.getByText(/Base/i);
  expect(textElement).toBeInTheDocument();
});
APPTEST

# Run the build
echo "Running build with minimal app..."
CI=false npm run build

echo "Build completed\! Check for errors."
