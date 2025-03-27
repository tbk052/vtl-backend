/* eslint-disable prettier/prettier */
// src/posts/dto/create-post.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  title: string;

  // Slug could be generated automatically in the service/entity hook
  @IsOptional()
  @IsString()
  @MaxLength(255)
  slug?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  content: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean = true;

  // authorId will be set from the authenticated user in the service
}
