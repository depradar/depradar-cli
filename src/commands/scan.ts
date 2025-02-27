import { Command } from 'commander';
import { LogLevel, Print } from '@/utils/print';
import DependencyScanner from '@/utils/dependencyScanner';
import ApiHelper from '@/utils/apiHelper';

export function scanCommand(): Command {
  return new Command('scan')
    .description('Performs a scan of the repository and uploads the results')
    .option('-k, --apiKey <value>', 'Your Teams API key', process.env.DEPRADAR_API_KEY)
    .option('-r, --repository <value>', 'The repository name')
    .option('-b, --branch <value>', 'The branch name')
    .option('-d, --dry-run', 'Run the scan without uploading results')
    .action(async (options) => {
      const dependencyScanner = new DependencyScanner();
      const components = dependencyScanner.getDependencies();

      Print.log('Found dependencies:', options.dryRun ? LogLevel.info : LogLevel.verbose);
      Print.log(components, options.dryRun ? LogLevel.info : LogLevel.verbose);

      if (options.dryRun) {
        Print.log('Running in dry-run mode, results will not be uploaded', LogLevel.info);
        return;
      }

      // Upload the results
      const apiHelper = new ApiHelper(options.apiKey);
      await apiHelper.uploadScanResults({
        repository: options.repository,
        branch: options.branch,
        components,
      });
    });
}
