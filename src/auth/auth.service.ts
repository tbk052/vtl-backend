/* eslint-disable prettier/prettier */
// src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto'; // We'll create this

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await user.validatePassword(pass))) {
      const { password, ...result } = user; // Exclude password from result
      return result;
    }
    return null;
  }

  async login(user: Omit<User, 'password'>) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: user, // Return user details (without password)
    };
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.usersService.findOneByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }
    // Create user (password will be hashed by the entity's BeforeInsert hook)
    const newUser = await this.usersService.create(createUserDto);
    // Exclude password before returning
    delete newUser.password;
    return newUser;
  }
}
