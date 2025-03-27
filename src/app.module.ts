/* eslint-disable prettier/prettier */
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './config/typeorm.config'; // We'll create this
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsService } from './posts/posts.service';
import { PostsController } from './posts/posts.controller';
import { PostsModule } from './posts/posts.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigService available globally
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig), // Use async config
    AuthModule,
    UsersModule,
    PostsModule,
  ],
  controllers: [AppController, AuthController, PostsController],
  providers: [AppService, UsersService, AuthService, PostsService],
})
export class AppModule {}
