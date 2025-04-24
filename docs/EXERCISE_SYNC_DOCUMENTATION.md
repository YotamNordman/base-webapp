# Exercise Data Synchronization Mechanism

This document describes the synchronization mechanism for exercise data between the trainer webapp and the client app.

## Overview

The BASE application consists of two separate frontends with separate backends:

1. **Trainer Webapp** (`base-webapp`): The web application for trainers, running on port 5000
2. **Client App** (`base-client-app`): The mobile-oriented application for clients, running on port 5015

Each frontend needs access to the same exercise database. The trainer webapp is considered the master source of exercise data, which is synchronized with the client app.

## Synchronization Mechanisms

### 1. Automatic CSV Import Sync

When a CSV file with exercise data is imported in the trainer webapp:

- The `ExercisesController.cs` in `base-backend` processes the file and adds the exercises to its database
- The controller automatically calls `ExportExercisesToMobileBackend()` to export the data to JSON files
- These files are saved in the `ExerciseExports` directory under the backend's working directory

### 2. Manual Sync via UI

In the trainer webapp, the Exercise List Page includes a "Sync to Client App" button that:

- Calls the `/api/exercises/export` endpoint
- Exports all exercise categories and templates to JSON files
- Shows a success/error message to confirm the result

### 3. Client App Fallback Mechanism

The client app has been modified to use the trainer webapp as a fallback data source:

- First tries to fetch exercise data from its own backend (port 5015)
- If that fails, it attempts to fetch from the shared trainer backend API (port 5000)
- Caches the results in localStorage for offline use

### 4. Manual Sync Script

The `sync-exercises.sh` script provides a command-line way to synchronize the data:

- Calls the trainer backend export endpoint
- Copies the generated JSON files to a shared directory
- Provides guidance on completing the sync process

## Technical Implementation

### Trainer Backend (ExercisesController.cs)

The controller has two key components for sync:

1. **Export Endpoint**:
   ```csharp
   [HttpGet("export")]
   public IActionResult ExportExercises()
   ```

2. **Export Logic**:
   ```csharp
   private void ExportExercisesToMobileBackend()
   ```

This exports all exercise categories and templates to JSON files.

### Client App (exerciseService.ts)

The client app's exercise service uses a fallback mechanism:

```typescript
// First try the primary mobile backend
try {
  const response = await mobileApi.get<ExerciseTemplate[]>('/api/exercises/templates');
  // ...process response
} catch (primaryError) {
  // Try the shared exercise API from the trainer backend as fallback
  try {
    const response = await axios.get<ExerciseTemplate[]>(`${SHARED_EXERCISE_API_URL}/templates`);
    // ...process response
  } catch (secondaryError) {
    // Handle complete failure
  }
}
```

## How to Sync Exercises

### Method 1: Via Trainer Webapp UI

1. Log in to the trainer webapp
2. Go to the Exercise List page
3. Click the "Sync to Client App" button
4. Check the success message or error notification

### Method 2: Using the Sync Script

1. Make sure both backends are running
2. Run the sync script:
   ```bash
   ./sync-exercises.sh
   ```
3. Follow the on-screen instructions to complete the sync

### Method 3: Importing CSV

1. Log in to the trainer webapp
2. Go to the Exercise List page
3. Use the CSV import functionality to upload a CSV file
4. The exercises will be automatically exported for the client app

## Troubleshooting

If exercises are not showing up in the client app after synchronization:

1. **Check Backend Status**: Make sure both backends are running
2. **Clear Cache**: Clear localStorage in the client app browser
3. **Verify Export Files**: Check that the JSON files exist in the `ExerciseExports` directory
4. **Check Network Requests**: Use browser dev tools to check for network errors when fetching exercises
5. **Run Manual Sync**: Try using the sync script to force a complete refresh

## Future Improvements

Potential improvements to the sync mechanism:

1. **Real-time sync**: Implement WebSockets to notify the client app immediately when exercise data changes
2. **Versioning**: Add version numbers to exercise data to track changes
3. **Conflict resolution**: Develop strategies for handling conflicting exercise data
4. **Sync history**: Track synchronization history for audit and debugging
5. **Shared database**: Consider moving to a shared database for both backends