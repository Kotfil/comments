import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MicroservicesModule } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { CommentsModule } from './modules/comments.module';
import { SecurityModule } from './modules/security/security.module';
import { CleanupService } from './services/cleanup.service';
import { CleanupController } from './controllers/cleanup.controller';
import { getTypeOrmConfig } from './config/typeorm.config';
import { getKafkaConfig } from './config/kafka.config';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getTypeOrmConfig,
      inject: [ConfigService],
    }),

    // GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      introspection: true,
      context: ({ req, res }) => ({ req, res }),
    }),

    // Microservices (Kafka)
    MicroservicesModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getKafkaConfig,
      inject: [ConfigService],
    }),

    // Schedule module for cron jobs
    ScheduleModule.forRoot(),

    // Application modules
    SecurityModule,
    CommentsModule,
  ],
  controllers: [CleanupController],
  providers: [CleanupService],
})
export class AppModule {}
