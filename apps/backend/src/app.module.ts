import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    // Global Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
    }),

    // Event Emitter for Domain Events
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 10,
      verboseMemoryLeak: true,
      ignoreErrors: false,
    }),

    // Rate Limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute (default)
      },
    ]),

    // Database
    PrismaModule,

    // Existing modules (to be migrated to Clean Architecture)
    AuthModule,
    UsersModule,

    // Bounded Context Modules (to be added in next phases)
    // IdentityModule,
    // QuizModule,
    // GamificationModule,
    // LeaderboardModule,
    // EconomyModule,
    // ContentModule,
  ],
  providers: [],
})
export class AppModule {}
