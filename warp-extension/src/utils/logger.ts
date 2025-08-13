/**
 * Logger utility for Warp-WebStorm Integration
 */

import { createWriteStream, WriteStream } from 'fs';
import { mkdir } from 'fs/promises';
import { dirname } from 'path';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export interface LoggerOptions {
  level?: LogLevel;
  enableConsole?: boolean;
  enableFile?: boolean;
  filePath?: string | undefined;
  maxFileSize?: number;
  maxFiles?: number;
}

class Logger {
  private level: LogLevel;
  private enableConsole: boolean;
  private enableFile: boolean;
  private fileStream?: WriteStream;
  private filePath?: string | undefined;

  constructor(options: LoggerOptions = {}) {
    this.level = options.level ?? this.parseLogLevel(process.env.LOG_LEVEL) ?? LogLevel.INFO;
    this.enableConsole = options.enableConsole ?? true;
    this.enableFile = options.enableFile ?? !!process.env.LOG_FILE;
    this.filePath = options.filePath ?? (process.env.LOG_FILE || undefined);
    
    if (this.enableFile && this.filePath) {
      this.initializeFileLogging();
    }
  }

  private parseLogLevel(level?: string): LogLevel | undefined {
    if (!level) return undefined;
    
    switch (level.toLowerCase()) {
      case 'debug': return LogLevel.DEBUG;
      case 'info': return LogLevel.INFO;
      case 'warn': return LogLevel.WARN;
      case 'error': return LogLevel.ERROR;
      default: return undefined;
    }
  }

  private async initializeFileLogging(): Promise<void> {
    if (!this.filePath) return;

    try {
      // Ensure directory exists
      await mkdir(dirname(this.filePath), { recursive: true });
      
      // Create write stream
      this.fileStream = createWriteStream(this.filePath, { 
        flags: 'a', // Append mode
        encoding: 'utf8'
      });
      
      this.fileStream.on('error', (error) => {
        console.error('Logger file stream error:', error);
        this.enableFile = false;
      });
      
    } catch (error) {
      console.error('Failed to initialize file logging:', error);
      this.enableFile = false;
    }
  }

  private formatMessage(level: LogLevel, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString();
    const levelName = LogLevel[level];
    const formattedMessage = this.formatArgs(message, ...args);
    
    return `[${timestamp}] ${levelName}: ${formattedMessage}`;
  }

  private formatArgs(message: string, ...args: any[]): string {
    if (args.length === 0) return message;
    
    // Handle structured logging
    const formattedArgs = args.map(arg => {
      if (typeof arg === 'object' && arg !== null) {
        try {
          return JSON.stringify(arg, null, 2);
        } catch {
          return String(arg);
        }
      }
      return String(arg);
    }).join(' ');
    
    return `${message} ${formattedArgs}`;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.level;
  }

  private log(level: LogLevel, message: string, ...args: any[]): void {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(level, message, ...args);
    
    // Console output
    if (this.enableConsole) {
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(formattedMessage);
          break;
        case LogLevel.INFO:
          console.info(formattedMessage);
          break;
        case LogLevel.WARN:
          console.warn(formattedMessage);
          break;
        case LogLevel.ERROR:
          console.error(formattedMessage);
          break;
      }
    }
    
    // File output
    if (this.enableFile && this.fileStream) {
      this.fileStream.write(formattedMessage + '\n');
    }
  }

  debug(message: string, ...args: any[]): void {
    this.log(LogLevel.DEBUG, message, ...args);
  }

  info(message: string, ...args: any[]): void {
    this.log(LogLevel.INFO, message, ...args);
  }

  warn(message: string, ...args: any[]): void {
    this.log(LogLevel.WARN, message, ...args);
  }

  error(message: string, ...args: any[]): void {
    this.log(LogLevel.ERROR, message, ...args);
  }

  // Create child logger with prefix
  child(prefix: string): Logger {
    const childLogger = Object.create(this);
    const originalLog = this.log.bind(this);
    
    childLogger.log = (level: LogLevel, message: string, ...args: any[]) => {
      originalLog(level, `[${prefix}] ${message}`, ...args);
    };
    
    return childLogger;
  }

  // Cleanup resources
  close(): void {
    if (this.fileStream) {
      this.fileStream.end();
    }
  }
}

// Create default logger instance
export const logger = new Logger({
  level: LogLevel.INFO,
  enableConsole: true,
  enableFile: !!process.env.LOG_FILE,
  filePath: process.env.LOG_FILE ? process.env.LOG_FILE : undefined
});

// Export logger class for custom instances
export { Logger };
