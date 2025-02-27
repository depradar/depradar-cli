import { program } from 'commander';
import { scanCommand } from './scan';

export function registerCommands(prog: typeof program) {
  prog.addCommand(scanCommand());
}
