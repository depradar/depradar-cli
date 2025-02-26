import LockFile from '@/lib/lockFile';
import fs from 'fs';
import path from 'path';

jest.mock('fs');
jest.mock('path');
jest.mock('@/lib/print', () => ({
  Print: {
    log: jest.fn(),
  },
  LogLevel: {
    verbose: 'verbose',
    warn: 'warn',
  },
}));

describe('LockFile', () => {
  const mockFsExistsSync = fs.existsSync as jest.Mock;
  const mockFsReadFileSync = fs.readFileSync as jest.Mock;
  const mockPathResolve = path.resolve as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load package-lock.json if it exists', () => {
    mockFsExistsSync.mockImplementation((src) => src === 'package-lock.json');
    mockFsReadFileSync.mockReturnValueOnce(
      JSON.stringify({
        packages: {
          'node_modules/test-package': { version: '1.0.0' },
        },
      })
    );
    mockPathResolve.mockReturnValueOnce('package-lock.json');

    const lockFile = new LockFile();

    expect(lockFile.hasLockFile).toBe(true);
    expect(lockFile.getInstalledVersion('test-package')).toBe('1.0.0');
  });

  it('should load pnpm-lock.yaml if it exists', () => {
    mockFsExistsSync.mockImplementation((src) => src === 'pnpm-lock.yaml');
    mockFsReadFileSync.mockReturnValueOnce(`
      packages:
        test-package@1.0.0:
    `);
    mockPathResolve.mockReturnValueOnce('pnpm-lock.yaml');

    const lockFile = new LockFile();

    expect(lockFile.hasLockFile).toBe(true);
    expect(lockFile.getInstalledVersion('test-package')).toBe('1.0.0');
  });

  // it('should load yarn.lock if it exists', () => {
  //   mockFsExistsSync.mockReturnValueOnce(false).mockReturnValueOnce(false).mockReturnValueOnce(true);
  //   mockFsReadFileSync.mockReturnValueOnce(`
  //     "test-package@^1.0.0":
  //       version "1.0.0"
  //   `);
  //   mockPathResolve.mockReturnValueOnce('yarn.lock');

  //   const lockFile = new LockFile();

  //   expect(lockFile.hasLockFile).toBe(true);
  //   expect(lockFile.getInstalledVersion('test-package')).toBe('1.0.0');
  // });

  // it('should load bun.lockb if it exists', () => {
  //   mockFsExistsSync
  //     .mockReturnValueOnce(false)
  //     .mockReturnValueOnce(false)
  //     .mockReturnValueOnce(false)
  //     .mockReturnValueOnce(true);
  //   mockFsReadFileSync.mockReturnValueOnce(`
  //     "test-package": {
  //       "version": "1.0.0"
  //     }
  //   `);
  //   mockPathResolve.mockReturnValueOnce('bun.lockb');

  //   const lockFile = new LockFile();

  //   expect(lockFile.hasLockFile).toBe(true);
  //   expect(lockFile.getInstalledVersion('test-package')).toBe('1.0.0');
  // });

  it('should return undefined if no lock file exists', () => {
    mockFsExistsSync.mockReturnValue(false);

    const lockFile = new LockFile();

    expect(lockFile.hasLockFile).toBe(false);
    expect(lockFile.getInstalledVersion('test-package')).toBeUndefined();
  });

  it('should return undefined if package is not found in lock file', () => {
    mockFsExistsSync.mockReturnValueOnce(true);
    mockFsReadFileSync.mockReturnValueOnce(
      JSON.stringify({
        packages: {
          'node_modules/another-package': { version: '1.0.0' },
        },
      })
    );
    mockPathResolve.mockReturnValueOnce('package-lock.json');

    const lockFile = new LockFile();

    expect(lockFile.hasLockFile).toBe(true);
    expect(lockFile.getInstalledVersion('test-package')).toBeUndefined();
  });
});
