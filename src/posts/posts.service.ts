/* eslint-disable prettier/prettier */
// src/posts/posts.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User, UserRole } from '../users/entities/user.entity';
import slugify from 'slugify';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, author: User): Promise<Post> {
    const post = this.postsRepository.create({
      ...createPostDto,
      author: author, // Associate with the logged-in user
      authorId: author.id,
      // Generate slug if not provided
      slug: createPostDto.slug || this.generateSlug(createPostDto.title),
    });

    // Simple check for slug uniqueness (can be improved with retry logic)
    const existing = await this.postsRepository.findOneBy({ slug: post.slug });
    if (existing) {
      post.slug = `${post.slug}-${Date.now()}`; // Append timestamp if slug exists
    }

    return this.postsRepository.save(post);
  }

  async findAllPublic(): Promise<Post[]> {
    // Find all published posts, potentially order them
    return this.postsRepository.find({
      where: { published: true },
      order: { createdAt: 'DESC' },
      // relations: ['author'] // Optionally load author details
    });
  }

  async findAllAdmin(): Promise<Post[]> {
    // Admin view - show all posts
    return this.postsRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['author'], // Load author details for admin view
    });
  }

  async findOnePublic(idOrSlug: string): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: [
        { id: idOrSlug, published: true }, // Find by ID if published
        { slug: idOrSlug, published: true }, // Or find by slug if published
      ],
      // relations: ['author']
    });
    if (!post) {
      throw new NotFoundException(
        `Published post with identifier "${idOrSlug}" not found`,
      );
    }
    return post;
  }

  async findOneAdmin(idOrSlug: string): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: [{ id: idOrSlug }, { slug: idOrSlug }], // Find by ID or slug (any status)
      relations: ['author'], // Load author for admin
    });
    if (!post) {
      throw new NotFoundException(
        `Post with identifier "${idOrSlug}" not found`,
      );
    }
    return post;
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    user: User,
  ): Promise<Post> {
    const post = await this.findOneAdmin(id); // Find regardless of published status

    // Authorization check: Only Admin or the original author can update (adjust logic as needed)
    // if (user.role !== UserRole.ADMIN && post.authorId !== user.id) {
    //     throw new ForbiddenException('You do not have permission to update this post.');
    // }
    // For this example: Only Admin can update
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only administrators can update posts.');
    }

    // Handle slug update if title changes and slug is not explicitly provided
    if (
      updatePostDto.title &&
      !updatePostDto.slug &&
      updatePostDto.title !== post.title
    ) {
      updatePostDto.slug = this.generateSlug(updatePostDto.title);
      // Add check for slug uniqueness on update as well if necessary
      const existing = await this.postsRepository.findOne({
        where: { slug: updatePostDto.slug },
      });
      if (existing && existing.id !== post.id) {
        updatePostDto.slug = `${updatePostDto.slug}-${Date.now()}`;
      }
    }

    // Merge changes and save
    this.postsRepository.merge(post, updatePostDto);
    return this.postsRepository.save(post);
  }

  async remove(id: string, user: User): Promise<void> {
    const post = await this.findOneAdmin(id); // Find the post first

    // Authorization check: Only Admin can delete
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only administrators can delete posts.');
    }

    const result = await this.postsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }
  }

  private generateSlug(title: string): string {
    return slugify(title, { lower: true, strict: true, trim: true });
  }
}
