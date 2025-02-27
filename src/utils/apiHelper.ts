import { LogLevel, Print } from './print';

type ScanBody = {
  repository: string;
  branch: string;
  components: {
    [key: string]: {
      type: 'dependency' | 'devDependency' | 'peerDependency' | 'optionalDependency' | 'bundledDependency';
      version: string;
    };
  };
};

export default class ApiHelper {
  private readonly baseUrl = process.env.DEPRADAR_API_URL || 'https://depradar.dev';

  constructor(private apiKey: string) {
    if (!this.apiKey) {
      throw Error('No API key provided.');
    }
  }

  async uploadScanResults(body: ScanBody): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/api/snapshot/create`;
      Print.log('Uploading scan results...', LogLevel.verbose);
      Print.log({ url, body }, LogLevel.verbose);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw response;
      }

      Print.log(`Scan results uploaded successfully, view them now at ${this.baseUrl}/dashboard`, LogLevel.info);

      return true;
    } catch (error) {
      Print.log('Failed to upload scan results', LogLevel.error);

      if (error instanceof Response) {
        const body = await error.json();

        switch (error.status) {
          case 403:
            Print.log('Authentication failed - check your API key and try again', LogLevel.error);
            break;
          case 400:
            if (body.error) {
              // Log out the messages
              Object.values(body.error).forEach((error: any) => {
                Print.log(error[0], LogLevel.error);
              });
              break;
            }

            Print.log(`Bad request: ${body}`, LogLevel.error);
            break;
          default:
            Print.log(`Unexpected error: ${error.statusText} (${error.status})`, LogLevel.error);
        }
      }

      return false;
    }
  }
}
