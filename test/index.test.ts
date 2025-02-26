import { LogLevel, Print } from '@/lib/print';
import DependencyScanner from '@/lib/dependencyScanner';

jest.mock('child_process');
jest.mock('@/lib/print');
jest.mock('@/lib/dependencyScanner');

xdescribe('index.ts', () => {
  const originalArgv = process.argv;

  beforeEach(() => {
    jest.clearAllMocks();
    process.argv = [...originalArgv];
  });

  afterAll(() => {
    process.argv = originalArgv;
  });

  it('should show help when no arguments are provided', () => {
    process.argv = ['node', 'index.js'];
    require('@/index');
    expect(Print.log).toHaveBeenCalledWith('Usage: npx depradar scan [--loglevel <level>]');
  });

  it('should set log level when --loglevel argument is provided', () => {
    process.argv = ['node', 'index.js', '--loglevel', 'verbose'];
    require('@/index');
    expect(Print.setLogLevel).toHaveBeenCalledWith('verbose');
  });

  fit('should scan dependencies when scan argument is provided', () => {
    process.argv = ['node', 'index.js', 'scan'];
    require('@/index');
    expect(DependencyScanner).toHaveBeenCalled();
    expect(DependencyScanner.prototype.getDependencies).toHaveBeenCalled();
  });

  it('should show help when help argument is provided', () => {
    process.argv = ['node', 'index.js', 'help'];
    require('@/index');
    expect(Print.log).toHaveBeenCalledWith('Usage: npx depradar scan [--loglevel <level>]');
  });

  it('should show error for unknown arguments', () => {
    process.argv = ['node', 'index.js', 'unknown'];
    require('@/index');
    expect(Print.log).toHaveBeenCalledWith('Unknown argument: unknown', LogLevel.error);
  });
});
