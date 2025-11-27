import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule } from '@nestjs/throttler';
import { SharedModule } from './shared/shared.module';
import { IdentityModule } from './modules/identity/identity.module';
import { QuizModule } from './modules/quiz/quiz.module';
import { EconomyModule } from './modules/economy/economy.module';
import { GamificationModule } from './modules/gamification/gamification.module';
import { LeaderboardModule } from './modules/leaderboard/leaderboard.module';

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

    // Shared Infrastructure (Global)
    SharedModule,

    // Bounded Context Modules
    IdentityModule,
    QuizModule,
    EconomyModule,
    GamificationModule,
    LeaderboardModule,
  ],
  providers: [],
})
export class AppModule {}
