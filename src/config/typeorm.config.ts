/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/require-await */
// src/config/typeorm.config.ts
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => {
    return {
      type: 'mysql',
      host: configService.get<string>('DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_DATABASE'),
      entities: [], // Add all your entities here
      synchronize: true, // !! IMPORTANT: Set to false in production, use migrations instead
      logging: configService.get<string>('NODE_ENV') !== 'production', // Log SQL in dev
      autoLoadEntities: true, // Recommended if entities are defined in feature modules
    };
  },
};

// Optional: Synchronous config if you don't need async loading (less common now)
// export const typeOrmConfig: TypeOrmModuleOptions = { ... };
