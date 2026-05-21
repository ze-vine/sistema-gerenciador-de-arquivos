// src/auth/auth.guard.ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = request.cookies?.access_token;

    if (!token) throw new UnauthorizedException();

    try {
      const payload = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });

      const bannedToken = await this.prisma.tokenBlacklist.findUnique({
        where: {
          jti: payload.jti
        }
      });

      if (bannedToken) throw new UnauthorizedException("Token inválido ou expirado!");

      const user = await this.prisma.user.findUnique(
        { where: { id: payload.sub } },
      );

      if (!user) {throw new UnauthorizedException("Usuário não encontrado!");}

      request['user'] = payload;
    } catch (e) {
      if (e instanceof UnauthorizedException) {throw e;}

      throw new UnauthorizedException("Token inválido ou expirado!");
    }
    return true;
  }

}