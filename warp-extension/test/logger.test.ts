/**
 * Tests for Logger Utility
 * 
 * Tests the logging functionality and configuration.
 */

import { Logger, LogLevel } from '../src/utils/logger';

describe('Logger', () => {
  let logger: Logger;
  let mockConsoleInfo: jest.SpyInstance;
  let mockConsoleDebug: jest.SpyInstance;
  let mockConsoleWarn: jest.SpyInstance;
  let mockConsoleError: jest.SpyInstance;

  beforeEach(() => {
    logger = new Logger({
      level: LogLevel.DEBUG,
      enableConsole: true,
      enableFile: false
    });
    
    // Mock all console methods
    mockConsoleInfo = jest.spyOn(console, 'info').mockImplementation();
    mockConsoleDebug = jest.spyOn(console, 'debug').mockImplementation();
    mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
    mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    mockConsoleInfo.mockRestore();
    mockConsoleDebug.mockRestore();
    mockConsoleWarn.mockRestore();
    mockConsoleError.mockRestore();
  });

  describe('Logger Creation', () => {
    it('should create logger with options', () => {
      expect(logger).toBeDefined();
      expect(logger instanceof Logger).toBe(true);
    });

    it('should use default options if not specified', () => {
      const defaultLogger = new Logger();
      expect(defaultLogger).toBeDefined();
    });
  });

  describe('Log Levels', () => {
    it('should have correct log level enum values', () => {
      expect(LogLevel.DEBUG).toBe(0);
      expect(LogLevel.INFO).toBe(1);
      expect(LogLevel.WARN).toBe(2);
      expect(LogLevel.ERROR).toBe(3);
    });
  });

  describe('Log Level Methods', () => {
    it('should call console.debug for debug messages', () => {
      logger.debug('Debug message');
      expect(mockConsoleDebug).toHaveBeenCalledWith(
        expect.stringContaining('DEBUG:')
      );
    });

    it('should call console.info for info messages', () => {
      logger.info('Info message');
      expect(mockConsoleInfo).toHaveBeenCalledWith(
        expect.stringContaining('INFO:')
      );
    });

    it('should call console.warn for warn messages', () => {
      logger.warn('Warning message');
      expect(mockConsoleWarn).toHaveBeenCalledWith(
        expect.stringContaining('WARN:')
      );
    });

    it('should call console.error for error messages', () => {
      logger.error('Error message');
      expect(mockConsoleError).toHaveBeenCalledWith(
        expect.stringContaining('ERROR:')
      );
    });
  });

  describe('Log Filtering', () => {
    beforeEach(() => {
      logger = new Logger({
        level: LogLevel.WARN,
        enableConsole: true,
        enableFile: false
      });
      
      // Clear all mocks
      jest.clearAllMocks();
    });

    it('should not log debug messages when level is WARN', () => {
      logger.debug('This should not appear');
      expect(mockConsoleDebug).not.toHaveBeenCalled();
    });

    it('should not log info messages when level is WARN', () => {
      logger.info('This should not appear');
      expect(mockConsoleInfo).not.toHaveBeenCalled();
    });

    it('should log warning messages when level is WARN', () => {
      logger.warn('This should appear');
      expect(mockConsoleWarn).toHaveBeenCalledWith(
        expect.stringContaining('WARN:')
      );
    });

    it('should log error messages when level is WARN', () => {
      logger.error('This should appear');
      expect(mockConsoleError).toHaveBeenCalledWith(
        expect.stringContaining('ERROR:')
      );
    });
  });

  describe('Message Formatting', () => {
    it('should include timestamp in formatted message', () => {
      logger.info('Test message');
      expect(mockConsoleInfo).toHaveBeenCalledWith(
        expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T.*\].*INFO:.*Test message/)
      );
    });

    it('should handle additional arguments', () => {
      const testData = { key: 'value' };
      logger.info('Test message', testData);
      expect(mockConsoleInfo).toHaveBeenCalledWith(
        expect.stringContaining('Test message')
      );
    });
  });

  describe('Child Logger', () => {
    it('should create child logger with prefix', () => {
      const childLogger = logger.child('TestModule');
      expect(childLogger).toBeDefined();
      
      childLogger.info('Child message');
      expect(mockConsoleInfo).toHaveBeenCalledWith(
        expect.stringContaining('[TestModule] Child message')
      );
    });
  });

  describe('Cleanup', () => {
    it('should have close method for cleanup', () => {
      expect(typeof logger.close).toBe('function');
      
      // Should not throw
      expect(() => logger.close()).not.toThrow();
    });
  });
});
