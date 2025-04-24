# Base Webapp

A React-based frontend application for the Base personal training management system. This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Features

The Base Webapp includes the following key features:

### Client Management
- Client profiles with demographic data, fitness history, and goals
- Progress tracking with measurements and photos
- Client dashboard with upcoming workouts and achievements

### Workout Management
- Create, edit, and assign workout templates to clients
- Track workout completion status and performance
- View workout history and progression

### Exercise Library
- Comprehensive exercise database with categories
- Exercise details including instructions, videos, and equipment needed
- Create custom exercises or choose from templates

### Training Block System
- Create periodized training plans across multiple weeks
- Organize workouts into meaningful training blocks
- Track client progress throughout training cycles

### Calendar & Appointments
- Schedule and manage client appointments
- View weekly and monthly training schedules
- Automated reminders and notifications

### Trainer Methodology
- Create and apply structured training methodologies
- Define workout types, training styles, and progression strategies
- Implement RIR (Reps In Reserve) based training systems
- Track and adapt periodization blocks based on client responses
- Apply specific progression models to different exercise types
- Implement measurement protocols for accurate progress tracking

## Available Scripts

In the project directory, you can run:

### Development Scripts

- **`npm start`**  
  Runs the app in development mode with default settings.  
  Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

- **`npm run start:local`**  
  Runs the app with API pointing to a local backend at http://localhost:5000/api.

- **`npm run start:backend`**  
  Same as start:local - uses the local backend at http://localhost:5000/api.

- **`npm run start:mock`**  
  Runs the app using mock data instead of actual API calls. Useful for frontend-only development.

### Build Scripts

- **`npm run build`**  
  Builds the app for production to the `build` folder, using environment variables from `.env.production`.
  
- **`npm run build:prod`**  
  Builds with explicit production settings, overriding environment variables.

### Other Scripts

- **`npm test`**  
  Launches the test runner in interactive watch mode.  
  See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

- **`npm run lint`**  
  Runs ESLint to check code quality and style issues. The project uses a centralized logger utility and consistent code style.

The page will reload if you make edits in development mode.  
You will also see any lint errors in the console.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Code Quality & Conventions

To maintain high code quality, this project implements the following practices:

### Logger Utility

Instead of directly using `console.log`, the application uses a centralized logger utility:

```typescript
import { logger } from '../utils';

// Usage:
logger.info('Information message');
logger.warn('Warning message');
logger.error('Error message');
logger.debug('Debug-only message');
```

The logger automatically respects the current environment and only logs appropriate messages based on environment settings.

### Unused Variables

For variables that are required by interfaces but unused in implementation, use the `markAsUnused` utility:

```typescript
import { markAsUnused } from '../utils';

function Component({ required, unused }) {
  markAsUnused(unused);
  // Implementation using only the 'required' prop
}
```

This helps clearly document intentionally unused variables.

## Environment Configuration

This application uses environment variables to configure settings like API URLs. This approach allows the same codebase to work in different environments (development, staging, production) without code changes.

### Configuration Files

- `.env`: Default environment settings
- `.env.development`: Development-specific settings (used with `npm start`)
- `.env.production`: Production-specific settings (used with `npm run build`)

### Available Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Base URL for API requests | `http://localhost:5000/api` |
| `REACT_APP_DEBUG` | Enable debug mode | `true` in development, `false` in production |

### Accessing Environment Variables

Environment variables are exposed in your JS code through `process.env.VARIABLE_NAME`. Variables must be prefixed with `REACT_APP_` to be picked up by Create React App.

```js
// Example usage in code
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

### Setting Environment Variables Locally

You can set environment variables locally in a few ways:

1. Modify the `.env` files
2. Create a `.env.local` file (for personal overrides, not committed to git)
3. Set environment variables in your shell before running npm scripts:

```bash
# Unix/macOS
REACT_APP_API_URL=http://localhost:8000/api npm start

# Windows
set REACT_APP_API_URL=http://localhost:8000/api && npm start
```

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
