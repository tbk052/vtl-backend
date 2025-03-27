/* eslint-disable prettier/prettier */
// src/config/typeorm.config.ts
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity'; // Adjust path as needed
import { Post } from '../posts/entities/post.entity'; // Adjust path as needed

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
      entities: [User, Post], // Add all your entities here
      synchronize: true, // !! IMPORTANT: Set to false in production, use migrations instead
      logging: configService.get<string>('NODE_ENV') !== 'production', // Log SQL in dev
      autoLoadEntities: true, // Recommended if entities are defined in feature modules
    };
  },
};

// Optional: Synchronous config if you don't need async loading (less common now)
// export const typeOrmConfig: TypeOrmModuleOptions = { ... };
