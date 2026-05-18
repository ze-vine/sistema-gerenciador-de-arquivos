import { PrismaService } from "../prisma/prisma.service"
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) throw new UnauthorizedException("E-mail ou senha incorretos!");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new UnauthorizedException("E-mail ou senha incorretos!");

        const payload = {
            sub: user.id, 
            jti: uuidv4()
        }

        const token = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: "15m"
        });
        
        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        }
    }

    async desvalidateToken(token: string): Promise<void> {
        const tokenDecodificado = this.jwtService.decode(token);
        await this.prisma.tokenBlacklist.create({
            data: {
                jti: tokenDecodificado.jti,
                expiresAt: new Date(tokenDecodificado.exp * 1000)
            }
        });
    }
}