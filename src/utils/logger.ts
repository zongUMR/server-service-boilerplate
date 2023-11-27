import { EmptyTransport } from '@midwayjs/logger';
import WinstonCloudwatch from 'winston-cloudwatch';

interface IAppInfo {
  app: string;
  hostname: string;
  version: string;
}

export class CloudwatchTransport extends EmptyTransport {
  private winstonCloudwatch: WinstonCloudwatch;

  constructor(
    options?: WinstonCloudwatch.CloudwatchTransportOptions & IAppInfo
  ) {
    super(options);

    // 具体的配置和使用方式请参考winston-cloudwatch文档
    const cloudwatchOptions = {
      logGroupName: options.app,
      logStreamName: `${options.version}-${options.hostname}`,
      awsOptions: {
        credentials: {
          accessKeyId: options.awsAccessKeyId,
          secretAccessKey: options.awsSecretKey,
        },
        region: options.awsRegion,
      },
    };

    this.winstonCloudwatch = new WinstonCloudwatch(cloudwatchOptions);
  }

  log(info: any, callback) {
    if (info.ctx && !info.message.message) {
      info.message = JSON.stringify({
        message: info.message,
        requestId: info.ctx.request.header['x-onekey-request-id'],
      });
    }
    this.winstonCloudwatch.log(info, callback);
  }
}
