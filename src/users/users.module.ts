/* eslint-disable prettier/prettier */
// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
// import { UsersController } from './users.controller'; // Add if you need user endpoints later

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  // controllers: [UsersController], // Uncomment if you create a controller
  exports: [UsersService], // Export service to be used by AuthModule
})
export class UsersModule {}
