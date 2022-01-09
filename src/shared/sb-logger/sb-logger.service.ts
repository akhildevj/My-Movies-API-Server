import { ConsoleLogger, Injectable, LogLevel, Scope } from '@nestjs/common';

type CONSOLE_LOG_LEVELS = 'debug' | 'error' | 'info' | 'log' | 'warn';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class SbLogger extends ConsoleLogger {
  prettyPrintLog: boolean;
  constructor(context?, options = {}) {
    super(context, options);
    this.init();
  }

  private init() {
    const LOGGER_LEVEL = process.env.LOGGER_LEVEL || 'log';
    const loggerLevel: LogLevel[] = ['error', 'warn', 'log', 'debug'];
    const envLogIndex = loggerLevel.findIndex((i) => i === LOGGER_LEVEL);
    this.setLogLevels(loggerLevel.slice(0, envLogIndex + 1));
    this.prettyPrintLog = JSON.parse(process.env.PRETTY_PRINT_LOG || 'false');
  }

  /**
   * 'log' level log.
   */
  log(message: any, ...args) {
    if (!this.isLevelEnabled('log')) {
      return;
    }
    if (this.isPrettyPrint()) {
      super.log.apply(this, [message, ...args]);
      return;
    }
    this.printPlain(message, 'log');
  }

  /**
   * 'error' level log.
   */
  error(message: any, ...args) {
    if (!this.isLevelEnabled('error')) {
      return;
    }
    if (this.isPrettyPrint()) {
      super.error.apply(this, [message, ...args]);
      return;
    }
    this.printPlain(message, 'error');
  }

  /**
   * 'warn' level log.
   */
  warn(message: any, ...args) {
    if (!this.isLevelEnabled('warn')) {
      return;
    }
    if (this.isPrettyPrint()) {
      super.warn.apply(this, [message, ...args]);
      return;
    }
    this.printPlain(message, 'warn');
  }

  /**
   * 'debug' level log.
   */
  debug(message: any, ...args) {
    if (!this.isLevelEnabled('debug')) {
      return;
    }
    if (this.isPrettyPrint()) {
      super.debug.apply(this, [message, ...args]);
      return;
    }
    this.printPlain(message, 'debug');
  }

  /**
   * 'verbose' level log.
   */
  verbose(message: any, ...args) {
    if (!this.isLevelEnabled('verbose')) {
      return;
    }
    if (this.isPrettyPrint()) {
      super.verbose.apply(this, [message, ...args]);
      return;
    }
    this.printPlain(message, 'debug');
  }

  private isPrettyPrint() {
    return this.prettyPrintLog;
  }

  private printPlain(message: any, level: CONSOLE_LOG_LEVELS) {
    const formattedLog = `[${this.context || 'NA'}] ${
      this.isObject(message) ? JSON.stringify(message) : message
    }`;
    console[level](formattedLog);
  }

  private isObject(a: Record<string, any>): boolean {
    return !!a && a.constructor === Object;
  }
}
