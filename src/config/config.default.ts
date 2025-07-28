/* eslint-disable no-process-env */

import localeConfig from '../locales';

const getRedisConfig = (db = 0, options: Record<string, unknown> = {}) => ({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT, 10),
  password: process.env.REDIS_PWD,
  db,
  ...options,
});

/*
  default中的配置项，会被config.xxxx.ts中相同配置项覆盖
*/
export default {
  koa: {
    port: Number(process.env.PORT),
    globalPrefix: process.env.GLOBAL_PREFIX,
  },
  midwayLogger: {
    default: {
      enableFile: false,
      enableConsole: false,
    },
  },
  redis: getRedisConfig(parseInt(process.env.REDIS_DB, 10)),
  bullmq: {
    defaultQueueOptions: {
      defaultJobOptions: {
        removeOnComplete: 3, // 成功后只保留最近 3 条记录
        removeOnFail: 10, // 失败后只保留最近 10 条记录
      },
    },
    defaultConnection: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
    // 可选，队列前缀
    defaultPrefix: 'midway-bullmq',
  },
  mongoose: {
    dataSource: {
      default: {
        uri: process.env.MONGODB_URI,
        options: {
          user: process.env.MONGODB_USER,
          pass: process.env.MONGODB_PASSWORD,
        },
      },
    },
  },
  NODE_ENV: process.env.NODE_ENV,
  aws: {
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretKey: process.env.AWS_SECRET_KEY,
    awsRegion: process.env.AWS_REGION,
  },
  keys: process.env.COOKIE_SIGN_KEY,
  i18n: {
    defaultLocale: 'en-us',
    localeTable: localeConfig,
    fallbacks: {
      '*': 'en-us',
    },
    writeCookie: false,
    resolver: false,
  },
};
