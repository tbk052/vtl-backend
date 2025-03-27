/* eslint-disable prettier/prettier */
// src/posts/posts.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { User } from '../users/entities/user.entity'; // Import User type

// Public routes (anyone can access)
@Controller('posts')
export class PostsPublicController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findPublicPublished() {
    return this.postsService.findAllPublic();
  }

  @Get(':idOrSlug')
  findOnePublic(@Param('idOrSlug') idOrSlug: string) {
    // Basic check if it might be a UUID, otherwise treat as slug
    const isUUID =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        idOrSlug,
      );
    if (isUUID) {
      // You might want separate endpoints or more robust logic
      // This combines fetching by UUID or slug
      return this.postsService.findOnePublic(idOrSlug);
    } else {
      return this.postsService.findOnePublic(idOrSlug);
    }
  }
}

// Admin routes (require login and admin role)
@Controller('admin/posts') // Prefix admin routes
@UseGuards(JwtAuthGuard, RolesGuard) // Apply JWT and Role guards
@Roles(UserRole.ADMIN) // Only allow users with ADMIN role
export class PostsAdminController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto, @Request() req) {
    // req.user is populated by JwtStrategy { userId, email, role }
    const author = req.user as Partial<User> & { id: string }; // Type assertion
    author.id = req.user.userId; // Map userId to id if needed
    return this.postsService.create(createPostDto, author as User);
  }

  @Get() // GET /admin/posts - List all posts for admin
  findAllAdmin() {
    return this.postsService.findAllAdmin();
  }

  @Get(':id') // GET /admin/posts/:id - Get specific post details for admin
  findOneAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.postsService.findOneAdmin(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req,
  ) {
    const user = req.user as Partial<User> & { id: string; role: UserRole };
    user.id = req.user.userId;
    return this.postsService.update(id, updatePostDto, user as User);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    const user = req.user as Partial<User> & { id: string; role: UserRole };
    user.id = req.user.userId;
    return this.postsService.remove(id, user as User);
  }
}

// Note: We split controllers here for clarity (Public vs Admin).
// You could combine them and apply guards/decorators at the method level.
