/* eslint-disable prettier/prettier */
// src/posts/dto/update-post.dto.ts
import { PartialType } from '@nestjs/mapped-types'; // Or @nestjs/swagger
import { CreatePostDto } from './create-post.dto';

// Makes all properties of CreatePostDto optional
export class UpdatePostDto extends PartialType(CreatePostDto) {}
