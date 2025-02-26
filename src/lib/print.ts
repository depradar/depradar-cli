export enum LogLevel {
  silent = 0,
  error = 1,
  warn = 2,
  info = 3,
  verbose = 4,
}

export class Print {
  private static currentLogLevel: LogLevel = LogLevel.info;

  static setLogLevel(level: string) {
    const logLevel = LogLevel[level as keyof typeof LogLevel];
    if (logLevel !== undefined) {
      this.currentLogLevel = logLevel;
    } else {
      console.warn(`Unknown log level: ${level}`);
    }
  }

  static log(message: string, loglevel: LogLevel = LogLevel.info) {
    if (loglevel <= this.currentLogLevel) {
      switch (loglevel) {
        case LogLevel.error:
          console.error(message);
          break;
        case LogLevel.warn:
          console.warn(message);
          break;
        case LogLevel.info:
          console.info(message);
          break;
        case LogLevel.verbose:
        default:
          console.log(message);
          break;
      }
    }
  }
}
