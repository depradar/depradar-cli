import { LogLevel, Print } from '@/lib/print';
import fs from 'fs';
import path from 'path';
import YAML from 'yaml';

type PackageLockJson = {
  packages: Record<string, { version: string }>;
};

type PnpmLockJson = {
  packages: Record<string, {}>;
};

export default class LockFile {
  private lockFileContent: string | undefined;
  private lockFileType: string | undefined;

  public get hasLockFile(): boolean {
    return !!this.lockFileContent;
  }

  constructor() {
    this.loadLockFile();
  }

  private loadLockFile(): void {
    const lockFiles = ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'bun.lockb'] as const;
    for (const lockFile of lockFiles) {
      if (fs.existsSync(lockFile)) {
        this.lockFileType = lockFile;
        this.lockFileContent = fs.readFileSync(path.resolve(lockFile), 'utf8');
        Print.log(`Lock file found: ${lockFile}`, LogLevel.verbose);
        return;
      }
    }
    Print.log('No lock file found', LogLevel.warn);
  }

  public getInstalledVersion(packageName: string): string | undefined {
    if (!this.lockFileContent || !this.lockFileType) {
      return undefined;
    }

    switch (this.lockFileType) {
      case 'package-lock.json': {
        const lockJson = JSON.parse(this.lockFileContent) as PackageLockJson;
        const packageInfo = lockJson.packages?.[`node_modules/${packageName}`];

        if (packageInfo) return packageInfo.version;

        break;
      }
      case 'pnpm-lock.yaml': {
        const lockJson = YAML.parse(this.lockFileContent) as PnpmLockJson;
        if (!lockJson.packages) break;

        // Extract version number from string like '@esbuild/aix-ppc64@0.25.0'
        const packageString = Object.keys(lockJson.packages).find((key) => key.startsWith(packageName));
        const regex = new RegExp(`${packageName}@(.*)`, 'gm');
        const match = regex.exec(packageString || '');
        if (match) return match[1];

        break;
      }
      // TODO: finish implementing yarn and bun support
      // case 'yarn.lock': {
      //   const regex = new RegExp(`"${packageName}@.*":\\n  version "(.*)"`, 'gm');
      //   const match = regex.exec(this.lockFileContent);
      //   if (match) {
      //     return match[1];
      //   }
      //   break;
      // }
      // case 'bun.lockb': {
      //   const regex = new RegExp(`"${packageName}":\\n\\s+"version": "(.*)"`, 'gm');
      //   const match = regex.exec(this.lockFileContent);
      //   if (match) {
      //     return match[1];
      //   }
      //   break;
      // }
    }

    Print.log(`Could not find installed version for ${packageName} in ${this.lockFileType}`, LogLevel.warn);
    return;
  }
}
