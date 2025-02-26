import fs from 'fs';
import DependencyScanner from '@/lib/dependencyScanner';
import LockFile from '@/lib/lockFile';
import { Print, LogLevel } from '@/lib/print';

jest.mock('fs');
jest.mock('@/lib/lockFile');
jest.spyOn(Print, 'log').mockImplementation(() => {});

describe('DependencyScanner', () => {
  let lockFileMock: jest.Mocked<LockFile>;

  beforeEach(() => {
    lockFileMock = new LockFile() as jest.Mocked<LockFile>;
    (LockFile as jest.Mock).mockImplementation(() => lockFileMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log scanning message', () => {
    const scanner = new DependencyScanner();
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({}));

    scanner.getDependencies();

    expect(Print.log).toHaveBeenCalledWith('Scanning for dependencies...', LogLevel.info);
  });

  it('should return dependencies with installed versions', () => {
    const packageJson = {
      dependencies: {
        'package-a': '^1.0.0',
      },
      devDependencies: {
        'package-b': '^2.0.0',
      },
    };
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(packageJson));
    lockFileMock.getInstalledVersion.mockImplementation((packageName) => {
      if (packageName === 'package-a') return '1.0.1';
      if (packageName === 'package-b') return '2.1.0';
      return undefined;
    });

    const scanner = new DependencyScanner();
    const result = scanner.getDependencies();

    expect(result).toEqual({
      'package-a': { type: 'dependency', version: '1.0.1' },
      'package-b': { type: 'devDependency', version: '2.1.0' },
    });
  });

  it('should handle missing installed versions', () => {
    const packageJson = {
      dependencies: {
        'package-a': '^1.0.0',
      },
    };
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(packageJson));
    lockFileMock.getInstalledVersion.mockReturnValue(undefined);

    const scanner = new DependencyScanner();
    const result = scanner.getDependencies();

    expect(result).toEqual({
      'package-a': { type: 'dependency', version: 'Not installed' },
    });
  });

  it('should log each dependency with version range and installed version', () => {
    const packageJson = {
      dependencies: {
        'package-a': '^1.0.0',
      },
    };
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(packageJson));
    lockFileMock.getInstalledVersion.mockReturnValue('1.0.1');

    const scanner = new DependencyScanner();
    scanner.getDependencies();

    expect(Print.log).toHaveBeenCalledWith('package-a: ^1.0.0 (Installed: 1.0.1)', LogLevel.verbose);
  });
});
