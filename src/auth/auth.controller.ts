/* eslint-disable prettier/prettier */
// src/auth/auth.controller.ts
import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    // Add validation pipe in main.ts or use @UsePipes(ValidationPipe) here
    return this.authService.register(createUserDto);
  }

  // Use LocalAuthGuard which uses the LocalStrategy
  @UseGuards(LocalAuthGuard) // This guard triggers the LocalStrategy's validate method
  @Post('login')
  @HttpCode(HttpStatus.OK) // Return 200 OK on successful login
  async login(@Request() req, @Body() loginDto: LoginDto) {
    // loginDto is technically validated by LocalStrategy, but keeping it shows intent
    // If LocalAuthGuard passes, req.user is populated by Passport
    return this.authService.login(req.user as Omit<User, 'password'>);
  }

  // Example protected route: Get current user profile
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    // req.user is populated by JwtStrategy's validate method
    // The shape depends on what you return from validate() in JwtStrategy
    // E.g., { userId: '...', email: '...', role: '...' }
    return req.user;
  }
}
