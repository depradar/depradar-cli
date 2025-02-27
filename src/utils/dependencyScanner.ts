import fs from 'fs';
import { Print, LogLevel } from './print';
import LockFile from './lockFile';

type PackageJson = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
  bundledDependencies?: Record<string, string>;
};

type ResultType = {
  [packageName: string]: {
    type: 'dependency' | 'devDependency' | 'peerDependency' | 'optionalDependency' | 'bundledDependency';
    version: string;
  };
};

export default class DependencyScanner {
  private lockFile: LockFile;

  constructor() {
    this.lockFile = new LockFile();
  }

  private getInstalledVersion(packageName: string): string | undefined {
    const version = this.lockFile.getInstalledVersion(packageName);

    return version;
  }

  public getDependencies(): ResultType {
    Print.log('Scanning for dependencies...', LogLevel.info);

    // Read package.json file and log out dependencies
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8')) as PackageJson;

    const dependencyTypes = [
      { key: 'dependencies', type: 'dependency' },
      { key: 'devDependencies', type: 'devDependency' },
      { key: 'peerDependencies', type: 'peerDependency' },
      { key: 'optionalDependencies', type: 'optionalDependency' },
      { key: 'bundledDependencies', type: 'bundledDependency' },
    ] as const;

    const result: ResultType = {};

    for (const { key, type } of dependencyTypes) {
      const dependencies = packageJson[key];

      if (!dependencies) continue;

      for (const [packageName, versionRange] of Object.entries(dependencies)) {
        const installedVersion = this.getInstalledVersion(packageName) || 'Not installed';
        result[packageName] = { type, version: installedVersion };
        Print.log(`${packageName}: ${versionRange} (Installed: ${installedVersion})`, LogLevel.verbose);
      }
    }

    return result;
  }
}
