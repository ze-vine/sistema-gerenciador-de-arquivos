import { PrismaService } from "../prisma/prisma.service"
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) throw new UnauthorizedException("Credenciais inválidas!");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new UnauthorizedException("Credenciais inválidas!");

        const payload = { sub: user.id, email: user.email };
        
        return { acess_token: await this.jwtService.signAsync(payload), }
    }
}