/**
 * Logger utility to centralize logging and handle environment-based log behavior
 */

const isDevEnvironment = process.env.NODE_ENV === 'development';
const isDebugMode = process.env.REACT_APP_DEBUG === 'true';

/**
 * Centralized logger to control logging across environments
 */
export const logger = {
  /**
   * Log info messages (only in development or when debug is enabled)
   */
  info: (...args: any[]): void => {
    if (isDevEnvironment || isDebugMode) {
      // eslint-disable-next-line no-console
      console.log(...args);
    }
  },
  
  /**
   * Log warning messages (only in development or when debug is enabled)
   */
  warn: (...args: any[]): void => {
    if (isDevEnvironment || isDebugMode) {
      // eslint-disable-next-line no-console
      console.warn(...args);
    }
  },
  
  /**
   * Log error messages (always logged)
   */
  error: (...args: any[]): void => {
    // eslint-disable-next-line no-console
    console.error(...args);
  },
  
  /**
   * Log debug messages (only in development or when debug is explicitly enabled)
   */
  debug: (...args: any[]): void => {
    if (isDevEnvironment && isDebugMode) {
      // eslint-disable-next-line no-console
      console.debug(...args);
    }
  }
};