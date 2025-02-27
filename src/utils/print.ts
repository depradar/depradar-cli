export enum LogLevel {
  silent = 0,
  error = 1,
  warn = 2,
  info = 3,
  verbose = 4,
}

export class Print {
  private static currentLogLevel: LogLevel = LogLevel.info;

  static setLogLevel(level: LogLevel) {
    this.currentLogLevel = level;
  }

  static log(message: string | object, loglevel: LogLevel = LogLevel.info) {
    if (typeof message === 'object') {
      message = JSON.stringify(message, undefined, 2);
    }

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
