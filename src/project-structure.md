# Base Webapp Project Structure

## Overview
This document defines the new AI-friendly project structure for the Base webapp, focused on creating smaller, more modular components with clear separation of concerns.

## Key Principles
- Break down large components into smaller, focused components
- Group related components, hooks, and utilities in feature directories
- Use descriptive folder names that explain functionality
- Keep files under 150 lines where possible
- Separate UI components from logic and data fetching

## Directory Structure

```
/src
├── assets/                  # Static assets like images, icons, fonts
├── components/              # Shared UI components
│   ├── common/              # App-wide generic components
│   │   ├── buttons/         # Button components
│   │   ├── cards/           # Card components  
│   │   ├── calendar/        # Calendar components
│   │   │   ├── Calendar.tsx # Main calendar component
│   │   │   └── AppointmentForm.tsx # Appointment creation/editing form
│   │   ├── inputs/          # Form input components
│   │   ├── layout/          # Layout components
│   │   ├── navigation/      # Navigation related components
│   │   ├── feedback/        # Loaders, alerts, etc.
│   │   └── typography/      # Text components
│   └── widgets/             # More complex reusable components
├── features/                # Feature-specific modules
│   ├── auth/                # Authentication feature
│   │   ├── components/      # Auth UI components
│   │   ├── hooks/           # Auth related hooks
│   │   ├── types/           # Auth type definitions
│   │   ├── utils/           # Auth utilities
│   │   └── index.ts         # Feature exports
│   ├── clients/             # Client management feature
│   ├── workouts/            # Workout management feature
│   ├── calendar/            # Calendar and scheduling feature
│   ├── analytics/           # Analytics and reporting feature
│   ├── nutrition/           # Nutrition tracking feature
│   └── messaging/           # Client-coach messaging feature
├── hooks/                   # Shared custom hooks
│   ├── useAuth.tsx          # Authentication hook
│   └── useCalendar.ts       # Calendar management hook
├── layouts/                 # Page layout templates
│   ├── components/          # Layout-specific components
│   ├── MainLayout.tsx       # Main app layout with navigation
│   ├── AuthLayout.tsx       # Authentication pages layout
│   └── index.ts             # Layouts exports
├── pages/                   # Page components
│   ├── auth/                # Auth pages (login, signup, etc)
│   ├── dashboard/           # Dashboard page components
│   ├── clients/             # Client management pages
│   ├── workouts/            # Workout management pages
│   ├── calendar/            # Calendar pages
│   ├── settings/            # Settings pages
│   └── error/               # Error pages (404, etc)
├── services/                # API services by domain
│   ├── api.ts               # Base API configuration
│   ├── authService.ts       # Auth related API calls
│   ├── clientsService.ts    # Client related API calls
│   ├── workoutsService.ts   # Workout related API calls
│   ├── appointmentService.ts # Appointment related API calls
│   ├── calendarService.ts   # Calendar related API calls
│   └── ...
├── store/                   # Global state management
│   ├── slices/              # Redux slices by domain
│   │   ├── authSlice.ts     # Authentication state
│   │   ├── clientsSlice.ts  # Clients state
│   │   ├── appointmentsSlice.ts # Appointments state
│   │   ├── calendarSlice.ts # Calendar view state
│   │   └── ...
│   ├── hooks.ts             # Custom hooks for store
│   └── index.ts             # Store configuration
├── styles/                  # Global styles and theme
│   ├── theme/               # Theme configuration
│   │   ├── palette.ts       # Color definitions
│   │   ├── typography.ts    # Typography settings
│   │   ├── components.ts    # Component style overrides
│   │   └── index.ts         # Theme exports
│   ├── globalStyles.ts      # Global style definitions
│   └── index.ts             # Style exports
├── types/                   # Global TypeScript types
│   ├── auth.ts              # Auth related types
│   ├── client.ts            # Client related types
│   ├── workout.ts           # Workout related types
│   ├── appointment.ts       # Appointment related types
│   ├── calendar.ts          # Calendar event types
│   └── ...
├── utils/                   # Utility functions
│   ├── date.ts              # Date manipulation utilities
│   ├── string.ts            # String utilities
│   ├── rtl.ts               # RTL support utilities
│   ├── validators.ts        # Form validation utilities
│   └── ...
├── config/                  # App configuration
│   ├── routes.ts            # Route definitions
│   ├── constants.ts         # App constants
│   └── ...
├── App.tsx                  # Main App component
├── index.tsx                # Entry point
└── routes.tsx               # Application routing
```

## Component Organization

### Approach
1. Each component file should ideally be less than 150 lines
2. Break complex components into smaller sub-components
3. Place local sub-components in the same folder as their parent
4. Use index.ts files to simplify imports

### Example: Breaking down a complex component

Instead of:
```
/components/WorkoutCard.tsx (200+ lines)
```

Use:
```
/features/workouts/components/workout-card/
├── WorkoutCardHeader.tsx
├── ExercisesList.tsx
├── WorkoutCardActions.tsx
├── WorkoutCardStatus.tsx
├── WorkoutCard.tsx          # Main component that composes the others
└── index.ts                 # Re-exports WorkoutCard
```

### Feature Structure Pattern

Each feature folder follows this standard structure:
```
/features/feature-name/
├── components/              # UI components specific to this feature
├── hooks/                   # Custom hooks specific to this feature
├── services/                # API services specific to this feature
├── types/                   # TypeScript types for this feature
├── utils/                   # Utility functions specific to this feature
└── index.ts                 # Re-exports public API of the feature
```

## Implementation Guidelines

1. Keep component responsibilities clear and specific
2. Extract repeated logic into custom hooks
3. Extract type definitions to appropriate type files
4. Group related components, not by type but by feature
5. Use absolute imports with path aliases where appropriate
6. Maintain consistent naming conventions throughout
