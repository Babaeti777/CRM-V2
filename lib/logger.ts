/**
 * Structured logging utility
 * For production, integrate with services like Datadog, Sentry, or LogRocket
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, unknown>
  error?: Error
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  private formatLog(entry: LogEntry): string {
    const { level, message, timestamp, context, error } = entry

    if (this.isDevelopment) {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}${
        context ? ` | ${JSON.stringify(context)}` : ''
      }${error ? `\n${error.stack}` : ''}`
    }

    // Structured JSON logging for production
    return JSON.stringify({
      level,
      message,
      timestamp,
      ...context,
      ...(error && {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
      }),
    })
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    }

    const formatted = this.formatLog(entry)

    // Output to appropriate console method
    switch (level) {
      case 'debug':
        if (this.isDevelopment) console.debug(formatted)
        break
      case 'info':
        console.log(formatted)
        break
      case 'warn':
        console.warn(formatted)
        break
      case 'error':
        console.error(formatted)
        break
    }

    // In production, send to logging service
    if (!this.isDevelopment) {
      this.sendToLoggingService(entry)
    }
  }

  private sendToLoggingService(_entry: LogEntry) {
    // TODO: Integrate with logging service (Datadog, Sentry, etc.)
    // Example:
    // if (window.Sentry) {
    //   window.Sentry.captureMessage(entry.message, {
    //     level: entry.level,
    //     extra: entry.context,
    //   })
    // }
  }

  /**
   * Log debug information (development only)
   */
  debug(message: string, context?: Record<string, unknown>) {
    this.log('debug', message, context)
  }

  /**
   * Log informational messages
   */
  info(message: string, context?: Record<string, unknown>) {
    this.log('info', message, context)
  }

  /**
   * Log warning messages
   */
  warn(message: string, context?: Record<string, unknown>) {
    this.log('warn', message, context)
  }

  /**
   * Log error messages
   */
  error(message: string, error?: Error, context?: Record<string, unknown>) {
    this.log('error', message, context, error)
  }

  /**
   * Log API requests
   */
  apiRequest(method: string, path: string, userId?: string) {
    this.info('API Request', {
      method,
      path,
      userId,
    })
  }

  /**
   * Log API responses
   */
  apiResponse(method: string, path: string, status: number, duration: number) {
    const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info'
    this.log(level, 'API Response', {
      method,
      path,
      status,
      duration: `${duration}ms`,
    })
  }

  /**
   * Log authentication events
   */
  auth(event: string, userId?: string, success?: boolean) {
    this.info('Auth Event', {
      event,
      userId,
      success,
    })
  }

  /**
   * Log database queries (development only)
   */
  query(query: string, duration?: number) {
    if (this.isDevelopment) {
      this.debug('Database Query', {
        query,
        ...(duration && { duration: `${duration}ms` }),
      })
    }
  }
}

// Export singleton instance
export const logger = new Logger()

// Export for testing
export { Logger }
