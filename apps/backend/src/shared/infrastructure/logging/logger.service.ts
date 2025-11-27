import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';

/**
 * Logger Service
 *
 * Provides structured logging for the application.
 * Can be extended to integrate with external logging services.
 */
@Injectable()
export class LoggerService implements NestLoggerService {
  private context?: string;

  setContext(context: string): void {
    this.context = context;
  }

  log(message: string, context?: string): void {
    const ctx = context || this.context || 'Application';
    console.log(`[${ctx}] ${message}`);
  }

  error(message: string, trace?: string, context?: string): void {
    const ctx = context || this.context || 'Application';
    console.error(`[${ctx}] ERROR: ${message}`);
    if (trace) {
      console.error(trace);
    }
  }

  warn(message: string, context?: string): void {
    const ctx = context || this.context || 'Application';
    console.warn(`[${ctx}] WARN: ${message}`);
  }

  debug(message: string, context?: string): void {
    if (process.env.NODE_ENV === 'development') {
      const ctx = context || this.context || 'Application';
      console.debug(`[${ctx}] DEBUG: ${message}`);
    }
  }

  verbose(message: string, context?: string): void {
    if (process.env.NODE_ENV === 'development') {
      const ctx = context || this.context || 'Application';
      console.log(`[${ctx}] VERBOSE: ${message}`);
    }
  }
}
