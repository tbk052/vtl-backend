/* eslint-disable prettier/prettier */
// src/users/dto/create-user.dto.ts
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  // Optional: Allow setting role during creation (e.g., for seeding admin)
  // Usually, you'd default to USER and have a separate mechanism for admins
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = UserRole.USER;
}
