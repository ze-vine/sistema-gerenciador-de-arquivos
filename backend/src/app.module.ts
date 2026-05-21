import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TokenBlacklistCleaner } from './token-blacklist-cleaner.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ScheduleModule.forRoot(), UsersModule, FilesModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService, TokenBlacklistCleaner],
})
export class AppModule {}
