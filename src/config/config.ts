import { registerAs } from '@nestjs/config';
import { env } from 'node:process';
export enum ConfigKey {
  App = 'APP',
  Db = 'DB',
}

export enum Environment {
  Development = 'development',
  Testing = 'testing',
  Production = 'production',
}

const APPConfig = registerAs(ConfigKey.App, () => ({
  env: Environment[env.NODE_ENV as keyof typeof Environment] || 'development',
  port: Number(env.APP_PORT),
}));

const DBConfig = registerAs(ConfigKey.Db, () => ({
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
}));

export const configurations = [APPConfig, DBConfig];
