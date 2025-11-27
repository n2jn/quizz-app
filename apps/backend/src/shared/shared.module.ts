import { Global, Module } from '@nestjs/common';
import { PrismaService } from './infrastructure/database/prisma.service';
import { EventBusService } from './infrastructure/events/event-bus.service';
import { LoggerService } from './infrastructure/logging/logger.service';

/**
 * Shared Module
 *
 * Provides common infrastructure services to all bounded contexts.
 * Marked as @Global so it's available everywhere without explicit imports.
 */
@Global()
@Module({
  providers: [PrismaService, EventBusService, LoggerService],
  exports: [PrismaService, EventBusService, LoggerService],
})
export class SharedModule {}
