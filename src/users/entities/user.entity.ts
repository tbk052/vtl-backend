/* eslint-disable prettier/prettier */
// src/users/entities/user.entity.ts
import { Post } from '../../posts/entities/post.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  Index,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users') // Specifies the table name
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true }) // Index for faster lookups and uniqueness constraint
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, select: false }) // select: false prevents password from being returned by default
  password: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  firstName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lastName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToMany(() => Post, (post) => post.author) // Relation to Posts
  posts: Post[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Hash password before saving
  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      const saltRounds = 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  }

  // Method to validate password (used during login)
  async validatePassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.password);
  }
}
