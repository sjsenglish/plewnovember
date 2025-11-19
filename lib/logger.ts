/**
 * Secure logger utility that only logs in development mode
 * Use this instead of console.log to prevent sensitive data from appearing in production logs
 */

const isDevelopment = process.env.NODE_ENV === 'development'

export const logger = {
  /**
   * Log general information (only in development)
   */
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args)
    }
  },

  /**
   * Log errors (always logged, but sanitized in production)
   */
  error: (...args: any[]) => {
    if (isDevelopment) {
      console.error(...args)
    } else {
      // In production, log errors but without potentially sensitive details
      console.error('[Error occurred - check application logs]')
    }
  },

  /**
   * Log warnings (only in development)
   */
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args)
    }
  },

  /**
   * Log debug information (only in development)
   */
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.log('[DEBUG]', ...args)
    }
  },
}
