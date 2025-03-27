/* eslint-disable prettier/prettier */
// src/auth/guards/local-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {} // 'local' refers to the LocalStrategy
