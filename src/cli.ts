#!/usr/bin/env node

import { program } from 'commander';
import { registerCommands } from '@/commands';
import { LogLevel, Print } from '@/utils/print';

registerCommands(program);

program.option('-v, --verbose', 'Enable verbose logging');

program.on('option:verbose', function () {
  Print.setLogLevel(LogLevel.verbose);
});

program.parse(process.argv);
