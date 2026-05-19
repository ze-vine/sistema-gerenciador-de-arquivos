import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class TokenBlacklistCleaner {

    constructor (private prismaService: PrismaService) {}

    @Cron(CronExpression.EVERY_HOUR)
    async handleCron() {
        await this.prismaService.tokenBlacklist.deleteMany({ where: { expiresAt: { lt: new Date() } } });
    }
}