import { RouteObject } from 'react-router-dom';
import App from './App';

// This file now just re-exports the routes defined in App.tsx to avoid circular dependencies
// If anything needs to import routes, it should import from App.tsx directly
const emptyRoutes: RouteObject[] = [];
export default emptyRoutes;