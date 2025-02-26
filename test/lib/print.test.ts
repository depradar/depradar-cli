import { Print, LogLevel } from '@/lib/print';

describe('Print', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'info').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('setLogLevel', () => {
    it('should set the log level correctly', () => {
      Print.setLogLevel('error');
      expect(Print['currentLogLevel']).toBe(LogLevel.error);
    });

    it('should warn on unknown log level', () => {
      const warnSpy = jest.spyOn(console, 'warn');
      Print.setLogLevel('unknown');
      expect(warnSpy).toHaveBeenCalledWith('Unknown log level: unknown');
    });
  });

  describe('log', () => {
    it('should log messages at or below the current log level', () => {
      Print.setLogLevel('info');
      Print.log('This is an info message', LogLevel.info);
      expect(console.info).toHaveBeenCalledWith('This is an info message');
    });

    it('should not log messages above the current log level', () => {
      Print.setLogLevel('warn');
      Print.log('This is an info message', LogLevel.info);
      expect(console.info).not.toHaveBeenCalled();
    });

    it('should log error messages', () => {
      Print.setLogLevel('error');
      Print.log('This is an error message', LogLevel.error);
      expect(console.error).toHaveBeenCalledWith('This is an error message');
    });

    it('should log warn messages', () => {
      Print.setLogLevel('warn');
      Print.log('This is a warn message', LogLevel.warn);
      expect(console.warn).toHaveBeenCalledWith('This is a warn message');
    });

    it('should log verbose messages', () => {
      Print.setLogLevel('verbose');
      Print.log('This is a verbose message', LogLevel.verbose);
      expect(console.log).toHaveBeenCalledWith('This is a verbose message');
    });

    it('should default to info log level', () => {
      Print.setLogLevel('info');
      Print.log('This is an info message');
      expect(console.info).toHaveBeenCalledWith('This is an info message');
    });
  });
});
