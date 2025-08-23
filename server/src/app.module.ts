import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { CommentsModule } from './modules/comments.module';
import { SecurityModule } from './modules/security/security.module';
import { getTypeOrmConfig } from './config/typeorm.config';

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
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
            clientId: 'comments-service',
          },
          consumer: {
            groupId: 'comments-consumer-group',
          },
        },
      },
    ]),

    // Schedule module for cron jobs
    ScheduleModule.forRoot(),

    // Application modules
    SecurityModule,
    CommentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
