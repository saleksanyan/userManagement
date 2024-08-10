import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/modules/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from 'process';
import { configurations } from './config/config';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      load: [...configurations, databaseConfig],
      isGlobal: true,
      cache: true,
      envFilePath: [`.env.${env.NODE_ENV || 'development'}`],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
