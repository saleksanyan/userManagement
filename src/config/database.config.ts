import { registerAs } from '@nestjs/config';
import { env } from 'node:process';

export default registerAs('database', () => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: false,
  logging: `.env`,

  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [`${__dirname}/database/migrations/*{.ts,.js}`],
  migrationsTableName: 'migrations',
  migrationsRun: false,
}));
