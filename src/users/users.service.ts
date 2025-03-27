/* eslint-disable prettier/prettier */
// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto'; // We'll create this

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create(createUserDto);
    // Password hashing is handled by the @BeforeInsert hook in the entity
    await this.usersRepository.save(newUser);
    // Remove password before returning user object
    delete newUser.password;
    return newUser;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find(); // Excludes password due to select: false
  }

  async findOneById(id: string): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  // Find user by email, including the password field
  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password') // Explicitly select the password
      .getOne();
  }

  // Add other methods as needed (update, delete, etc.)
  // async remove(id: string): Promise<void> {
  //   await this.usersRepository.delete(id);
  // }
}
