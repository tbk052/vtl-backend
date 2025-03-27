/* eslint-disable prettier/prettier */
// src/posts/entities/post.entity.ts
import { User } from '../../users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Index({ unique: true }) // Ensure slugs are unique
  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string; // URL-friendly identifier

  @Column({ type: 'text' }) // Use 'text' for longer content
  content: string;

  @Column({ type: 'boolean', default: true }) // Whether the post is visible
  published: boolean;

  @ManyToOne(() => User, (user) => user.posts, {
    eager: false, // Don't automatically load author unless specified in query
    onDelete: 'SET NULL', // If author is deleted, set author_id to NULL
    nullable: true, // Allow posts without an author (e.g., system posts)
  })
  author: User; // Relation: Many posts belong to one User

  @Column({ nullable: true }) // Store the author's ID directly for easier querying if needed
  authorId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // TODO: Add a @BeforeInsert or @BeforeUpdate hook to generate the slug from the title
  // Example (requires a slugify library like 'slug'):
  // @BeforeInsert()
  // @BeforeUpdate()
  // generateSlug() {
  //   if (this.title) {
  //      const slugify = require('slug'); // Or import slugify
  //      this.slug = slugify(this.title, { lower: true });
  //   }
  // }
}
