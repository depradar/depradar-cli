#!/usr/bin/env node

import { LogLevel, Print } from '@/lib/print';
import DependencyScanner from '@/lib/dependencyScanner';

function main(): void {
  const args: string[] = process.argv.slice(2);

  if (args.includes('--loglevel')) {
    const logLevelIndex = args.indexOf('--loglevel') + 1;
    if (logLevelIndex < args.length) {
      Print.setLogLevel(args[logLevelIndex]);
    }
  }

  if (args.length === 0) {
    showHelp();
    return;
  }

  switch (args[0]) {
    case 'scan':
      const dependencyScanner = new DependencyScanner();
      dependencyScanner.getDependencies(args.slice(1));
      break;

    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;

    default:
      Print.log(`Unknown argument: ${args[0]}`, LogLevel.error);
      showHelp();
      break;
  }
}

function showHelp(): void {
  Print.log('Usage: npx depradar scan [--loglevel <level>]');
  Print.log('Options:');
  Print.log('  --loglevel <level>  Set the log level (silent, error, warn, info, verbose)');
}

main();
